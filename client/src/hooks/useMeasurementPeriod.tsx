import { useState } from 'react';

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
  saveMeasurement: (type: string, value: number) => void;
  getMeasurementHistory: (type: string) => Measurement[];
  measurements: Measurement[];
}

/**
 * Custom hook for managing measurements with two-week period restrictions
 */
export function useMeasurementPeriod(): MeasurementPeriodHook {
  // In a real app, this would likely be persisted in local storage or a database
  const [measurements, setMeasurements] = useState<Measurement[]>([
    // Example measurement data - in a real app these would come from storage
    { type: 'weight', value: 70, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), id: '1' },
    { type: 'waist', value: 80, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), id: '2' },
    { type: 'height', value: 175, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), id: '3' },
  ]);

  /**
   * Checks if a measurement exists within the current two-week period
   */
  const checkMeasurementPeriod = (type: string) => {
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    // Find the most recent measurement of this type
    const existingMeasurement = measurements
      .filter(m => m.type === type)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0] || null;
    
    // Check if the measurement is within the current two-week period
    const isWithinPeriod = existingMeasurement 
      ? existingMeasurement.date >= twoWeeksAgo
      : false;
    
    return {
      isWithinPeriod,
      existingMeasurement
    };
  };

  /**
   * Saves a new measurement, overwriting if necessary
   */
  const saveMeasurement = (type: string, value: number) => {
    const { existingMeasurement, isWithinPeriod } = checkMeasurementPeriod(type);
    const now = new Date();
    
    if (isWithinPeriod && existingMeasurement) {
      // Update the existing measurement
      setMeasurements(prev => 
        prev.map(m => 
          m.id === existingMeasurement.id 
            ? { ...m, value, date: now } 
            : m
        )
      );
    } else {
      // Add a new measurement
      const newMeasurement: Measurement = {
        type,
        value,
        date: now,
        id: Date.now().toString()
      };
      
      setMeasurements(prev => [...prev, newMeasurement]);
    }
  };

  /**
   * Gets the measurement history for a specific type
   */
  const getMeasurementHistory = (type: string) => {
    return measurements
      .filter(m => m.type === type)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  return {
    checkMeasurementPeriod,
    saveMeasurement,
    getMeasurementHistory,
    measurements
  };
}