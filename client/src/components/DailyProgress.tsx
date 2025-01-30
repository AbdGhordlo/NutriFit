import React from 'react';
import { Check } from 'lucide-react';
import { styles } from './styles/DailyProgressStyles';

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
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Today's Progress</h2>
        <span style={styles.progressText}>{completedCount}/{milestones.length} completed</span>
      </div>
      
      <div>
        <div style={styles.progressBarContainer}>
          <div style={styles.progressBar(progress)} />
        </div>
        
        <div style={styles.milestonesContainer}>
          {milestones.map((milestone) => (
            <div key={milestone.id} style={styles.milestone}>
              <div style={styles.milestoneIcon(milestone.completed)}>
                {milestone.completed && <Check size={16} />}
              </div>
              <span style={styles.milestoneTime}>{milestone.time}</span>
              <span style={styles.milestoneLabel}>
                {milestone.type === 'meal' ? '🍽️' : '💪'} {milestone.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}