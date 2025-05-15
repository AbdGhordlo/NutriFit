import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MotivationalQuote from '../components/progress/MotivationalQuote';
import UnitSelector from '../components/progress/UnitSelector';
import StreakTracker from '../components/progress/StreakTracker';
import AnthropometricMeasurements from '../components/progress/AnthropometricMeasurements';
import GoalTracker from '../components/progress/GoalTracker';

const ProgressPage = () => {
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  
  // Animation variants for page elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className="progress-page bg-gray-50 min-h-screen p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="mb-6">
          <MotivationalQuote />
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-6 flex justify-end">
          <UnitSelector units={units} setUnits={setUnits} />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Streaks</h2>
            <StreakTracker />
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Goal Tracker</h2>
            <GoalTracker />
          </motion.div>
        </div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Body Measurements</h2>
          <AnthropometricMeasurements units={units} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressPage;