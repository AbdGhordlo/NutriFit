import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trophy,
  Star,
  Sparkles,
  Heart,
  Target,
  PartyPopper,
} from "lucide-react";

interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetNewGoal: () => void;
  goalType: "lose_weight" | "gain_weight";
  targetWeight: number;
  currentWeight: number | undefined;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
  isOpen,
  onClose,
  onSetNewGoal,
  goalType,
  targetWeight,
  currentWeight,
}) => {
  const getGoalMessage = () => {
    if (goalType === "lose_weight") {
      return `You've successfully lost weight and reached your target of ${targetWeight} kg!`;
    } else {
      return `You've successfully gained weight and reached your target of ${targetWeight} kg!`;
    }
  };

  const confettiVariants = {
    hidden: { opacity: 0, scale: 0, rotate: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 360,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const handleSetNewGoal = () => {
    onSetNewGoal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50"></div>

            {/* Floating confetti elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={confettiVariants}
                  initial="hidden"
                  animate="visible"
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  {i % 4 === 0 && <Star className="w-4 h-4 text-yellow-400" />}
                  {i % 4 === 1 && (
                    <Sparkles className="w-4 h-4 text-pink-400" />
                  )}
                  {i % 4 === 2 && <Heart className="w-3 h-3 text-red-400" />}
                  {i % 4 === 3 && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 z-[100] p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer text-gray-500 hover:text-gray-700"
              style={{ pointerEvents: "auto" }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="relative z-10 p-5 text-center">
              {" "}
              {/* Slightly reduced padding */}
              {/* Trophy icon with animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="mx-auto mb-2" // Slightly reduced margin
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  {" "}
                  {/* Slightly smaller trophy */}
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-gray-800 mb-2" // Slightly smaller font and margin
              >
                🎉 Congratulations! 🎉
              </motion.h2>
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base font-semibold text-gray-700 mb-2" // Slightly smaller font and margin
              >
                You've Achieved Your Goal!
              </motion.p>
              {/* Goal details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white bg-opacity-70 rounded-2xl p-4 mb-2 border border-gray-100"
              >
                <p
                  className="text-gray-700 leading-relaxed mb-1"
                  style={{ fontSize: "0.95rem" }}
                >
                  {getGoalMessage()}
                </p>
                <div className="flex justify-center items-center space-x-2 text-xs text-gray-600">
                  {" "}
                  {/* Slightly smaller text */}
                  <div className="bg-gray-100 rounded-full px-2 py-2">
                    Current:{" "}
                    <span className="font-semibold">{currentWeight} kg</span>
                  </div>
                  <div className="bg-green-100 text-green-700 rounded-full px-2 py-2">
                    Target:{" "}
                    <span className="font-semibold">{targetWeight} kg</span>
                  </div>
                </div>
              </motion.div>
              {/* Motivational message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-2" // Slightly reduced margin
              >
                <p
                  className="text-gray-700 leading-relaxed mb-3"
                  style={{ fontSize: "0.93rem" }}
                >
                  After weeks of dedication, discipline, and hard work, you've
                  reached your goal. This is a truly remarkable achievement! 💪
                </p>
                <p className="text-gray-600 text-xs mb-8">
                  Your journey doesn't have to end here. To maintain your
                  amazing results and continue feeling your best, consider
                  setting a new goal in Personalization and choose the{" "}
                  <span className="font-semibold text-blue-600">
                    Improve Health
                  </span>{" "}
                  option.
                </p>
              </motion.div>
              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSetNewGoal}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform flex items-center justify-center gap-2 text-xs"
                >
                  <Target className="w-5 h-5" />
                  Set New Goal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    const nutriFitLink = "https://nutrifit.com/";
                    const shareText =
                      `🎉 I reached my weight goal with NutriFit!\n\n` +
                      `My hard work and perseverance paid off!\n` +
                      `Join me on NutriFit and start your journey! #NutriFit #Success #Achievement\n${nutriFitLink}`;
                    try {
                      const response = await fetch(
                        "/src/assets/imgs/goal-reached.png"
                      );
                      const blob = await response.blob();
                      const file = new File([blob], "goal-reached.png", {
                        type: blob.type,
                      });
                      if (
                        navigator.share &&
                        navigator.canShare &&
                        navigator.canShare({ files: [file] })
                      ) {
                        await navigator.share({
                          title: "I reached my weight goal!",
                          text: shareText,
                          files: [file],
                        });
                      } else {
                        // fallback: open image in new tab
                        window.open(
                          "/src/assets/imgs/goal-reached.png",
                          "_blank"
                        );
                      }
                    } catch (err) {
                      alert(
                        "Sharing failed. Please try again or save the image manually."
                      );
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-2 px-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform flex items-center justify-center gap-2 text-xs"
                >
                  <PartyPopper className="w-5 h-5" />
                  Let's Celebrate!
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CongratulationsModal;
