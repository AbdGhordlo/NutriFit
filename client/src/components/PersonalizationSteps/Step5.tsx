import React from "react";
import { Budget } from "../../types/personalization";
import { renderBudgetOption } from "./utilities";
import { DollarSign, Apple } from "lucide-react";

interface Step5Props {
  budget: Budget;
  setBudget: (option: Budget) => void;
  hasKitchenInventory: boolean;
  setHasKitchenInventory: (hasInventory: boolean) => void;
}

export const Step5 = ({
  budget,
  setBudget,
  hasKitchenInventory,
  setHasKitchenInventory,
}: Step5Props) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-dark-green mb-6">Budget & Kitchen</h2>

    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-green mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Monthly Food Budget
        </h3>
        <div className="grid gap-4">
          {renderBudgetOption("basic", "$100 - $200 per month", budget, setBudget)}
          {renderBudgetOption("standard", "$200 - $400 per month", budget, setBudget)}
          {renderBudgetOption("premium", "$400 - $600 per month", budget, setBudget)}
          {renderBudgetOption("luxury", "$600+ per month", budget, setBudget)}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-dark-green mb-4 flex items-center gap-2">
          <Apple className="w-5 h-5" />
          Kitchen Inventory
        </h3>
        <button
          onClick={() => setHasKitchenInventory(!hasKitchenInventory)}
          className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
            hasKitchenInventory
              ? "border-primary-green bg-light-green"
              : "border-gray-200 hover:border-primary-green"
          }`}
        >
          <h4 className="text-base font-medium text-dark-green mb-2">
            Add Your Kitchen Inventory
          </h4>
          <p className="text-sm text-secondary-text">
            Let us know what ingredients you already have to get better meal recommendations.
          </p>
        </button>
      </div>
    </div>
  </div>
);