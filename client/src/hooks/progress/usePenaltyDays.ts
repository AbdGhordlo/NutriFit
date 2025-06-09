import { useState, useEffect, useCallback } from "react";
import * as progressService from "../../services/progressService";

export interface PenaltyDaysData {
  penaltyDaysCount: number;
  loading: boolean;
  error: string | null;
  incrementPenaltyDay: () => Promise<void>;
  decrementPenaltyDay: () => Promise<void>;
  refetch: () => void;
}

export function usePenaltyDays(userId: number, token: string): PenaltyDaysData {
  const [penaltyDaysCount, setPenaltyDaysCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPenaltyDays = useCallback(async () => {
    if (!userId || !token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await progressService.fetchPenaltyDaysCount(userId, token);
      setPenaltyDaysCount(data.penalty_days_count);
    } catch (e: any) {
      setError(e.message || "Failed to fetch penalty days");
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchPenaltyDays();
      console.log("Penalty Days Count:", penaltyDaysCount);

  }, [fetchPenaltyDays]);

  const incrementPenaltyDay = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await progressService.updatePenaltyDaysCount(userId, true, token);
      setPenaltyDaysCount(data.penalty_days_count);
    } catch (e: any) {
      setError(e.message || "Failed to increment penalty day");
    } finally {
      setLoading(false);
    }
  };

  const decrementPenaltyDay = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await progressService.updatePenaltyDaysCount(userId, false, token);
      setPenaltyDaysCount(data.penalty_days_count);
    } catch (e: any) {
      setError(e.message || "Failed to decrement penalty day");
    } finally {
      setLoading(false);
    }
  };


  return {
    penaltyDaysCount,
    loading,
    error,
    incrementPenaltyDay,
    decrementPenaltyDay,
    refetch: fetchPenaltyDays,
  };
}
