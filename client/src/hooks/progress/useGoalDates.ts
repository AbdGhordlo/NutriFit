import { useState, useEffect, useCallback } from "react";
import * as personalizationService from "../../services/personalizationService";
import { addDays } from "date-fns";
import { usePenaltyDays } from "./usePenaltyDays";

interface GoalDatesData {
  startDate: Date | null;
  targetDate: Date | null;
  adjustedTargetDate: Date | null;
  loading: boolean;
  error: string | null;
  incrementPenaltyDay: () => Promise<void>;
  decrementPenaltyDay: () => Promise<void>;
  penaltyDaysCount: number;
  refetch: () => void;
}

export function useGoalDates(userId: number, token: string): GoalDatesData {
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [timeframe, setTimeframe] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    penaltyDaysCount,
    loading: penaltyLoading,
    error: penaltyError,
    incrementPenaltyDay,
    decrementPenaltyDay,
    refetch: refetchPenalty,
  } = usePenaltyDays(userId, token);

  // Fetch personalization data for startDate and timeframe
  const fetchGoalData = useCallback(async () => {
    if (!userId || !token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await personalizationService.fetchPersonalizationData(userId, token);
      // Assume updated_at is the start date
      const updatedAt = data?.updated_at || data?.created_at;
      const step2 = data?.steps_data?.step_2;
      const fitnessGoal = step2?.fitnessGoal;
      const tf = fitnessGoal?.goal?.timeframe || fitnessGoal?.timeframe;
      if (updatedAt && tf) {
        setStartDate(new Date(updatedAt));
        setTimeframe(tf);
        setTargetDate(addDays(new Date(updatedAt), tf * 7)); // assuming timeframe is in weeks
      } else {
        setStartDate(null);
        setTimeframe(null);
        setTargetDate(null);
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch goal data");
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchGoalData();
  }, [fetchGoalData]);

  // Calculate adjustedTargetDate
  const adjustedTargetDate = targetDate ? addDays(targetDate, penaltyDaysCount) : null;

  // When penalty days change, adjustedTargetDate updates automatically

  return {
    startDate,
    targetDate,
    adjustedTargetDate,
    loading: loading || penaltyLoading,
    error: error || penaltyError,
    incrementPenaltyDay,
    decrementPenaltyDay,
    penaltyDaysCount,
    refetch: () => {
      fetchGoalData();
      refetchPenalty();
    },
  };
}
