import React from 'react';
import { Step } from '../types/personalization';


interface ProgressBarProps {
  currentStep: Step;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div className="text-xs font-semibold text-dark-green">
            Step {currentStep} of {totalSteps}
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-dark-green">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
        </div>
        <div className="flex h-2 mb-4 overflow-hidden rounded bg-light-green">
          <div
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            className="flex flex-col justify-center rounded bg-primary-green transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}