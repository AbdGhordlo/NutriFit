import { useState, useCallback, useEffect } from "react";
import * as progressService from "../../services/progressService";

export interface MeasurementHistoryItem {
  value: number;
  date: string;
  unit: string;
}

export interface UseAnthropometricDataResult {
  weightHistory: MeasurementHistoryItem[];
  heightHistory: MeasurementHistoryItem[];
  waistHistory: MeasurementHistoryItem[];
  hipHistory: MeasurementHistoryItem[];
  fatMassHistory: MeasurementHistoryItem[];
  leanMassHistory: MeasurementHistoryItem[];
  currentWeight: { value: number; unit: string } | null;
  currentHeight: { value: number; unit: string } | null;
  currentWaist: { value: number; unit: string } | null;
  currentHip: { value: number; unit: string } | null;
  currentFatMass: { value: number; unit: string } | null;
  currentLeanMass: { value: number; unit: string } | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  saveMeasurement: (type: string, value: number) => Promise<void>;
}

export function useAnthropometricData(userId: number, token: string): UseAnthropometricDataResult {
  const [weightHistory, setWeightHistory] = useState<MeasurementHistoryItem[]>([]);
  const [heightHistory, setHeightHistory] = useState<MeasurementHistoryItem[]>([]);
  const [waistHistory, setWaistHistory] = useState<MeasurementHistoryItem[]>([]);
  const [hipHistory, setHipHistory] = useState<MeasurementHistoryItem[]>([]);
  const [fatMassHistory, setFatMassHistory] = useState<MeasurementHistoryItem[]>([]);
  const [leanMassHistory, setLeanMassHistory] = useState<MeasurementHistoryItem[]>([]);
  const [currentWeight, setCurrentWeight] = useState<{ value: number; unit: string } | null>(null);
  const [currentHeight, setCurrentHeight] = useState<{ value: number; unit: string } | null>(null);
  const [currentWaist, setCurrentWaist] = useState<{ value: number; unit: string } | null>(null);
  const [currentHip, setCurrentHip] = useState<{ value: number; unit: string } | null>(null);
  const [currentFatMass, setCurrentFatMass] = useState<{ value: number; unit: string } | null>(null);
  const [currentLeanMass, setCurrentLeanMass] = useState<{ value: number; unit: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUnitForType = (type: string) => {
    switch (type) {
      case "weight":
      case "bodyFatMass":
      case "leanBodyMass":
        return "kg";
      case "height":
      case "waist":
      case "hip":
        return "cm";
      default:
        return "";
    }
  };

  const getApiType = (type: string) => {
    switch (type) {
      case "bodyFatMass":
        return "fat_mass";
      case "leanBodyMass":
        return "lean_mass";
      default:
        return type;
    }
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [weightData, heightData, waistData, hipData, fatMassData, leanMassData] = await Promise.all([
        progressService.getMeasurementsByType(userId, "weight", token),
        progressService.getMeasurementsByType(userId, "height", token),
        progressService.getMeasurementsByType(userId, "waist", token),
        progressService.getMeasurementsByType(userId, "hip", token),
        progressService.getMeasurementsByType(userId, "fat_mass", token),
        progressService.getMeasurementsByType(userId, "lean_mass", token),
      ]);
      setWeightHistory(weightData.map((m: any) => ({ value: m.value, date: m.measured_at, unit: m.unit })));
      setHeightHistory(heightData.map((m: any) => ({ value: m.value, date: m.measured_at, unit: m.unit })));
      setWaistHistory(waistData.map((m: any) => ({ value: m.value, date: m.measured_at, unit: m.unit })));
      setHipHistory(hipData.map((m: any) => ({ value: m.value, date: m.measured_at, unit: m.unit })));
      setFatMassHistory(fatMassData.map((m: any) => ({ value: m.value, date: m.measured_at, unit: m.unit })));
      setLeanMassHistory(leanMassData.map((m: any) => ({ value: m.value, date: m.measured_at, unit: m.unit })));
      if (weightData.length > 0) {
        const lastWeight = weightData.reduce((a: any, b: any) => new Date(a.measured_at) > new Date(b.measured_at) ? a : b);
        setCurrentWeight({ value: lastWeight.value, unit: lastWeight.unit });
      }
      if (heightData.length > 0) {
        const lastHeight = heightData.reduce((a: any, b: any) => new Date(a.measured_at) > new Date(b.measured_at) ? a : b);
        setCurrentHeight({ value: lastHeight.value, unit: lastHeight.unit });
      }
      if (waistData.length > 0) {
        const lastWaist = waistData.reduce((a: any, b: any) => new Date(a.measured_at) > new Date(b.measured_at) ? a : b);
        setCurrentWaist({ value: lastWaist.value, unit: lastWaist.unit });
      }
      if (hipData.length > 0) {
        const lastHip = hipData.reduce((a: any, b: any) => new Date(a.measured_at) > new Date(b.measured_at) ? a : b);
        setCurrentHip({ value: lastHip.value, unit: lastHip.unit });
      }
      if (fatMassData.length > 0) {
        const lastFatMass = fatMassData.reduce((a: any, b: any) => new Date(a.measured_at) > new Date(b.measured_at) ? a : b);
        setCurrentFatMass({ value: lastFatMass.value, unit: lastFatMass.unit });
      }
      if (leanMassData.length > 0) {
        const lastLeanMass = leanMassData.reduce((a: any, b: any) => new Date(a.measured_at) > new Date(b.measured_at) ? a : b);
        setCurrentLeanMass({ value: lastLeanMass.value, unit: lastLeanMass.unit });
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch anthropometric data");
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  const saveMeasurement = useCallback(async (type: string, value: number) => {
    const unit = getUnitForType(type);
    const apiType = getApiType(type);
    const measured_at = new Date().toISOString();
    let history: MeasurementHistoryItem[] = [];
    switch (type) {
      case "weight":
        history = weightHistory;
        break;
      case "height":
        history = heightHistory;
        break;
      case "waist":
        history = waistHistory;
        break;
      case "hip":
        history = hipHistory;
        break;
      case "bodyFatMass":
        history = fatMassHistory;
        break;
      case "leanBodyMass":
        history = leanMassHistory;
        break;
      default:
        break;
    }
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const recent = history.find((m) => new Date(m.date) >= twoWeeksAgo);
    try {
      if (recent) {
        await progressService.editLastMeasurement(userId, apiType, value, unit, measured_at, token);
      } else {
        await progressService.addMeasurement(userId, apiType, value, unit, measured_at, token);
      }
      await fetchAll();
    } catch (e: any) {
      setError(e.message || "Failed to save measurement");
    }
  }, [userId, token, weightHistory, heightHistory, waistHistory, hipHistory, fatMassHistory, leanMassHistory, fetchAll]);

  useEffect(() => {
    if (userId && token) {
      fetchAll();
    }
  }, [userId, token, fetchAll]);

  return {
    weightHistory,
    heightHistory,
    waistHistory,
    hipHistory,
    fatMassHistory,
    leanMassHistory,
    currentWeight,
    currentHeight,
    currentWaist,
    currentHip,
    currentFatMass,
    currentLeanMass,
    loading,
    error,
    fetchAll,
    saveMeasurement,
  };
}
