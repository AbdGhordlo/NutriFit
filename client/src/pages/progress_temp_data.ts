export const streakData = {
  daily: {
    exercises: 1, // 3 exercises completed
    maxExercises: 2, // out of 2 exercises per day
    meals: 3, // 3 meals completed
    maxMeals: 5, // out of 7 meals per days
    completedDays: 3
  },
  weekly: {
    current: 2, // 2 weeks in a row
    max: 4, // out of 4 weeks in a month
  },
  monthly: {
    current: 2, // 2 months in a row
    max: 5, // out of 12 months in a year
  },
};

export const goalData = {
    startDate: new Date(2025, 0, 1), // January 1, 2023
    targetDate: new Date(2025, 4, 27), // December 31, 2023
    targetWeight: 65, // kg
    startWeight: 80, // kg
    currentWeight: 70, // kg
    cheatingDays: 5 // Number of days user has "cheated" on their diet/exercise plan
  };
  
export const historicalData = {
    weight: [
      { date: '2023-01-01', value: 75 },
      { date: '2023-02-01', value: 73 },
      { date: '2023-03-01', value: 72 },
      { date: '2023-04-01', value: 71 },
      { date: '2023-05-01', value: 70 }
    ],
    height: [{ date: '2023-01-01', value: 175 }],
    waist: [
      { date: '2023-01-01', value: 85 },
      { date: '2023-02-01', value: 83 },
      { date: '2023-03-01', value: 82 },
      { date: '2023-04-01', value: 81 },
      { date: '2023-05-01', value: 80 }
    ],
    hip: [
      { date: '2023-01-01', value: 98 },
      { date: '2023-02-01', value: 97 },
      { date: '2023-03-01', value: 96 },
      { date: '2023-04-01', value: 95.5 },
      { date: '2023-05-01', value: 95 }
    ],
    bodyFatMass: [
      { date: '2023-01-01', value: 18 },
      { date: '2023-02-01', value: 17 },
      { date: '2023-03-01', value: 16 },
      { date: '2023-04-01', value: 15 },
      { date: '2023-05-01', value: 14 }
    ],
    leanBodyMass: [
      { date: '2023-01-01', value: 57 },
      { date: '2023-02-01', value: 56 },
      { date: '2023-03-01', value: 56 },
      { date: '2023-04-01', value: 56 },
      { date: '2023-05-01', value: 56 }
    ],
    waistToHipRatio: [
      { date: '2023-01-01', value: 0.87 },
      { date: '2023-02-01', value: 0.86 },
      { date: '2023-03-01', value: 0.85 },
      { date: '2023-04-01', value: 0.85 },
      { date: '2023-05-01', value: 0.84 }
    ],
    bmi: [
      { date: '2023-01-01', value: 24.5 },
      { date: '2023-02-01', value: 23.8 },
      { date: '2023-03-01', value: 23.5 },
      { date: '2023-04-01', value: 23.2 },
      { date: '2023-05-01', value: 22.9 }
    ]
  };