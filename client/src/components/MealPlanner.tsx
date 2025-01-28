import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Wand2, Edit3 } from 'lucide-react';
import { styles } from './styles/MealPlannerStyles';

interface DayPlan {
  id: number;
  name: string;
  date: string;
  isToday: boolean;
  meals: {
    id: number;
    name: string;
    time: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }[];
}

const weeklyPlan: DayPlan[] = [
  {
    id: 0,
    name: 'Sunday',
    date: 'Mar 24',
    isToday: false,
    meals: [
      { id: 1, name: 'Avocado Toast with Eggs', time: '08:00', calories: 450, protein: 22, carbs: 35, fats: 28 },
      { id: 2, name: 'Protein Smoothie', time: '11:00', calories: 250, protein: 20, carbs: 25, fats: 8 },
      { id: 3, name: 'Grilled Chicken Bowl', time: '14:00', calories: 550, protein: 40, carbs: 45, fats: 22 },
      { id: 4, name: 'Greek Yogurt & Berries', time: '16:30', calories: 200, protein: 15, carbs: 20, fats: 5 },
      { id: 5, name: 'Salmon with Quinoa', time: '19:00', calories: 650, protein: 45, carbs: 40, fats: 32 }
    ]
  },
  {
    id: 1,
    name: 'Monday',
    date: 'Mar 25',
    isToday: true,
    meals: [
      { id: 1, name: 'Oatmeal with Fruits', time: '08:00', calories: 380, protein: 15, carbs: 45, fats: 12 },
      { id: 2, name: 'Nuts and Apple', time: '11:00', calories: 220, protein: 8, carbs: 20, fats: 15 },
      { id: 3, name: 'Turkey Wrap', time: '14:00', calories: 480, protein: 35, carbs: 40, fats: 18 },
      { id: 4, name: 'Protein Bar', time: '16:30', calories: 180, protein: 15, carbs: 18, fats: 6 },
      { id: 5, name: 'Tofu Stir-Fry', time: '19:00', calories: 520, protein: 30, carbs: 45, fats: 25 }
    ]
  },
  // Add more days here...
];

export default function MealPlanner() {
  const [currentDay, setCurrentDay] = useState(1); // Start with Monday (today)

  const handlePrevDay = () => {
    if (currentDay > 0) {
      setCurrentDay(currentDay - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDay < 6) {
      setCurrentDay(currentDay + 1);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContainer}>
        <h1 style={styles.title}>Weekly Plan</h1>
        
        <div style={styles.dayContainer(weeklyPlan[currentDay].isToday)}>
          <div style={styles.dayHeader}>
            <h2 style={styles.dayName}>
              {weeklyPlan[currentDay].name}
            </h2>
            <span style={styles.dayDate}>{weeklyPlan[currentDay].date}</span>
          </div>

          <div style={styles.mealsList}>
            {weeklyPlan[currentDay].meals.map(meal => (
              <div key={meal.id} style={styles.mealItem}>
                <div style={styles.mealInfo}>
                  <h3 style={styles.mealName}>{meal.name}</h3>
                  <div style={styles.mealTimeInfo}>
                    <span style={styles.mealTime}>{meal.time}</span>
                    <span style={styles.dot}>•</span>
                    <span style={styles.mealTime}>{meal.calories} kcal</span>
                  </div>
                </div>
                
                <div style={styles.macrosContainer}>
                  <div style={styles.macroItem}>
                    <span style={styles.macroValue}>{meal.protein}g</span>
                    <span style={styles.macroLabel}>Protein</span>
                  </div>
                  <div style={styles.macroItem}>
                    <span style={styles.macroValue}>{meal.carbs}g</span>
                    <span style={styles.macroLabel}>Carbs</span>
                  </div>
                  <div style={styles.macroItem}>
                    <span style={styles.macroValue}>{meal.fats}g</span>
                    <span style={styles.macroLabel}>Fats</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.navigationContainer}>
          <button
            onClick={handlePrevDay}
            disabled={currentDay === 0}
            style={styles.navButton(currentDay === 0)}
          >
            <ChevronLeft style={{ width: 24, height: 24 }} />
          </button>
          
          <button
            onClick={handleNextDay}
            disabled={currentDay === 6}
            style={styles.navButton(currentDay === 6)}
          >
            <ChevronRight style={{ width: 24, height: 24 }} />
          </button>
        </div>
      </div>

      <div style={styles.buttonsContainer}>
        <button style={styles.generateButton}>
          <Wand2 style={{ width: 20, height: 20 }} />
          <span>Generate Plan</span>
        </button>
        
        <button style={styles.editButton}>
          <Edit3 style={{ width: 20, height: 20 }} />
          <span>Edit Plan</span>
        </button>
      </div>
    </div>
  );
}