import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaFire } from "react-icons/fa";

// Simple RadialProgressBar component since it's not imported
const RadialProgressBar = ({ percentage, color, size, thickness, label }) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-lg font-semibold text-gray-800">
        {label}
      </div>
    </div>
  );
};

// Loader component
const Loader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

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
  dailyCompletedMeals = 2,
  dailyMaxMeals = 3,
  dailyCompletedExercises = 1,
  dailyMaxExercises = 2,
  dailyCompletedDays = 5,
  weeklyCurrent = 3,
  weeklyMax = 8,
  monthlyCurrent = 1,
  monthlyMax = 2,
  totalTimeframeWeeks = 8,
}) => {
  const [loadingStates, setLoadingStates] = useState({
    daily: true,
    weekly: true,
    monthly: true,
  });

  useEffect(() => {
    // Set up timers for each loader to hide after 3 seconds
    const timers = [
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, daily: false }));
      }, 3000),
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, weekly: false }));
      }, 3000),
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, monthly: false }));
      }, 3000),
    ];

    // Cleanup timers on component unmount
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

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

  // Calculate total week trophy pages
  const weekTrophiesPerPage = 4;
  const totalWeekPages = Math.ceil(weeklyMax / weekTrophiesPerPage);
  // Calculate current page (auto-advance as user progresses)
  const currentWeekPage = Math.floor(weeklyCurrent / weekTrophiesPerPage);
  // For last page, show only the remaining trophies
  const weekTrophiesThisPage =
    currentWeekPage === totalWeekPages - 1
      ? weeklyMax - weekTrophiesPerPage * (totalWeekPages - 1)
      : Math.min(weekTrophiesPerPage, weeklyMax);

  // Calculate total month trophy pages
  const monthTrophiesPerPage = 12;
  const totalMonthPages = Math.ceil(monthlyMax / monthTrophiesPerPage);
  const currentMonthPage = Math.floor(monthlyCurrent / monthTrophiesPerPage);
  const monthTrophiesThisPage =
    currentMonthPage === totalMonthPages - 1
      ? monthlyMax - monthTrophiesPerPage * (totalMonthPages - 1)
      : Math.min(monthTrophiesPerPage, monthlyMax);

  // Only show monthly if totalTimeframeWeeks > 4 and there is at least one month in the timeframe
  const displayMonthly = totalTimeframeWeeks > 4 && monthlyMax > 0;

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
          {loadingStates.daily ? (
            <div className="h-[200px]">
              <Loader />
            </div>
          ) : (
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
          )}
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Weekly Progress
          </h3>
          {loadingStates.weekly ? (
            <div className="h-[200px]">
              <Loader />
            </div>
          ) : (
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
                  {Array.from({ length: weekTrophiesThisPage }, (_, i) => {
                    const trophyIndex = currentWeekPage * weekTrophiesPerPage + i;
                    return (
                      <Trophy
                        key={`week-${trophyIndex + 1}`}
                        level="bronze"
                        size={32}
                        opacity={trophyIndex < weeklyCurrent ? 1 : 0.3}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
            {loadingStates.monthly ? (
              <div className="h-[200px]">
                <Loader />
              </div>
            ) : (
              <div className="flex flex-col items-center min-h-[180px] justify-center">
                {Number(monthlyMax) > 0 &&
                Number(monthlyCurrent) >= Number(monthlyMax) ? (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-lg p-6 shadow-inner">
                    <span className="text-5xl mb-3 animate-bounce">🏆</span>
                    <span className="text-xl font-bold text-yellow-700 text-center mb-2">
                      Outstanding! You've earned every monthly trophy for your
                      goal!
                    </span>
                    <span className="text-base text-gray-600 text-center mb-4">
                      Share your dedication!
                    </span>
                    <button
                      className="mt-2 px-5 py-2 bg-yellow-400 text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition"
                      onClick={async () => {
                        const today = new Date();
                        const dateStr = today.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        });
                        const nutriFitLink = "http://localhost:5173/";
                        const shareText =
                          `🏆 Outstanding! I've earned every monthly trophy for my goal on NutriFit!\n\n` +
                          `• Months streak: ${monthlyMax}\n` +
                          `• Weeks streak: ${weeklyMax}\n` +
                          `• Achieved on: ${dateStr}\n\n` +
                          `Join me on NutriFit and start your journey! #NutriFit #Consistency #Achievement\n${nutriFitLink}`;

                        // Try to share an image if supported
                        const canShareFiles =
                          navigator.canShare &&
                          navigator.canShare({
                            files: [
                              new File([new Blob()], "logo.png", {
                                type: "image/png",
                              }),
                            ],
                          });
                        if (navigator.share && canShareFiles) {
                          // Fetch the logo image as a blob
                          try {
                            const response = await fetch(
                              "/src/assets/imgs/monthly-streak-achievement.png"
                            );
                            const blob = await response.blob();
                            const file = new File([blob], "nutrifit-trophy.png", {
                              type: blob.type,
                            });
                            await navigator.share({
                              title: "My NutriFit Achievement",
                              text: shareText,
                              files: [file],
                            });
                            return;
                          } catch (e) {
                            // If image fetch fails, fall back to text share
                          }
                        }
                        if (navigator.share) {
                          navigator.share({
                            title: "My NutriFit Achievement",
                            text: shareText,
                          });
                        } else {
                          navigator.clipboard.writeText(shareText);
                          alert("Achievement copied to clipboard!");
                        }
                      }}
                    >
                      Share Achievement
                    </button>
                  </div>
                ) : (
                  <>
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
                      <p className="text-sm text-gray-500 mb-3">
                        Monthly Trophies
                      </p>
                      <div className="flex justify-center space-x-4">
                        {Array.from({ length: monthTrophiesThisPage }, (_, i) => {
                          const trophyIndex =
                            currentMonthPage * monthTrophiesPerPage + i;
                          return (
                            <Trophy
                              key={`month-${trophyIndex + 1}`}
                              level="gold"
                              size={32}
                              opacity={trophyIndex < monthlyCurrent ? 1 : 0.3}
                            />
                          );
                        })}
                      </div>
                      {totalMonthPages > 1 && (
                        <div className="flex justify-center mt-2 space-x-2">
                          {Array.from({ length: totalMonthPages }, (_, i) => (
                            <button
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i === currentMonthPage
                                  ? "bg-yellow-400"
                                  : "bg-gray-300"
                              }`}
                              style={{ outline: "none", border: "none" }}
                              aria-label={`Go to month trophy page ${i + 1}`}
                              tabIndex={0}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
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