import React from 'react';
import { Clock, Dumbbell } from 'lucide-react';
import { styles } from './styles/DailyExercisesStyles';

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
    <div style={styles.container}>
      <h2 style={styles.title}>Today's Exercise Plan</h2>
      
      <div style={styles.exercisesList}>
        {exercises.map(exercise => (
          <div key={exercise.id} style={styles.exerciseItem(exercise.completed)}>
            <div style={styles.exerciseInfo}>
              <div style={styles.iconContainer(exercise.completed)}>
                <Dumbbell size={20} />
              </div>
              
              <div style={styles.exerciseDetails}>
                <h3 style={styles.exerciseName}>{exercise.name}</h3>
                <div style={styles.exerciseTime}>
                  <Clock size={16} />
                  <span>{exercise.time}</span>
                  <span>•</span>
                  <span>{exercise.duration}</span>
                  <span>•</span>
                  <span>{exercise.calories} kcal</span>
                </div>
              </div>
            </div>

            <input 
              type="checkbox" 
              checked={exercise.completed}
              onChange={() => {}}
              style={styles.checkbox}
            />
          </div>
        ))}
      </div>
    </div>
  );
}