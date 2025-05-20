export interface Measurement {
    current: number;
    unit: string;
  }
  
  export interface Measurements {
    weight: Measurement;
    height: Measurement;
    waist: Measurement;
    hip: Measurement;
    bodyFatMass?: Measurement;
    leanBodyMass?: Measurement;
  }
  
  export interface DerivedMeasurements {
    whr: number;
    bmi: number;
    bodyFatMass?: number;
    leanBodyMass?: number;
  }
  
  export interface HistoricalDataPoint {
    date: string;
    value: number;
  }
  
  export interface HistoricalData {
    weight: HistoricalDataPoint[];
    height: HistoricalDataPoint[];
    waist: HistoricalDataPoint[];
    hip: HistoricalDataPoint[];
    bodyFatMass?: HistoricalDataPoint[];
    leanBodyMass?: HistoricalDataPoint[];
  }
  
  export interface MeasurementType {
    id: string;
    label: string;
    icon: string;
  }
  
  export interface Quote {
    text: string;
    author: string;
  }
  
  export interface StreakData {
    daily: {
      exercise: number;
      workout: number;
      max: number;
    };
    weekly: {
      current: number;
      max: number;
    };
    monthly: {
      current: number;
      max: number;
    };
  }
  
  export interface GoalData {
    startDate: Date;
    targetDate: Date;
    targetWeight: number;
    startWeight: number;
    currentWeight: number;
    cheatingDays: number;
  }