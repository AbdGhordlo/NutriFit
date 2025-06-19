import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MeasurementInput from "./MeasurementInput";
import LineChart from "./LineChart";
import { getFormattedUnit } from "../../utils/progressUtils";
import {
  getWaistToHipRatioHistory,
  getBMIHistory,
  getMergedFatMassHistory,
  getMergedLeanMassHistory,
} from "../../utils/anthropometricUtils";
import { v4 as uuidv4 } from "uuid";

interface AnthropometricMeasurementsProps {
  weightHistory: Array<{ value: number; date: string; unit: string }>;
  heightHistory: Array<{ value: number; date: string; unit: string }>;
  waistHistory: Array<{ value: number; date: string; unit: string }>;
  hipHistory: Array<{ value: number; date: string; unit: string }>;
  fatMassHistory?: Array<{ value: number; date: string; unit: string }>;
  leanMassHistory?: Array<{ value: number; date: string; unit: string }>;

  currentWeight: { value: number; unit: string } | null;
  currentHeight: { value: number; unit: string } | null;
  currentWaist: { value: number; unit: string } | null;
  currentHip: { value: number; unit: string } | null;
  currentFatMass?: { value: number; unit: string } | null;
  currentLeanMass?: { value: number; unit: string } | null;
  onSaveMeasurement: (
    type: string,
    value: number,
    unit?: string
  ) => Promise<void>;
}

