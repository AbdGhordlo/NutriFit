export interface Exercise {
  id: number;
  exercise_id: number;
  name: string;
  description: string;
  calories_burned: number;
  has_reps_sets: boolean;
  has_duration: boolean;
  reps?: number;
  sets?: number;
  duration?: string;
  time: string;
  exercise_plan_exercise_id: number;
}

export interface DayPlan {
  day_number: number;
  exercises: Exercise[];
}

export interface GeneratedExercisePlan {
  exercise_plan: {
    name: string;
    description: string;
  };
  exercises: {
    name: string;
    description: string;
    calories_burned: number;
    has_reps_sets: boolean;
    has_duration: boolean;
    reps?: number;
    sets?: number;
    duration?: number;
    time: string;
    day_number: number;
  }[];
}
