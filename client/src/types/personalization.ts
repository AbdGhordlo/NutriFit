// src/types/personalization.ts

export type Step = 1 | 2 | 3 | 4 | 5;

export interface PersonalInfo {
  height: number;
  weight: number;
  gender: 'male' | 'female';
  age: number;
}

export interface WeightGoal {
  targetWeight: number;
  timeframe: number; // in weeks
}

export type FitnessGoal = 
  | { type: 'lose_weight'; goal: WeightGoal }
  | { type: 'build_muscle'; goal: WeightGoal }
  | { type: 'body_recomposition' }
  | { type: 'improve_health' };

export type ActivityLevel = 'very_light' | 'light' | 'moderate' | 'intense' | 'very_intense';

export type ActivityType =
  | 'running'
  | 'walking'
  | 'cycling'
  | 'swimming'
  | 'strength'
  | 'bodyweight'
  | 'yoga'
  | 'martial_arts'
  | 'team_sports'
  | 'dance'
  | 'hiking'
  | 'stretching';

export type Equipment =
  | 'gym'
  | 'dumbbells'
  | 'yoga_mat'
  | 'resistance_bands'
  | 'pool'
  | 'bike'
  | 'running_track'
  | 'none_equipment';

export interface ActivityPreferences {
  activityLevel: ActivityLevel;
  activityTypes: ActivityType[];
  equipmentAccess: Equipment[];
}

export type Cuisine = 'mediterranean' | 'asian' | 'american' | 'indian' | 'mexican';
export type DietPreference = 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'none';
export type HealthIssue = 'diabetes' | 'allergies' | 'celiac' | 'none';
export type Budget = 'basic' | 'standard' | 'premium' | 'luxury';