const AnthropometricMeasurements = ({
  weightHistory,
  heightHistory,
  waistHistory,
  hipHistory,
  fatMassHistory,
  leanMassHistory,
  currentWeight,
  currentHeight,
  currentWaist,
  currentHip,
  currentFatMass,
  currentLeanMass,
  onSaveMeasurement,
}: AnthropometricMeasurementsProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<string | null>(
    null
  );
  const [showInput, setShowInput] = useState(false);

  const historicalData = {
    weight: weightHistory,
    height: heightHistory,
    waist: waistHistory,
    hip: hipHistory,
    bodyFatMass: getMergedFatMassHistory(
      fatMassHistory,
      leanMassHistory,
      weightHistory
    ),
    leanBodyMass: getMergedLeanMassHistory(
      leanMassHistory,
      fatMassHistory,
      weightHistory
    ),
    waistToHipRatio: getWaistToHipRatioHistory(waistHistory, hipHistory),
    bmi: getBMIHistory(weightHistory, heightHistory),
  };

  // Use props directly for measurements and historicalData
  const measurements = {
    weight: {
      current: currentWeight?.value || 0,
      unit: currentWeight?.unit || "kg",
    },
    height: {
      current: currentHeight?.value || 0,
      unit: currentHeight?.unit || "cm",
    },
    waist: {
      current: currentWaist?.value || 0,
      unit: currentWaist?.unit || "cm",
    },
    hip: { current: currentHip?.value || 0, unit: currentHip?.unit || "cm" },
    bodyFatMass: {
      current:
        currentFatMass?.value || historicalData.bodyFatMass[0]?.value || 0,
      unit: currentFatMass?.unit || "kg",
    },
    leanBodyMass: {
      current:
        currentLeanMass?.value || historicalData.leanBodyMass[0]?.value || 0,
      unit: currentLeanMass?.unit || "kg",
    },
    waistToHipRatio: {
      current: historicalData.waistToHipRatio[0]?.value || 0,
      unit: "ratio",
    },
    bmi: {
      current: historicalData.bmi[0]?.value || 0,
      unit: "kg/m²",
    },
  };

  const handleMeasurementClick = (measurementType) => {
    setSelectedMeasurement(measurementType);
    setShowInput(false);
  };

  const handleAddMeasurement = () => {
    setShowInput(true);
    setSelectedMeasurement(null);
  };

  const toggleAdvancedMetrics = () => {
    setShowAdvanced(!showAdvanced);
    setSelectedMeasurement("weight");
  };

  // Calculate derived measurements
  const calculateDerivedMeasurements = (data) => {
    // Calculate waist-to-hip ratio
    if (data.waist && data.hip) {
      const waist = data.waist.current;
      const hip = data.hip.current;
      let ratio = 0;
      if (hip && hip !== 0) {
        ratio = parseFloat((waist / hip).toFixed(2));
        if (!isFinite(ratio) || isNaN(ratio)) ratio = 0;
      }
      data.waistToHipRatio = {
        current: ratio,
        unit: "ratio",
      };
    }

    // Calculate BMI (kg/m²)
    if (data.weight && data.height) {
      const heightInMeters = data.height.current / 100;
      let bmi = 0;
      if (heightInMeters && heightInMeters !== 0) {
        bmi = parseFloat(
          (data.weight.current / (heightInMeters * heightInMeters)).toFixed(1)
        );
        if (!isFinite(bmi) || isNaN(bmi)) bmi = 0;
      }
      data.bmi = {
        current: bmi,
        unit: "kg/m²",
      };
    }

    // Ensure body composition values are synced
    if (data.weight && data.bodyFatMass && data.leanBodyMass) {
      // If weight and one of the body composition values was updated, update the other
      const totalWeight = data.weight.current;
      const bodyFatMass = data.bodyFatMass.current;
      const leanBodyMass = data.leanBodyMass.current;

      // Check if total weight = fat mass + lean mass
      if (Math.abs(bodyFatMass + leanBodyMass - totalWeight) > 0.1) {
        // If body fat was the most recently updated
        data.leanBodyMass = {
          ...data.leanBodyMass,
          current: parseFloat((totalWeight - bodyFatMass).toFixed(1)),
        };
      }
    }

    return data;
  };

  // Basic measurements
  const basicMeasurementTypes = [
    { id: "weight", label: "Weight", icon: "⚖️" },
    { id: "height", label: "Height", icon: "📏" },
    { id: "waist", label: "Waist", icon: "👖" },
    { id: "hip", label: "Hip", icon: "🍑" },
  ];

  // Advanced measurements
  const advancedMeasurementTypes = [
    {
      id: "waistToHipRatio",
      label: "Waist/Hip",
      icon: "📊",
      derived: true,
      tooltip: {
        title: "Waist-to-Hip Ratio",
        description:
          "Measures body fat distribution and is an indicator of health risk.",
        men: {
          healthy: "<0.95",
          ranges: [
            "<0.90: Low risk",
            "0.90-0.95: Moderate risk",
            ">0.95: High risk",
          ],
        },
        women: {
          healthy: "<0.80",
          ranges: [
            "<0.75: Low risk",
            "0.75-0.80: Moderate risk",
            ">0.80: High risk",
          ],
        },
      },
    },
    {
      id: "bmi",
      label: "BMI",
      icon: "📉",
      derived: true,
      tooltip: {
        title: "Body Mass Index (BMI)",
        description:
          "A measure of body fat based on height and weight. Same for men and women.",
        ranges: [
          "<18.5: Underweight",
          "18.5-24.9: Normal weight",
          "25.0-29.9: Overweight",
          "30.0+: Obesity",
        ],
        note: "BMI doesn't account for muscle mass, bone density, or overall body composition.",
      },
    },
    {
      id: "bodyFatMass",
      label: "Fat Mass",
      icon: "🔄",
      tooltip: {
        title: "Body Fat Mass",
        description:
          "The total weight of fat in your body. Healthy body fat percentage ranges:",
        men: {
          ranges: [
            "Essential fat: 2-5%",
            "Athletes: 6-13%",
            "Fitness: 14-17%",
            "Acceptable: 18-24%",
            "Obesity: 25%+",
          ],
        },
        women: {
          ranges: [
            "Essential fat: 10-13%",
            "Athletes: 14-20%",
            "Fitness: 21-24%",
            "Acceptable: 25-31%",
            "Obesity: 32%+",
          ],
        },
      },
    },
    {
      id: "leanBodyMass",
      label: "Lean Mass",
      icon: "💪",
      tooltip: {
        title: "Lean Body Mass",
        description:
          "The weight of everything in your body except fat, including muscle, organs, bones, blood, etc.",
        men: { info: "75-85% of total body weight" },
        women: { info: "65-75% of total body weight" },
        note: "Higher lean mass generally indicates better physical fitness and metabolic health.",
      },
    },
  ];

  // Get all active measurement types
  const activeMeasurementTypes = [
    ...basicMeasurementTypes,
    ...(showAdvanced ? advancedMeasurementTypes : []),
  ];

  // Calculate derived measurements for initial render
  const derivedMeasurements = calculateDerivedMeasurements({ ...measurements });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  const getMeasurementValue = (id) => {
    if (id === "waistToHipRatio") {
      let value =
        derivedMeasurements.waistToHipRatio?.current ||
        (measurements.waist.current && measurements.hip.current
          ? (measurements.waist.current / measurements.hip.current).toFixed(2)
          : 0);
      if (!isFinite(value) || isNaN(value)) value = 0;
      return value;
    } else if (id === "bmi") {
      const heightInMeters = measurements.height.current / 100;
      let value =
        derivedMeasurements.bmi?.current ||
        (heightInMeters && heightInMeters !== 0
          ? (
              measurements.weight.current /
              (heightInMeters * heightInMeters)
            ).toFixed(1)
          : 0);
      if (!isFinite(value) || isNaN(value)) value = 0;
      return value;
    } else {
      return measurements[id].current;
    }
  };

  const getMeasurementUnit = (id) => {
    if (id === "waistToHipRatio") {
      return "ratio";
    } else if (id === "bmi") {
      return "kg/m²";
    } else {
      return measurements[id].unit;
    }
  };

  const getAnalysisText = (id) => {
    switch (id) {
      case "weight":
        return "You have lost 5kg over the past 5 months. Great progress!";
      case "waist":
        return "Your waist circumference has decreased by 5cm. Keep up the good work!";
      case "hip":
        return "Your hip circumference has decreased by 3cm.";
      case "height":
        return "Your height has remained constant.";
      case "waistToHipRatio":
        return "Your waist-to-hip ratio has improved from 0.87 to 0.84, indicating better body composition.";
      case "bmi":
        return "Your BMI has decreased from 24.5 to 22.9, moving toward the ideal range of 18.5-24.9.";
      case "bodyFatMass":
        return "You have lost 4kg of body fat in the past 5 months!";
      case "leanBodyMass":
        return "Your lean body mass has remained relatively stable at around 56kg.";
      default:
        return "";
    }
  };

  // Map all histories into a unified array for useMeasurementPeriod
  const allMeasurements = useMemo(() => {
    function mapHistory(arr, type) {
      return (arr || []).map((m, idx) => ({
        type,
        value: m.value,
        date: new Date(m.date),
        id: m.id || `${type}-${m.date}-${idx}`,
      }));
    }
    return [
      ...mapHistory(weightHistory, "weight"),
      ...mapHistory(heightHistory, "height"),
      ...mapHistory(waistHistory, "waist"),
      ...mapHistory(hipHistory, "hip"),
      ...mapHistory(fatMassHistory, "bodyFatMass"),
      ...mapHistory(leanMassHistory, "leanBodyMass"),
    ];
  }, [
    weightHistory,
    heightHistory,
    waistHistory,
    hipHistory,
    fatMassHistory,
    leanMassHistory,
  ]);

  return (
    <div className="anthropometric-measurements">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Body Measurements</h2>
        <motion.button
          className="toggle-advanced-btn text-sm px-3 py-1 rounded-full border border-[#7EC987] text-[#4D7051] hover:bg-[#E9F5EB]"
          onClick={toggleAdvancedMetrics}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </motion.button>
      </div>

      <motion.div
        className="measurement-cards grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activeMeasurementTypes.map((type) => (
          <motion.div
            key={type.id}
            variants={itemVariants}
            className={`measurement-card p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedMeasurement === type.id
                ? "border-2 border-[#7EC987]"
                : "bg-white border border-gray-200 hover:border-[#7EC987] hover:shadow-md"
            } relative`}
            onClick={() => handleMeasurementClick(type.id)}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: selectedMeasurement === type.id ? "#E9F5EB" : "",
            }}
          >
            {(type.id === "waistToHipRatio" ||
              type.id === "bmi" ||
              type.id === "bodyFatMass" ||
              type.id === "leanBodyMass") && (
              <div className="absolute top-2 right-2 z-10">
                <div className="relative group">
                  <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600 cursor-help">
                    i
                  </div>
                  <div className="absolute z-20 invisible group-hover:visible bg-white p-3 rounded-lg shadow-lg border border-gray-200 w-64 text-xs right-0 top-6">
                    {type.id === "waistToHipRatio" && (
                      <>
                        <h5 className="font-bold mb-1 text-[#4D7051]">
                          Waist-to-Hip Ratio
                        </h5>
                        <p className="mb-2">
                          Measures body fat distribution and is an indicator of
                          health risk.
                        </p>
                        <p className="mb-1">
                          <span className="font-semibold">Men:</span> Healthy
                          range: &lt;0.95
                        </p>
                        <ul className="ml-4 mb-1">
                          <li>&lt;0.90: Low risk</li>
                          <li>0.90-0.95: Moderate risk</li>
                          <li>&gt;0.95: High risk</li>
                        </ul>
                        <p className="mb-1">
                          <span className="font-semibold">Women:</span> Healthy
                          range: &lt;0.80
                        </p>
                        <ul className="ml-4">
                          <li>&lt;0.75: Low risk</li>
                          <li>0.75-0.80: Moderate risk</li>
                          <li>&gt;0.80: High risk</li>
                        </ul>
                      </>
                    )}
                    {type.id === "bmi" && (
                      <>
                        <h5 className="font-bold mb-1 text-[#4D7051]">
                          Body Mass Index (BMI)
                        </h5>
                        <p className="mb-2">
                          A measure of body fat based on height and weight. Same
                          for men and women.
                        </p>
                        <ul className="ml-4">
                          <li>&lt;18.5: Underweight</li>
                          <li>18.5-24.9: Normal weight</li>
                          <li>25.0-29.9: Overweight</li>
                          <li>30.0+: Obesity</li>
                        </ul>
                        <p className="mt-1 text-gray-500">
                          Note: BMI doesn't account for muscle mass, bone
                          density, or overall body composition.
                        </p>
                      </>
                    )}
                    {type.id === "bodyFatMass" && (
                      <>
                        <h5 className="font-bold mb-1 text-[#4D7051]">
                          Body Fat Mass
                        </h5>
                        <p className="mb-2">
                          The total weight of fat in your body. Healthy body fat
                          percentage ranges:
                        </p>
                        <p className="mb-1">
                          <span className="font-semibold">Men:</span>
                        </p>
                        <ul className="ml-4 mb-1">
                          <li>Essential fat: 2-5%</li>
                          <li>Athletes: 6-13%</li>
                          <li>Fitness: 14-17%</li>
                          <li>Acceptable: 18-24%</li>
                          <li>Obesity: 25%+</li>
                        </ul>
                        <p className="mb-1">
                          <span className="font-semibold">Women:</span>
                        </p>
                        <ul className="ml-4">
                          <li>Essential fat: 10-13%</li>
                          <li>Athletes: 14-20%</li>
                          <li>Fitness: 21-24%</li>
                          <li>Acceptable: 25-31%</li>
                          <li>Obesity: 32%+</li>
                        </ul>
                      </>
                    )}
                    {type.id === "leanBodyMass" && (
                      <>
                        <h5 className="font-bold mb-1 text-[#4D7051]">
                          Lean Body Mass
                        </h5>
                        <p className="mb-2">
                          The weight of everything in your body except fat,
                          including muscle, organs, bones, blood, etc.
                        </p>
                        <p className="mb-1">
                          Typical ranges as % of total weight:
                        </p>
                        <p className="mb-1">
                          <span className="font-semibold">Men:</span> 75-85% of
                          total body weight
                        </p>
                        <p className="mb-1">
                          <span className="font-semibold">Women:</span> 65-75%
                          of total body weight
                        </p>
                        <p className="mt-1">
                          Higher lean mass generally indicates better physical
                          fitness and metabolic health.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-2">{type.icon}</span>
              <h4 className="text-sm font-medium text-gray-700">
                {type.label}
              </h4>
              <div className="mt-2 text-lg font-bold text-gray-900">
                {getMeasurementValue(type.id)}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {getFormattedUnit(getMeasurementUnit(type.id))}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="measurement-content bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            {selectedMeasurement
              ? `${
                  activeMeasurementTypes.find(
                    (t) => t.id === selectedMeasurement
                  )?.label
                } History`
              : "Measurement History"}
          </h3>
          <motion.button
            className="add-measurement-btn text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4D7051] focus:outline-none focus:ring-2 focus:ring-[#7EC987] focus:ring-opacity-50"
            onClick={handleAddMeasurement}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ backgroundColor: "#7EC987" }}
          >
            Add Measurement
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {showInput && (
            <motion.div
              key="input"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MeasurementInput
                onSave={async (type, value) => {
                  await onSaveMeasurement(type, value);
                  setShowInput(false);
                }}
                onCancel={() => setShowInput(false)}
                measurements={allMeasurements}
                onSaveMeasurement={onSaveMeasurement}
              />
            </motion.div>
          )}

          {selectedMeasurement && !showInput && (
            <motion.div
              key="chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LineChart
                data={historicalData[selectedMeasurement]}
                color="#7EC987"
              />
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium">Progress Analysis:</p>
                <p>{getAnalysisText(selectedMeasurement)}</p>
              </div>
            </motion.div>
          )}

          {!selectedMeasurement && !showInput && (
            <motion.div
              key="instruction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-gray-500"
            >
              <p>Select a measurement to view your progress over time</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnthropometricMeasurements;
