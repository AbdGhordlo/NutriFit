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

const StreakTracker = ({
  dailyCompletedMeals,
  dailyMaxMeals,
  dailyCompletedExercises,
  dailyMaxExercises,
  dailyCompletedDays,
  weeklyCurrent,
  weeklyMax,
  monthlyCurrent,
  monthlyMax,
}: {
  dailyCompletedMeals: number;
  dailyMaxMeals: number;
  dailyCompletedExercises: number;
  dailyMaxExercises: number;
  dailyCompletedDays: number;
  weeklyCurrent: number;
  weeklyMax: number;
  monthlyCurrent: number;
  monthlyMax: number;
}) => {
  // Calculate trophy levels based on streaks
  const getTrophyLevel = () => {
    if (weeklyCurrent === 4) return "gold";
    return "bronze";
  };

  // Calculate next trophy level based on streaks
  const getNextTrophyLevel = () => {
    if (weeklyCurrent === 3) return "gold";
    if (weeklyCurrent >= 1 && weeklyCurrent <= 2) return "bronze";
    return "fire";
  };

  // Days of the week for display
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];
  const displayMonthly = monthlyMax === 0 ? false : true;


  return (
    <div className="streak-tracker">
      <div
        className={`grid grid-cols-1 gap-6 ${
          displayMonthly ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        {/* Daily Progress */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Daily Progress
          </h3>
          <div className="flex flex-col space-y-4 pt-3 justify-between h-[86%]">
            <div className="flex flex-col justify-between h-full py-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Meals</span>
                  <span className="font-medium text-gray-800">
                    {dailyCompletedMeals}/{dailyMaxMeals} meals
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${(dailyCompletedMeals / dailyMaxMeals) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Exercise</span>
                  <span className="font-medium text-gray-800">
                    {dailyCompletedExercises}/{dailyMaxExercises} workouts
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (dailyCompletedExercises / dailyMaxExercises) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Days of the week with fire icons */}
            <div className="pt-2 border-t border-gray-100">
              <div className="text-sm text-gray-500 mb-3">Daily Streaks</div>
              <div className="flex justify-between">
                {daysOfWeek.map((day, index) => (
                  <div key={day} className="flex flex-col items-center">
                    <Fire active={dailyCompletedDays > index} />
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
              percentage={(weeklyCurrent / weeklyMax) * 100}
              color="#b87333" // Bronze color
              size={120}
              thickness={12}
              label={`${weeklyCurrent}/${weeklyMax}`}
            />
            <p className="mt-4 text-gray-600 text-center">
              {weeklyCurrent} consecutive weeks of meeting daily goals
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
                    opacity={week <= weeklyCurrent ? 1 : 0.3}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly Progress */}
        {displayMonthly && (
          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800 mr-2">
                Monthly Progress
              </h3>
              <span
                title="A month here is considered as 28 days (4 weeks)"
                style={{ cursor: "pointer" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" fill="#fbbf24" />
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#fff"
                    fontFamily="Arial"
                    fontWeight="bold"
                  >
                    i
                  </text>
                </svg>
              </span>
            </div>
            <div className="flex flex-col items-center">
              <RadialProgressBar
                percentage={(monthlyCurrent / monthlyMax) * 100}
                color="#FFD700" // Gold color
                size={120}
                thickness={12}
                label={`${monthlyCurrent}/${monthlyMax}`}
              />
              <p className="mt-4 text-gray-600 text-center">
                {monthlyCurrent} consecutive months of meeting weekly goals
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
                      opacity={month <= monthlyCurrent ? 1 : 0.3}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
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
                  {dailyCompletedDays}/7 days complete
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  {dailyCompletedDays >= 5
                    ? "Amazing daily streak!"
                    : `${
                        7 - dailyCompletedDays
                      } more days to complete this week`}
                </p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">
                  Weekly
                </span>
                <span className="text-base font-medium text-gray-800">
                  {weeklyCurrent}/{weeklyMax} weeks complete
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  {weeklyCurrent >= weeklyMax
                    ? "Monthly goal achieved!"
                    : `${
                        weeklyMax - weeklyCurrent
                      } more weeks to reach monthly goal`}
                </p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">
                  Monthly
                </span>
                <span className="text-base font-medium text-gray-800">
                  {monthlyCurrent}/{monthlyMax} months complete
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  {monthlyCurrent >= monthlyMax
                    ? "Yearly goal achieved!"
                    : `${
                        monthlyMax - monthlyCurrent
                      } more months to reach yearly goal`}
                </p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            {getNextTrophyLevel() === "fire" ? (
              <FaFire size={48} color="#f97316" />
            ) : (
              <Trophy level={getNextTrophyLevel()} size={48} />
            )}
            <div className="text-sm text-gray-600">
              <p className="font-medium">Next Trophy</p>
              <p className="capitalize">{getNextTrophyLevel()} Level</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StreakTracker;
