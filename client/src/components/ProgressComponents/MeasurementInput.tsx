import React, { useState } from "react";
import { motion } from "framer-motion";
import MeasurementPeriodWarning from "./MeasurementPeriodWarning";
import {
  useMeasurementPeriod,
  Measurement,
} from "./../../hooks/useMeasurementPeriod";

interface MeasurementInputProps {
  onSave: (type: string, value: number) => void;
  onCancel: () => void;
  measurements: Measurement[];
  onSaveMeasurement: (type: string, value: number) => Promise<void>;
}

const MeasurementInput: React.FC<MeasurementInputProps> = ({
  onSave,
  onCancel,
  measurements,
  onSaveMeasurement,
}) => {
  const [selectedType, setSelectedType] = useState("weight");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  const { checkMeasurementPeriod, saveMeasurement } = useMeasurementPeriod({
    measurements,
    onSaveMeasurement,
  });

  // Store the checked measurement temporarily when warning is shown
  const [pendingMeasurement, setPendingMeasurement] = useState<{
    type: string;
    value: number;
    existingMeasurement: any;
  } | null>(null);

  // Filter out derived measurements and only keep direct measurements
  const allowedMeasurements = [
    { id: "weight", label: "Weight", icon: "⚖️" },
    { id: "height", label: "Height", icon: "📏" },
    { id: "waist", label: "Waist", icon: "👖" },
    { id: "hip", label: "Hip", icon: "🍑" },
    { id: "bodyFatMass", label: "Body Fat", icon: "🔄" },
    { id: "leanBodyMass", label: "Lean Mass", icon: "💪" },
  ];

  const handleSave = () => {
    if (!value || isNaN(parseFloat(value))) {
      setError("Please enter a valid number");
      return;
    }

    const numericValue = parseFloat(value);

    // Check if there's already a measurement in this two-week period
    const { isWithinPeriod, existingMeasurement } =
      checkMeasurementPeriod(selectedType);

    if (isWithinPeriod && existingMeasurement) {
      // Store the pending measurement and show warning
      setPendingMeasurement({
        type: selectedType,
        value: numericValue,
        existingMeasurement,
      });
      setShowWarning(true);
    } else {
      // No warning needed, save directly
      saveMeasurement(selectedType, numericValue);
      onSave(selectedType, numericValue);
      setError("");
    }
  };

  const handleConfirmOverwrite = () => {
    if (pendingMeasurement) {
      saveMeasurement(pendingMeasurement.type, pendingMeasurement.value);
      onSave(pendingMeasurement.type, pendingMeasurement.value);
    }
    setShowWarning(false);
    setPendingMeasurement(null);
    setError("");
  };

  const handleCancelOverwrite = () => {
    setShowWarning(false);
    setPendingMeasurement(null);
  };

  const getUnitForType = (type: string) => {
    switch (type) {
      case "weight":
      case "bodyFatMass":
      case "leanBodyMass":
        return "kg";
      case "height":
      case "waist":
      case "hip":
        return "cm";
      default:
        return "";
    }
  };

  return (
    <>
      <motion.div
        className="measurement-input bg-white p-5 rounded-lg shadow-md border border-gray-200 mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <h4 className="text-lg font-medium text-gray-800 mb-4">
          Add New Measurement
        </h4>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Measurement Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allowedMeasurements.map((type) => (
              <button
                key={type.id}
                className={`p-2 rounded-md text-sm ${
                  selectedType === type.id
                    ? "bg-[#7EC987] text-white font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <span className="mr-1">{type.icon}</span> {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="measurement-value"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Value ({getUnitForType(selectedType)})
          </label>
          <div className="flex">
            <input
              id="measurement-value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-0 focus:ring-[#7EC987] focus:border-[#4D7051]"
              placeholder={`Enter value in ${getUnitForType(selectedType)}`}
              step="0.1"
            />
            <span className="inline-flex items-center px-3 py-2 text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
              {getUnitForType(selectedType)}
            </span>
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <motion.button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-[#7EC987] text-white rounded-md hover:bg-[#4D7051] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={!value || isNaN(parseFloat(value))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save
          </motion.button>
        </div>
      </motion.div>

      {pendingMeasurement && (
        <MeasurementPeriodWarning
          isOpen={showWarning}
          onConfirm={handleConfirmOverwrite}
          onCancel={handleCancelOverwrite}
          measurementType={
            allowedMeasurements.find((m) => m.id === pendingMeasurement.type)
              ?.label || ""
          }
          existingDate={pendingMeasurement.existingMeasurement.date}
        />
      )}
    </>
  );
};

export default MeasurementInput;
