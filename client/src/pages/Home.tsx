import React from "react";
import DailyProgress from "../components/DailyProgress";
import DailyMeals from "../components/DailyMeals";
import DailyExercises from "../components/DailyExercises";
import { styles } from "./styles/HomeStyles";
import "../assets/commonStyles.css";

function Home() {
  return (
    <div className="outer-container">
      <DailyProgress />
      <div style={styles.gridContainer}>
        <DailyMeals />
        <DailyExercises />
      </div>
    </div>
  );
}

export default Home;
