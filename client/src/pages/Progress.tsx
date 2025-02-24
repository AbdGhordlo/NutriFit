import React from "react";
import {
  Activity,
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Trophy,
} from "lucide-react";
import { styles } from "./styles/ProgressStyles";
import "../assets/commonStyles.css";

interface WeeklyProgress {
  day: string;
  date: string;
  meals: {
    planned: number;
    completed: number;
  };
  exercises: {
    planned: number;
    completed: number;
  };
  calories: {
    goal: number;
    actual: number;
  };
}

const weeklyData: WeeklyProgress[] = [
  {
    day: "Mon",
    date: "Mar 25",
    meals: { planned: 5, completed: 5 },
    exercises: { planned: 4, completed: 4 },
    calories: { goal: 2200, actual: 2180 },
  },
  {
    day: "Tue",
    date: "Mar 26",
    meals: { planned: 5, completed: 4 },
    exercises: { planned: 4, completed: 3 },
    calories: { goal: 2200, actual: 2050 },
  },
  {
    day: "Wed",
    date: "Mar 27",
    meals: { planned: 5, completed: 5 },
    exercises: { planned: 4, completed: 4 },
    calories: { goal: 2200, actual: 2150 },
  },
  {
    day: "Thu",
    date: "Mar 28",
    meals: { planned: 5, completed: 3 },
    exercises: { planned: 4, completed: 2 },
    calories: { goal: 2200, actual: 1950 },
  },
  {
    day: "Fri",
    date: "Mar 29",
    meals: { planned: 5, completed: 0 },
    exercises: { planned: 4, completed: 0 },
    calories: { goal: 2200, actual: 0 },
  },
  {
    day: "Sat",
    date: "Mar 30",
    meals: { planned: 5, completed: 0 },
    exercises: { planned: 4, completed: 0 },
    calories: { goal: 2200, actual: 0 },
  },
  {
    day: "Sun",
    date: "Mar 31",
    meals: { planned: 5, completed: 0 },
    exercises: { planned: 4, completed: 0 },
    calories: { goal: 2200, actual: 0 },
  },
];

const weeklyStats = {
  meals: {
    completed: 17,
    total: 35,
    trend: "+5%",
  },
  exercises: {
    completed: 13,
    total: 28,
    trend: "+8%",
  },
  streak: 3,
  consistency: 85,
};

export default function Progress() {
  return (
    <div className="outer-container">
      <div style={styles.container}>
        {/* General Progress Section */}
        <div style={styles.generalProgress}>
          <h2 style={styles.sectionTitle}>Overall Progress</h2>
          <div style={styles.generalStatsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <Trophy style={styles.statIcon} />
              </div>
              <h3 style={styles.statTitle}>Current Streak</h3>
              <div style={styles.statValue}>
                <span style={styles.statNumber}>{weeklyStats.streak}</span>
                <span style={styles.statLabel}>days</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <Award style={styles.statIcon} />
              </div>
              <h3 style={styles.statTitle}>Total Workouts</h3>
              <div style={styles.statValue}>
                <span style={styles.statNumber}>147</span>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <Zap style={styles.statIcon} />
              </div>
              <h3 style={styles.statTitle}>Monthly Goal Progress</h3>
              <div style={styles.statValue}>
                <span style={styles.statNumber}>75%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill(75)} />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress Section */}
        <div style={styles.weeklyProgress}>
          <h2 style={styles.sectionTitle}>Weekly Overview</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <Activity style={styles.statIcon} />
                <span style={styles.statTrend(true)}>
                  {weeklyStats.meals.trend}
                </span>
              </div>
              <h3 style={styles.statTitle}>Meal Plan Progress</h3>
              <div style={styles.statValue}>
                <span style={styles.statNumber}>
                  {weeklyStats.meals.completed}
                </span>
                <span style={styles.statTotal}>/{weeklyStats.meals.total}</span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={styles.progressFill(
                    (weeklyStats.meals.completed / weeklyStats.meals.total) *
                      100
                  )}
                />
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <TrendingUp style={styles.statIcon} />
                <span style={styles.statTrend(true)}>
                  {weeklyStats.exercises.trend}
                </span>
              </div>
              <h3 style={styles.statTitle}>Exercise Completion</h3>
              <div style={styles.statValue}>
                <span style={styles.statNumber}>
                  {weeklyStats.exercises.completed}
                </span>
                <span style={styles.statTotal}>
                  /{weeklyStats.exercises.total}
                </span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={styles.progressFill(
                    (weeklyStats.exercises.completed /
                      weeklyStats.exercises.total) *
                      100
                  )}
                />
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <Calendar style={styles.statIcon} />
              </div>
              <h3 style={styles.statTitle}>Weekly Consistency</h3>
              <div style={styles.statValue}>
                <span style={styles.statNumber}>
                  {weeklyStats.consistency}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown Section */}
        <div style={styles.dailyBreakdown}>
          <h2 style={styles.sectionTitle}>Daily Breakdown</h2>
          <div style={styles.progressTable}>
            <div style={styles.tableHeader}>
              <span>Day</span>
              <span>Meals</span>
              <span>Exercises</span>
              <span>Calories</span>
            </div>
            {weeklyData.map((day, index) => (
              <div key={index} style={styles.tableRow}>
                <div style={styles.dayCell}>
                  <span style={styles.dayName}>{day.day}</span>
                  <span style={styles.dayDate}>{day.date}</span>
                </div>
                <div style={styles.progressCell}>
                  <div style={styles.progressBar}>
                    <div
                      style={styles.progressFill(
                        (day.meals.completed / day.meals.planned) * 100
                      )}
                    />
                  </div>
                  <span style={styles.progressText}>
                    {day.meals.completed}/{day.meals.planned}
                  </span>
                </div>
                <div style={styles.progressCell}>
                  <div style={styles.progressBar}>
                    <div
                      style={styles.progressFill(
                        (day.exercises.completed / day.exercises.planned) * 100
                      )}
                    />
                  </div>
                  <span style={styles.progressText}>
                    {day.exercises.completed}/{day.exercises.planned}
                  </span>
                </div>
                <div style={styles.caloriesCell}>
                  <span style={styles.caloriesActual}>
                    {day.calories.actual}
                  </span>
                  <span style={styles.caloriesGoal}>/{day.calories.goal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
