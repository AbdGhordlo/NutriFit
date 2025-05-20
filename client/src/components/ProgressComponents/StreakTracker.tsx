import React from "react";
import { motion } from "framer-motion";
import RadialProgressBar from "./RadialProgressBar";
import { FaTrophy, FaFire } from "react-icons/fa";

// Trophy component to display achievement levels
const Trophy = ({ level, size = 40, opacity = 1 }) => {
  const colors = {
    none: "#d1d5db",
    green: "#34d399",
    bronze: "#b87333",
    silver: "#C0C0C0",
    gold: "#FFD700",
  };

  return (
    <FaTrophy size={size} color={colors[level]} style={{ opacity: opacity }} />
  );
};

// Fire component for daily progress
const Fire = ({ active, size = 24 }) => {
  return (
    <FaFire
      size={size}
      color="#f97316" // Orange fire color - matching progress bars
      style={{ opacity: active ? 1 : 0.3 }}
    />
  );
};

const StreakTracker = (data: any) => {
  const streakData = data.streakData;

  // Calculate trophy levels based on streaks
  const getTrophyLevel = () => {
    if (streakData.weekly.current == 4) return "gold";
    return "bronze";
  };

  // Days of the week for display
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="streak-tracker">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Progress */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Daily Progress
          </h3>
          <div className="flex flex-col space-y-4 pt-3 justify-between h-[80%]">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Meals</span>
                <span className="font-medium text-gray-800">
                  {streakData.daily.meals}/{streakData.daily.maxMeals} meals
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (streakData.daily.meals / streakData.daily.maxMeals) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Exercise</span>
                <span className="font-medium text-gray-800">1/2 workouts</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (streakData.daily.exercises / streakData.daily.maxExercises) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Days of the week with fire icons */}
            <div className="mt-4 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                {daysOfWeek.map((day, index) => (
                  <div key={day} className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">{day}</span>
                    <Fire
                    // complete days is a number which represents the number of days completed
                      active={streakData.daily.completedDays > index}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Weekly Progress
          </h3>
          <div className="flex flex-col items-center">
            <RadialProgressBar
              percentage={
                (streakData.weekly.current / streakData.weekly.max) * 100
              }
              color="#b87333" // Bronze color
              size={120}
              thickness={12}
              label={`${streakData.weekly.current}/${streakData.weekly.max}`}
            />
            <p className="mt-4 text-gray-600 text-center">
              {streakData.weekly.current} consecutive weeks of meeting daily
              goals
            </p>

            {/* Bronze trophies for weekly progress */}
            <div className="mt-6 pt-4 border-t border-gray-100 w-full">
              <p className="text-sm text-gray-500 mb-3">Weekly Trophies</p>
              <div className="flex justify-center space-x-4">
                {[1, 2, 3, 4].map((week) => (
                  <Trophy
                    key={`week-${week}`}
                    level="bronze"
                    size={32}
                    opacity={week <= streakData.weekly.current ? 1 : 0.3}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly Progress */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Progress
          </h3>
          <div className="flex flex-col items-center">
            <RadialProgressBar
              percentage={
                (streakData.monthly.current / streakData.monthly.max) * 100
              }
              color="#FFD700" // Gold color
              size={120}
              thickness={12}
              label={`${streakData.monthly.current}/${streakData.monthly.max}`}
            />
            <p className="mt-4 text-gray-600 text-center">
              {streakData.monthly.current} consecutive months of meeting weekly
              goals
            </p>

            {/* Gold trophies for monthly progress */}
            <div className="mt-6 pt-4 border-t border-gray-100 w-full">
              <p className="text-sm text-gray-500 mb-3">Monthly Trophies</p>
              <div className="flex justify-center space-x-4">
                {[1, 2, 3, 4, 5].map((month) => (
                  <Trophy
                    key={`month-${month}`}
                    level="gold"
                    size={32}
                    opacity={month <= streakData.monthly.current ? 1 : 0.3}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Progress Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">Daily</span>
                <span className="text-base font-medium text-gray-800">
                  {streakData.daily.completedDays}/7 days complete
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  {streakData.daily.completedDays.length >= 5
                    ? "Amazing daily streak!"
                    : `${
                        7 - streakData.daily.completedDays
                      } more days to complete this week`}
                </p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">
                  Weekly
                </span>
                <span className="text-base font-medium text-gray-800">
                  {streakData.weekly.current}/{streakData.weekly.max} weeks
                  complete
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  {streakData.weekly.current >= streakData.weekly.max
                    ? "Monthly goal achieved!"
                    : `${
                        streakData.weekly.max - streakData.weekly.current
                      } more weeks to reach monthly goal`}
                </p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">
                  Monthly
                </span>
                <span className="text-base font-medium text-gray-800">
                  {streakData.monthly.current}/{streakData.monthly.max} months
                  complete
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  {streakData.monthly.current >= streakData.monthly.max
                    ? "Yearly goal achieved!"
                    : `${
                        streakData.monthly.max - streakData.monthly.current
                      } more months to reach yearly goal`}
                </p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <Trophy level={getTrophyLevel()} size={48} />
            <div className="text-sm text-gray-600">
              <p className="font-medium">Next Trophy</p>
              <p className="capitalize">{getTrophyLevel()} Level</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StreakTracker;
