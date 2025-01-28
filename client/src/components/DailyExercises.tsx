import React from 'react';
import { Clock, Dumbbell } from 'lucide-react';

interface Exercise {
  id: number;
  name: string;
  time: string;
  duration: string;
  calories: number;
  completed: boolean;
}

const exercises: Exercise[] = [
  {
    id: 1,
    name: 'Morning Cardio',
    time: '09:30',
    duration: '30 min',
    calories: 300,
    completed: true
  },
  {
    id: 2,
    name: 'Upper Body Strength',
    time: '17:00',
    duration: '45 min',
    calories: 250,
    completed: false
  }
];

export default function DailyExercises() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Exercise Plan</h2>
      
      <div className="space-y-4">
        {exercises.map(exercise => (
          <div 
            key={exercise.id}
            className={`flex items-center justify-between p-4 rounded-lg border
              ${exercise.completed 
                ? 'border-[#7ec987] bg-[#7ec987]/5' 
                : 'border-gray-100 hover:border-gray-200'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full 
                ${exercise.completed 
                  ? 'bg-[#7ec987]/10 text-[#4d7051]' 
                  : 'bg-gray-100 text-gray-500'}`}
              >
                <Dumbbell className="w-5 h-5" />
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{exercise.time}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{exercise.duration}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{exercise.calories} kcal</span>
                </div>
              </div>
            </div>

            <input 
              type="checkbox" 
              checked={exercise.completed}
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