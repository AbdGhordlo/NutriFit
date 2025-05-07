export interface Meal {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  mealPlanMealId: number;
}

export interface DayPlan {
  day_number: number;
  meals: Meal[];
}

export interface GeneratedMealPlan {
  meal_plan: {
    name: string;
    description: string;
  };
  meals: {
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    time: string;
    day_number: number;
  }[];
}