export type Step = 1 | 2 | 3 | 4 | 5;

export interface PersonalInfo {
  height: number;
  weight: number;
  gender: 'male' | 'female';
  age: number;
}

export interface WeightGoal {
  targetWeight: number;
  timeframe: number; // in weeks (could be changed)
}

export type FitnessGoal = 
  | { type: 'lose_weight'; goal: WeightGoal }
  | { type: 'build_muscle'; goal: WeightGoal }
  | { type: 'body_recomposition' }
  | { type: 'improve_health' };

export type Cuisine = 'mediterranean' | 'asian' | 'american' | 'indian' | 'mexican';
export type DietPreference = 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'none';
export type HealthIssue = 'diabetes' | 'allergies' | 'celiac' | 'none';
export type ActivityLevel = 'very_light' | 'light' | 'moderate' | 'intense' | 'very_intense';
export type Budget = 'basic' | 'standard' | 'premium' | 'luxury';