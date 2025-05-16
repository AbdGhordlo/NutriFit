import React from 'react';
import { motion } from 'framer-motion';

const UnitSelector = ({ units, setUnits }) => {
  return (
    <motion.div 
      className="unit-selector bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          units === 'metric' 
            ? 'bg-teal-500 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => setUnits('metric')}
      >
        Metric
      </button>
      <button
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          units === 'imperial' 
            ? 'bg-teal-500 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        onClick={() => setUnits('imperial')}
      >
        Imperial
      </button>
    </motion.div>
  );
};

export default UnitSelector;