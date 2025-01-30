import React from 'react';
import { Clock, UtensilsCrossed } from 'lucide-react';
import { styles } from './styles/DailyMealsStyles';

interface Meal {
  id: number;
  name: string;
  time: string;
  calories: number;
  completed: boolean;
}

const meals: Meal[] = [
  { id: 1, name: 'Oatmeal with Berries', time: '08:00', calories: 350, completed: true },
  { id: 2, name: 'Greek Yogurt & Nuts', time: '11:00', calories: 200, completed: true },
  { id: 3, name: 'Grilled Chicken Salad', time: '13:00', calories: 450, completed: true },
  { id: 4, name: 'Protein Smoothie', time: '16:00', calories: 250, completed: false },
  { id: 5, name: 'Salmon with Quinoa', time: '19:00', calories: 550, completed: false },
  { id: 6, name: 'Cottage Cheese', time: '21:00', calories: 150, completed: false },
];

export default function DailyMeals() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Today's Meal Plan</h2>
      
      <div style={styles.mealsList}>
        {meals.map(meal => (
          <div key={meal.id} style={styles.mealItem(meal.completed)}>
            <div style={styles.mealInfo}>
              <div style={styles.iconContainer(meal.completed)}>
                <UtensilsCrossed size={20} />
              </div>
              
              <div style={styles.mealDetails}>
                <h3 style={styles.mealName}>{meal.name}</h3>
                <div style={styles.mealTime}>
                  <Clock size={16} />
                  <span>{meal.time}</span>
                  <span>•</span>
                  <span>{meal.calories} kcal</span>
                </div>
              </div>
            </div>

            <input 
              type="checkbox" 
              checked={meal.completed}
              onChange={() => {}}
              style={styles.checkbox}
            />
          </div>
        ))}
      </div>
    </div>
  );
}