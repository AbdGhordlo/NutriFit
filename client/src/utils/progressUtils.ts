/**
 * Formats measurement units for display
 * @param {string} unit - The unit abbreviation
 * @return {string} - Formatted unit for display
 */
export const getFormattedUnit = (unit) => {
    switch (unit) {
      case 'kg':
        return 'kg';
      case 'lbs':
        return 'lbs';
      case 'cm':
        return 'cm';
      case 'in':
        return 'in';
      default:
        return unit;
    }
  };
  
  /**
   * Converts weight between metric and imperial units
   * @param {number} value - The weight value to convert
   * @param {string} fromUnit - The source unit ('kg' or 'lbs')
   * @param {string} toUnit - The target unit ('kg' or 'lbs')
   * @return {number} - The converted weight value
   */
  export const convertWeight = (value, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return value;
    
    if (fromUnit === 'kg' && toUnit === 'lbs') {
      return value * 2.20462;
    } else if (fromUnit === 'lbs' && toUnit === 'kg') {
      return value / 2.20462;
    }
    
    return value;
  };
  
  /**
   * Converts length measurements between metric and imperial units
   * @param {number} value - The measurement value to convert
   * @param {string} fromUnit - The source unit ('cm' or 'in')
   * @param {string} toUnit - The target unit ('cm' or 'in')
   * @return {number} - The converted measurement value
   */
  export const convertLength = (value, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return value;
    
    if (fromUnit === 'cm' && toUnit === 'in') {
      return value / 2.54;
    } else if (fromUnit === 'in' && toUnit === 'cm') {
      return value * 2.54;
    }
    
    return value;
  };
  
  /**
   * Calculates BMI (Body Mass Index)
   * @param {number} weight - Weight in kg
   * @param {number} height - Height in cm
   * @return {number} - Calculated BMI value
   */
  export const calculateBMI = (weight, height) => {
    // Convert height from cm to m
    const heightInMeters = height / 100;
    // BMI formula: weight (kg) / (height (m))^2
    return weight / (heightInMeters * heightInMeters);
  };
  
  /**
   * Gets BMI category based on BMI value
   * @param {number} bmi - BMI value
   * @return {string} - BMI category
   */
  export const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
    if (bmi >= 25 && bmi < 30) return 'Overweight';
    if (bmi >= 30) return 'Obese';
    return 'Unknown';
  };
  
  /**
   * Calculates body fat percentage using waist and hip measurements
   * This is a simplified formula and not medically accurate
   * @param {string} gender - 'male' or 'female'
   * @param {number} waist - Waist circumference in cm
   * @param {number} hip - Hip circumference in cm
   * @param {number} weight - Weight in kg
   * @param {number} height - Height in cm
   * @return {number} - Approximate body fat percentage
   */
  export const calculateBodyFatPercentage = (gender, waist, hip, weight, height) => {
    // Waist-to-hip ratio
    const whr = waist / hip;
    
    // Different formulas for men and women
    if (gender === 'male') {
      return (0.29288 * whr) + (0.0005 * weight) + (0.15845 * height) - 5.76377;
    } else {
      return (0.29669 * whr) + (0.00043 * weight) + (0.02963 * height) - 0.00112;
    }
  };
  
  /**
   * Calculates ideal weight based on height and gender
   * Using Devine formula (one of many formulas)
   * @param {number} height - Height in cm
   * @param {string} gender - 'male' or 'female'
   * @return {number} - Ideal weight in kg
   */
  export const calculateIdealWeight = (height, gender) => {
    // Convert height from cm to inches
    const heightInInches = height / 2.54;
    
    // Height in inches over 5 feet
    const heightOver5Feet = heightInInches - 60;
    
    if (gender === 'male') {
      return 50 + (2.3 * heightOver5Feet);
    } else {
      return 45.5 + (2.3 * heightOver5Feet);
    }
  };