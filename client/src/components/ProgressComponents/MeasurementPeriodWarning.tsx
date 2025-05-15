import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MeasurementPeriodWarningProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  measurementType: string;
  existingDate: Date;
}

const MeasurementPeriodWarning: React.FC<MeasurementPeriodWarningProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  measurementType,
  existingDate
}) => {
  if (!isOpen) return null;

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Measurement Warning</h3>
              <button
                onClick={onCancel}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-3 text-yellow-800">
                <p className="font-medium">Warning</p>
                <p className="text-sm">
                  You already have a {measurementType} measurement recorded on {formatDate(existingDate)} 
                  {' '}for this two-week period.
                </p>
              </div>
              
              <p className="mb-4 text-gray-600">
                To maintain consistent tracking, we recommend recording measurements once every two weeks.
                Adding a new measurement now will overwrite your existing data for this period.
              </p>
              
              <p className="text-sm text-gray-500 mb-6">
                Would you like to continue and replace your existing measurement?
              </p>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  onClick={onCancel}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={onConfirm}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Overwrite
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeasurementPeriodWarning;