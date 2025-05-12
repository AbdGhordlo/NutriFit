import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { mapCategory } from "../utils/mapCategory"; // Keep the existing import

interface FoodItem {
  fdcId: number;
  description: string;
  foodCategory: string;
  servingSize?: string;
  calories?: number;
}

interface Category {
  name: string;
  ingredients: any[];
}

interface Props {
  onClose: () => void;
  onAdd: (item: FoodItem, category: string) => void;
  categories: Category[];
}

const SelectIngredients: React.FC<Props> = ({ onClose, onAdd, categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);
  const [apiError, setApiError] = useState("");

  // Set default category when component mounts
  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0].name);
    }
  }, [categories]);
  // Function to get smart serving size
  function getSmartServingSize(foodDetails, category) {
    const unit = (foodDetails.servingSizeUnit || "").toLowerCase();
    const size = foodDetails.servingSize || 100;
    const household = foodDetails.householdServingFullText;

    if (household) return household;

    if (["Drinks", "Fats & Oils", "Other Drinks"].includes(category)) {
      return `${Math.round(size)}ml`;
    }

    if (
      ["Spices, Herbs & Condiments", "Legumes, Nuts & Seeds"].includes(category)
    ) {
      return `${Math.round(size)}g`;
    }

    // ✳️ Varsayılan değer olarak gram ver
    return `${Math.round(size)}g`;
  }

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

  const handleSelectItem = (item: FoodItem) => {
    const mappedCategory = mapCategory(item.foodCategory || "Other");

    if (mappedCategory === "Other") {
      // Show category selection only if it's mapped to Other
      setSelectedItem(item);
      setSelectedCategory(categories[0]?.name || "Other");
      setShowCategorySelect(true);
    } else {
      // Directly add if category is not "Other"
      onAdd(item, mappedCategory);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    if (value === "new") {
      setShowNewCategoryField(true);
    } else {
      setSelectedCategory(value);
      setShowNewCategoryField(false);
    }
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleAddWithCategory = async () => {
    if (!selectedItem) return;

    const finalCategory = showNewCategoryField ? newCategory : selectedCategory;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const fetchFoodDetails = async (fdcId: number) => {
        const apiKey = "xOhA0U8ldEU349zVzOAiS9qJxvyU1VJGMcM6lYVW";
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`
        );
        return await response.json();
      };

      const foodDetails = await fetchFoodDetails(selectedItem.fdcId);
      const nutrients = foodDetails.foodNutrients || [];
      const getValue = (id: number) =>
        nutrients.find((n: any) => n.nutrient?.id === id)?.amount ?? 0;

      const payload = {
        userId: localStorage.getItem("userId"),
        name: selectedItem.description,
        category: finalCategory,
        serving_size: getSmartServingSize(foodDetails, finalCategory),
        calories: getValue(1008),
        protein: getValue(1003),
        carbs: getValue(1005),
        fats: getValue(1004),
      };

      const response = await fetch("http://localhost:5000/ingredients", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        setApiError("This ingredient already exists.");
        return;
      }

      if (!response.ok) throw new Error("Add from API failed");

      setApiError("");
      onAdd(selectedItem, finalCategory);
    } catch (err) {
      console.error("Add failed:", err);
      setApiError(
        "Something went wrong. This ingredient might already exists."
      );
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">
            {showCategorySelect ? "Select Category" : "Select Ingredient"}
          </h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {!showCategorySelect ? (
          <>
            <div className="form-group">
              <input
                type="text"
                placeholder="Search for food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchFood()}
              />
              <button
                onClick={searchFood}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  backgroundColor: "var(--color-primary-green)",
                  color: "#ffffff", // Changed to white
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-primary-hover)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-primary-green)")
                }
              >
                <span
                  style={{
                    display: "inline-block",
                    marginRight: "8px",
                    fontSize: "16px",
                  }}
                >
                  🔍
                </span>
                Search
              </button>
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
                    <button onClick={() => handleSelectItem(item)}>
                      Select
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <div className="category-selection" style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontWeight: "bold",
                fontSize: "1.2em",
                textAlign: "left",
                marginBottom: "10px",
              }}
            >
              {selectedItem?.description}
            </h3>
            <p style={{ marginBottom: "15px" }}>
              Choose a category for {selectedItem?.description}
            </p>
            {!showNewCategoryField ? (
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label htmlFor="category">Select Category</label>
                <select
                  id="category"
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                  style={{ marginBottom: "10px" }}
                >
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                  <option value="new">+ Add New Category</option>
                </select>
              </div>
            ) : (
              <div className="form-group new-category-group">
                <label htmlFor="newCategory">New Category Name</label>
                <input
                  type="text"
                  id="newCategory"
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                  required
                  placeholder="Enter new category name"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryField(false);
                    setNewCategory("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="form-actions" style={{ marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => {
                  setShowCategorySelect(false);
                  setSelectedItem(null);
                }}
              >
                Back
              </button>
              <button type="button" onClick={handleAddWithCategory}>
                Add Ingredient
              </button>
            </div>
            {apiError && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontWeight: "500",
                  marginTop: "16px",
                  border: "1px solid #721c24",
                }}
              >
                {apiError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectIngredients;
