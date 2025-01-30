import React from 'react';
import DailyProgress from '../components/DailyProgress';
import DailyMeals from '../components/DailyMeals';
import DailyExercises from '../components/DailyExercises';
import { styles } from './styles/HomeStyles';

function Home() {
  return (
    // <main className="ml-64 pt-16 pb-16 min-h-screen">
    <main>
        <div style={styles.mainContent}>
          <DailyProgress />
          <div style={styles.gridContainer}>
            <DailyMeals />
            <DailyExercises />
          </div>
        </div>
      </main>
  );
}

export default Home;