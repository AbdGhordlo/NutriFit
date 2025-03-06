import React from "react";
import Button from "./Button";

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
      <Button
        onClick={onBack}
        disabled={!canGoBack}
        variant="secondary"
      >
        Back
      </Button>
      <Button
        onClick={onNext}
        variant="primary"
      >
        {isLastStep ? "Finish" : "Next"}
      </Button>
    </div>
  );
}
