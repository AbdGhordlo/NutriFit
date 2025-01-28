import React from 'react';
import { Clock, UtensilsCrossed } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Meal Plan</h2>
      
      <div className="space-y-4">
        {meals.map(meal => (
          <div 
            key={meal.id}
            className={`flex items-center justify-between p-4 rounded-lg border
              ${meal.completed 
                ? 'border-[#7ec987] bg-[#7ec987]/5' 
                : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full 
                ${meal.completed 
                  ? 'bg-[#7ec987]/10 text-[#4d7051]' 
                  : 'bg-gray-100 text-gray-500'}`}
              >
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">{meal.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{meal.time}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{meal.calories} kcal</span>
                </div>
              </div>
            </div>

            <input 
              type="checkbox" 
              checked={meal.completed}
              onChange={() => {}}
              className="w-5 h-5 rounded border-gray-300 text-[#7ec987] 
                focus:ring-[#7ec987] focus:ring-offset-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}