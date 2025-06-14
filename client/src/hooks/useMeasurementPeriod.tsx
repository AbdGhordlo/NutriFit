import { useCallback } from "react";

export interface Measurement {
  type: string;
  value: number;
  date: Date;
  id: string;
}

interface MeasurementPeriodHook {
  checkMeasurementPeriod: (type: string) => {
    isWithinPeriod: boolean;
    existingMeasurement: Measurement | null;
  };
  saveMeasurement: (type: string, value: number) => Promise<void>;
  getMeasurementHistory: (type: string) => Measurement[];
  measurements: Measurement[];
}

/**
 * Custom hook for managing measurements with two-week period restrictions, using real backend data
 */
export function useMeasurementPeriod({
  measurements,
  onSaveMeasurement,
}: {
  measurements: Measurement[];
  onSaveMeasurement: (type: string, value: number) => Promise<void>;
}): MeasurementPeriodHook {
  // Checks if a measurement exists within the current two-week period
  const checkMeasurementPeriod = useCallback(
    (type: string) => {
      const now = new Date();
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      // Find the most recent measurement of this type
      const existingMeasurement =
        measurements
          .filter((m) => m.type === type)
          .sort((a, b) => b.date.getTime() - a.date.getTime())[0] || null;
      // Check if the measurement is within the current two-week period
      const isWithinPeriod = existingMeasurement
        ? existingMeasurement.date >= twoWeeksAgo
        : false;
      return {
        isWithinPeriod,
        existingMeasurement,
      };
    },
    [measurements]
  );

  // Save a new measurement using the provided callback
  const saveMeasurement = useCallback(
    async (type: string, value: number) => {
      await onSaveMeasurement(type, value);
    },
    [onSaveMeasurement]
  );

  // Gets the measurement history for a specific type
  const getMeasurementHistory = useCallback(
    (type: string) => {
      return measurements
        .filter((m) => m.type === type)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    },
    [measurements]
  );

  return {
    checkMeasurementPeriod,
    saveMeasurement,
    getMeasurementHistory,
    measurements,
  };
}
