import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MotivationalQuote from "../components/ProgressComponents/MotivationalQuote";
import StreakTracker from "../components/ProgressComponents/StreakTracker";
import AnthropometricMeasurements from "../components/ProgressComponents/AnthropometricMeasurements";
import GoalTracker from "../components/ProgressComponents/GoalTracker";
import ProgressPhotos from "../components/ProgressComponents/ProgressPhotos";
import { streakData, goalData, historicalData} from "./progress_temp_data";
const Progress = () => {
  const [quote, setQuote] = useState({ quote: "", author: "" });
  const [photos, setPhotos] = useState([]);

  // Animation variants for page elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    fetch("https://quotes-api-self.vercel.app/quote")
      .then((response) => response.json())
      .then((data) => {
        setQuote({ quote: data.quote, author: data.author });
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  }, []);

  return (
    <motion.div
      className="progress-page bg-gray-50 min-h-screen p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="mb-6">
          <MotivationalQuote quote={quote.quote} author={quote.author} />
        </motion.div>

        <div className="flex flex-col gap-6 mb-6">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Your Streaks
            </h2>
            <StreakTracker
            streakData={streakData}
             />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Goal Tracker
            </h2>
            <GoalTracker
              goalData={goalData}
             />
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <AnthropometricMeasurements
          historicalData={historicalData}
           />
        </motion.div>
        <motion.div variants={itemVariants} className="mb-6">
          <ProgressPhotos
            photos={photos}
            setPhotos={setPhotos}
           />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Progress;
