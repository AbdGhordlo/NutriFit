import React from "react";
import { motion } from "framer-motion";
import {
  differenceInDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  format,
} from "date-fns";

interface GoalTrackerProps {
  startWeight: number;
  currentWeight: number;
  targetWeight: number;
  startDate: Date;
  targetDate: Date;
  adjustedTargetDate: Date;
  penaltyDaysCount: number;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({
  startWeight,
  currentWeight,
  targetWeight,
  startDate,
  targetDate,
  adjustedTargetDate,
  penaltyDaysCount,
}) => {
  // Calculate days left
  const today = new Date();
  const totalDays = differenceInDays(targetDate, startDate);
  const daysElapsed = differenceInDays(today, startDate);
  const daysLeft = differenceInDays(targetDate, today);

  let timeLeft: number;
  let timeLeftUnit: string;

  if (daysLeft > 30) {
    timeLeft = differenceInCalendarMonths(targetDate, today);
    timeLeftUnit = timeLeft > 1 ? "months" : "month";
  } else if (daysLeft > 7) {
    timeLeft = differenceInCalendarWeeks(targetDate, today);
    timeLeftUnit = timeLeft > 1 ? "weeks" : "week";
  } else {
    timeLeft = differenceInDays(targetDate, today);
    timeLeftUnit = timeLeft > 1 ? "days" : "day";
  }

  // Calculate progress percentage
  const totalWeightLossGoal = startWeight - targetWeight;
  const currentWeightLoss = startWeight - currentWeight;
  const progressPercentage = Math.min(
    100,
    (currentWeightLoss / totalWeightLossGoal) * 100
  );

  return (
    <div className="goal-tracker">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="goal-progress bg-gray-50 p-4 rounded-lg border border-gray-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Weight Loss Progress
          </h3>

          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Current: {currentWeight}kg</span>
            <span>Target: {targetWeight}kg</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <motion.div
              className="h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                background: `linear-gradient(to right, #7EC987, #4D7051)`,
              }}
            />
          </div>

          <p className="text-sm text-gray-600">
            {progressPercentage < 100
              ? `You're ${Math.max(
                  0,
                  Math.min(100, progressPercentage)
                ).toFixed(0)}% of the way to your goal!`
              : "Congratulations! You've reached your weight loss goal!"}
          </p>
        </motion.div>

        <motion.div
          className="time-left bg-gray-50 p-4 rounded-lg border border-gray-200"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-md font-medium text-gray-700 mb-3">
            Time Remaining
          </h3>

          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {timeLeft}
              </span>
              <span className="text-sm text-gray-600 ml-1">{timeLeftUnit}</span>
            </div>

            {penaltyDaysCount > 0 && (
              <div className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                +{penaltyDaysCount} penalty days
              </div>
            )}
          </div>

          <div className="flex text-sm text-gray-600 justify-between">
            <span>Started: {format(startDate, "MMM d, yyyy")}</span>
            <span>Target: {format(targetDate, "MMM d, yyyy")}</span>
          </div>

          {penaltyDaysCount > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              <span>Adjusted Target: </span>
              <span className="font-medium">
                {format(adjustedTargetDate, "MMM d, yyyy")}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        className="goal-details bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-md font-medium text-gray-700 mb-3">
          Goal Insights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card bg-white p-3 rounded-md shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Progress Rate</div>
            <div className="text-lg font-bold text-gray-900">
              {((totalWeightLossGoal / totalDays) * 30).toFixed(1)}kg
              <span className="text-sm font-normal text-gray-500 ml-1">
                / month
              </span>
            </div>
          </div>

          <div className="stat-card bg-white p-3 rounded-md shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Days Elapsed</div>
            <div className="text-lg font-bold text-gray-900">
              {daysElapsed}
              <span className="text-sm font-normal text-gray-500 ml-1">
                / {totalDays}
              </span>
            </div>
          </div>

          <div className="stat-card bg-white p-3 rounded-md shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Weight Lost</div>
            <div className="text-lg font-bold text-gray-900">
              {currentWeightLoss.toFixed(1)}kg
              <span className="text-sm font-normal text-gray-500 ml-1">
                / {totalWeightLossGoal}kg
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GoalTracker;
