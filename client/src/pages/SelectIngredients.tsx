import React, { useState } from "react";
import { X } from "lucide-react";
import { mapCategory } from "../utils/mapCategory"; // Adjusted the path to be relative

interface FoodItem {
  fdcId: number;
  description: string;
  foodCategory: string;
  servingSize?: string;
  calories?: number;
}

interface Props {
  onClose: () => void;
  onAdd: (item: FoodItem) => void;
}

const SelectIngredients: React.FC<Props> = ({ onClose, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  const searchFood = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=xOhA0U8ldEU349zVzOAiS9qJxvyU1VJGMcM6lYVW&query=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();
      setResults(
        (data.foods || []).filter((food) => food.dataType !== "Branded")
      );
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">Select Ingredient</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Search for food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={searchFood}>Search</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="ingredient-list">
            {results.map((item) => (
              <li key={item.fdcId}>
                {item.description}{" "}
                <em style={{ fontSize: "0.85em", color: "#777" }}>
                  ({mapCategory(item.foodCategory || "Other")})
                </em>
                <button onClick={() => onAdd(item)}>Add</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectIngredients;
