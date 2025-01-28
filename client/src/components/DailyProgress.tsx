import React from 'react';
import { Check } from 'lucide-react';

interface Milestone {
  id: number;
  type: 'meal' | 'exercise';
  name: string;
  completed: boolean;
  time: string;
}

const milestones: Milestone[] = [
  { id: 1, type: 'meal', name: 'Breakfast', completed: true, time: '08:00' },
  { id: 2, type: 'exercise', name: 'Morning Workout', completed: true, time: '09:30' },
  { id: 3, type: 'meal', name: 'Lunch', completed: true, time: '13:00' },
  { id: 4, type: 'exercise', name: 'Evening Workout', completed: false, time: '17:00' },
  { id: 5, type: 'meal', name: 'Dinner', completed: false, time: '19:00' },
  { id: 6, type: 'meal', name: 'Evening Snack', completed: false, time: '21:00' },
];

export default function DailyProgress() {
  const completedCount = milestones.filter(m => m.completed).length;
  const progress = (completedCount / milestones.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Today's Progress</h2>
        <span className="text-sm text-gray-500">{completedCount}/{milestones.length} completed</span>
      </div>
      
      <div className="relative">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#7ec987] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-4">
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.id}
              className="flex flex-col items-center relative"
              style={{ width: `${100 / milestones.length}%` }}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                  ${milestone.completed 
                    ? 'bg-[#7ec987] text-white' 
                    : 'bg-gray-100 text-gray-400'}`}
              >
                {milestone.completed && <Check className="w-4 h-4" />}
              </div>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                {milestone.time}
              </span>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {milestone.type === 'meal' ? '🍽️' : '💪'} {milestone.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}