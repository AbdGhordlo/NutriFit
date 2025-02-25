import React from "react";

interface NavigationButtonsProps {
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isLastStep: boolean;
}

export function NavigationButtons({
  onNext,
  onBack,
  canGoBack,
  isLastStep,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between gap-4 mt-8">
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={`min-w-24 px-6 py-2 rounded-lg border border-gray-300 text-quaternary-text hover:bg-gray-50 ${
          canGoBack
            ? ""
            : "opacity-50 cursor-not-allowed pointer-events-none"
        }`}
      >
        Back
      </button>
      <button
        onClick={onNext}
        className="min-w-24 px-6 py-2 rounded-lg bg-primary-green text-white hover:bg-primary-hover"
      >
        {isLastStep ? "Finish" : "Next"}
      </button>
    </div>
  );
}
