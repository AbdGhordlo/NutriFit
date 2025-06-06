import React, { useState, useEffect } from "react";
import {
  Plus,
  Beef,
  Fish,
  Carrot,
  Wheat,
  Milk,
  Apple,
  Bean,
  UtensilsCrossed,
  Droplet as Oil,
  X,
  Trash2,
  CupSoda,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { styles } from "./styles/IngredientsStyles";
import "../pages/Ingredients.css";
import "../assets/commonStyles.css";
import "./Ingredients.css";
import { getUserIdFromToken } from "../utils/auth";
import SelectIngredients from "./SelectIngredients";
import { mappedCategories } from "../utils/mapCategory";
import SpicesIcon from "../components/icons/SpicesIcon";

const categories: {
  [key: string]: {
    icon: React.ComponentType<any> | string;
    displayName?: string;
  };
} = {
  Vegetables: { icon: Carrot },
  Fruits: { icon: Apple },
  "Meat & Poultry": { icon: Beef },
  "Dairy & Eggs": { icon: Milk },
  "Grains & Cereals": { icon: Wheat },
  "Legumes, Nuts & Seeds": { icon: Bean },
  Seafood: { icon: Fish },
  "Fats & Oils": { icon: Oil },
  "Spices, Herbs & Condiments": { icon: SpicesIcon },
  Other: { icon: UtensilsCrossed },
  "Other Drinks": { icon: CupSoda, displayName: "Drink" },
  Drinks: { icon: CupSoda },
};

interface Ingredient {
  id: number;
  user_ingredient_id: number;
  name: string;
  category: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  in_stock: boolean;
}

interface Category {
  name: string;
  ingredients: Ingredient[];
}

interface NewIngredient {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
}

export default function Ingredients() {
  const userId = getUserIdFromToken();
  const token = localStorage.getItem("token");

  if (!token || !userId) {
    window.location.href = "/login";
    return null;
  }
  const [ingredients, setIngredients] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredStock, setHoveredStock] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSelectPopup, setShowSelectPopup] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [apiError, setApiError] = useState("");
  const [currentCategory, setCurrentCategory] = useState(0);
  // Add userId state if you need to track it through state
  const [userIdState, setUserIdState] = useState("");

  const [newIngredient, setNewIngredient] = useState<NewIngredient>({
    name: "",
    category: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    servingSize: "100g",
  });
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);
  // Add state for delete confirmation popup
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIngredientId, setDeleteIngredientId] = useState<number | null>(
    null
  );
  const [deleteIngredientName, setDeleteIngredientName] = useState("");
  const [deleting, setDeleting] = useState(false);
  // Ensure userId is set in state if needed
  useEffect(() => {
    const id = getUserIdFromToken();
    if (id) setUserIdState(id);
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [userId]);

  useEffect(() => {
    fetchIngredients();
  }, [userId]);

  useEffect(() => {
    if (showPopup && ingredients.length > 0) {
      setNewIngredient({
        name: "",
        category: ingredients[0].name,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        servingSize: "100g",
      });
      setNewCategory("");
      setShowNewCategoryField(false);
    }
  }, [showPopup, ingredients]);

  const sortCategoriesWithOtherLast = (categories: Category[]): Category[] => {
    return [
      ...categories.filter((c) => c.name !== "Other"),
      ...categories.filter((c) => c.name === "Other"),
    ];
  };
  function getSmartServingSize(foodDetails, category) {
    const unit = (foodDetails.servingSizeUnit || "").toLowerCase();
    const size = foodDetails.servingSize || 100;
    const household = foodDetails.householdServingFullText;

    if (household) return household;

    if (["Drinks", "Fats & Oils", "Other Drinks"].includes(category)) {
      return `${Math.round(size)}ml`;
    }

    // Küçük gramajlı kategoriler için küçük g
    if (
      ["Spices, Herbs & Condiments", "Legumes, Nuts & Seeds"].includes(category)
    ) {
      return `${Math.round(size)}g`;
    }

    // Varsayılan
    return `${Math.round(size)}g`;
  }

  const fetchIngredients = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, redirecting to login...");
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/ingredients/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        console.error("Unauthorized, removing token and redirecting...");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Group ingredients by category
      const groupedData = data.reduce((acc: any, ingredient: any) => {
        const category = ingredient.ingredient_category;
        if (!acc[category]) {
          acc[category] = { name: category, ingredients: [] };
        }
        acc[category].ingredients.push({
          id: ingredient.ingredient_id,
          user_ingredient_id: ingredient.user_ingredient_id,
          name: ingredient.ingredient_name,
          category: ingredient.ingredient_category,
          servingSize: ingredient.ingredient_serving_size || "100g",
          calories: ingredient.ingredient_calories || 0,
          protein: ingredient.ingredient_protein || 0,
          carbs: ingredient.ingredient_carbs || 0,
          fats: ingredient.ingredient_fats || 0,
          in_stock: ingredient.in_stock === true,
        });
        return acc;
      }, {});

      setIngredients(sortCategoriesWithOtherLast(Object.values(groupedData)));
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStock = async (
    userIngredientId: number,
    currentInStock: boolean
  ) => {
    if (!token || !userId) {
      console.error("Unauthorized access. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/ingredients/${userIngredientId}/toggle-stock`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ in_stock: !currentInStock }),
        }
      );

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Toggle stock failed: ${response.status} - ${errMsg}`);
      }
      setIngredients((prevIngredients) =>
        prevIngredients.map((category) => ({
          ...category,
          ingredients: category.ingredients.map((ingredient) =>
            ingredient.user_ingredient_id === userIngredientId
              ? { ...ingredient, in_stock: !currentInStock }
              : ingredient
          ),
        }))
      );
    } catch (error) {
      console.error("Error toggling ingredient stock:", error);
      fetchIngredients();
    }
  };

  const handleDeleteIngredient = async () => {
    if (deleteIngredientId === null) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token, redirecting...");
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `http://localhost:5000/ingredients/${deleteIngredientId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      setIngredients((prev) =>
        prev
          .map((category) => ({
            ...category,
            ingredients: category.ingredients.filter(
              (ing) => ing.user_ingredient_id !== deleteIngredientId
            ),
          }))
          .filter((category) => category.ingredients.length > 0)
      );

      // Close the confirmation popup
      setShowDeleteConfirm(false);
      setDeleteIngredientId(null);
      setDeleteIngredientName("");
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      fetchIngredients();
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = (userIngredientId: number, ingredientName: string) => {
    setDeleteIngredientId(userIngredientId);
    setDeleteIngredientName(ingredientName);
    setShowDeleteConfirm(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "category" && value === "new") {
      setShowNewCategoryField(true);
      return;
    }

    let parsedValue: string | number = value;

    // Convert numeric fields to numbers
    if (["calories", "protein", "carbs", "fats"].includes(name)) {
      parsedValue = parseFloat(value) || 0;
    }

    setNewIngredient((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, redirecting to login...");
      window.location.href = "/login";
      return;
    }

    // Use the new category if one was entered
    const finalIngredient = {
      ...newIngredient,
      category: showNewCategoryField ? newCategory : newIngredient.category,
    };

    try {
      const response = await fetch("http://localhost:5000/ingredients", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: finalIngredient.name,
          category: finalIngredient.category,
          servingSize: finalIngredient.servingSize,
          calories: finalIngredient.calories,
          protein: finalIngredient.protein,
          carbs: finalIngredient.carbs,
          fats: finalIngredient.fats,
        }),
      });

      if (response.status === 409) {
        setApiError("This ingredient already exists.");
        return; // 👈 buraya dikkat, form kapanmasın
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      await fetchIngredients();
      setShowPopup(false);
      setApiError("");
    } catch (error) {
      console.error("Error adding ingredient:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddFromAPI = async (item, selectedCategory, onError) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const fetchFoodDetails = async (fdcId) => {
        const apiKey = "xOhA0U8ldEU349zVzOAiS9qJxvyU1VJGMcM6lYVW";
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`
        );
        return await response.json();
      };

      const foodDetails = await fetchFoodDetails(item.fdcId);
      const nutrients = foodDetails.foodNutrients || [];
      const getValue = (id) => {
        const nutrient = nutrients.find((n) => n.nutrient?.id === id);
        return nutrient?.amount ?? 0;
      };

      const payload = {
        userId,
        name: item.description,
        category: selectedCategory,
        servingSize: getSmartServingSize(foodDetails, selectedCategory),
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
        if (onError) onError("This ingredient already exists.");
        return;
      }

      if (!response.ok) {
        if (onError) onError("Add from API failed.");
        return;
      }

      await fetchIngredients();
      setShowSelectPopup(false);
    } catch (err) {
      console.error("❌ API error:", err);
      if (onError) onError("Something went wrong.");
    }
  };

  const allCategories = mappedCategories;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#7ec987" size={50} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Ingredients</h1>

        <div style={styles.categoriesGrid}>
          {ingredients.map((category) => {
            const CategoryIcon =
              categories[category.name]?.icon || UtensilsCrossed;
            return (
              <div key={category.name} style={styles["category-box"]}>
                <div style={styles["category-header-box"]}>
                  <CategoryIcon style={styles.categoryIcon} />
                  <h2 style={styles.categoryTitle}>{category.name}</h2>
                </div>

                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Name</th>
                        <th style={styles.tableHeader}>Serving</th>
                        <th style={styles.tableHeader}>Calories</th>
                        <th style={styles.tableHeader}>Protein</th>
                        <th style={styles.tableHeader}>Carbs</th>
                        <th style={styles.tableHeader}>Fats</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.ingredients.map((ingredient) => (
                        <tr
                          key={ingredient.id}
                          style={{ ...styles.tableRow, cursor: "default" }}
                        >
                          <td style={styles.tableCell}>{ingredient.name}</td>
                          <td style={styles.tableCell}>
                            {ingredient.servingSize}
                          </td>
                          <td style={styles.tableCell}>
                            {ingredient.calories}
                          </td>
                          <td style={styles.tableCell}>
                            {ingredient.protein}g
                          </td>
                          <td style={styles.tableCell}>{ingredient.carbs}g</td>
                          <td style={styles.tableCell}>{ingredient.fats}g</td>
                          <td style={styles.tableCell}>
                            <button
                              onClick={() =>
                                toggleStock(
                                  ingredient.user_ingredient_id,
                                  ingredient.in_stock
                                )
                              }
                              style={{
                                ...styles.stockButton(ingredient.in_stock),
                                backgroundColor: ingredient.in_stock
                                  ? hoveredStock === ingredient.id
                                    ? "rgba(126, 201, 135, 0.2)"
                                    : "rgba(126, 201, 135, 0.1)"
                                  : hoveredStock === ingredient.id
                                  ? "rgba(239, 68, 68, 0.2)"
                                  : "rgba(239, 68, 68, 0.1)",
                              }}
                              onMouseEnter={() =>
                                setHoveredStock(ingredient.id)
                              }
                              onMouseLeave={() => setHoveredStock(null)}
                            >
                              {ingredient.in_stock
                                ? "In Stock"
                                : "Out of Stock"}
                            </button>
                          </td>
                          <td style={styles.tableCell}>
                            <button
                              onClick={() =>
                                confirmDelete(
                                  ingredient.user_ingredient_id,
                                  ingredient.name
                                )
                              }
                              style={{
                                border: "none",
                                background: "rgba(239, 68, 68, 0.1)",
                                borderRadius: "4px",
                                color: "#ef4444",
                                padding: "6px 12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(239, 68, 68, 0.2)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(239, 68, 68, 0.1)";
                              }}
                            >
                              <Trash2
                                size={16}
                                style={{ marginRight: "4px" }}
                              />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <button style={styles.addButton} onClick={() => setShowPopup(true)}>
            <Plus style={{ width: "20px", height: "20px" }} />
            <span>Add Ingredient</span>
          </button>
          <button
            style={styles.addButton}
            onClick={() => {
              setShowSelectPopup(true);
              setApiError("");
            }}
          >
            <Plus style={{ width: "20px", height: "20px" }} />
            <span>Search Ingredients</span>
          </button>
        </div>

        {showSelectPopup && (
          <>
            <SelectIngredients
              onClose={() => setShowSelectPopup(false)}
              onAdd={handleAddFromAPI}
              categories={ingredients}
            />

            {apiError && (
              <div className="error-message">
                <p className="error-font">{apiError}</p>
              </div>
            )}
          </>
        )}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            {submitting ? (
              <div className="loading-container">
                <ClipLoader color="#7ec987" size={40} />
                <p className="loading-text">Adding ingredient...</p>
              </div>
            ) : (
              <>
                <div className="popup-header">
                  <h2 className="popup-title">Add New Ingredient</h2>
                  <button
                    className="close-button"
                    onClick={() => setShowPopup(false)}
                  >
                    <X size={24} />
                  </button>
                </div>

                <form className="popup-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Ingredient Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newIngredient.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter ingredient name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    {!showNewCategoryField ? (
                      <select
                        id="category"
                        name="category"
                        value={newIngredient.category}
                        onChange={handleInputChange}
                        required
                      >
                        {allCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                        <option value="new">+ Add New Category</option>
                      </select>
                    ) : (
                      <div className="new-category-group">
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
                  </div>

                  <div className="form-group">
                    <label htmlFor="servingSize">Serving Size</label>
                    <input
                      type="text"
                      id="servingSize"
                      name="servingSize"
                      value={newIngredient.servingSize}
                      onChange={handleInputChange}
                      placeholder="e.g. 100g"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="calories">Calories (kcal)</label>
                      <input
                        type="number"
                        id="calories"
                        name="calories"
                        value={newIngredient.calories}
                        onChange={handleInputChange}
                        min="0"
                        step="1"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="protein">Protein (g)</label>
                      <input
                        type="number"
                        id="protein"
                        name="protein"
                        value={newIngredient.protein}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="carbs">Carbs (g)</label>
                      <input
                        type="number"
                        id="carbs"
                        name="carbs"
                        value={newIngredient.carbs}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fats">Fats (g)</label>
                      <input
                        type="number"
                        id="fats"
                        name="fats"
                        value={newIngredient.fats}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                      />
                    </div>
                    {apiError && (
                      <div className="error-message">
                        <p className="error-font">{apiError}</p>
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={() => setShowPopup(false)}>
                      Cancel
                    </button>
                    <button type="submit">Create Custom Ingredient</button>
                  </div>
                </form>
                {apiError && (
                  <div className="error-message">
                    <p className="error-font">{apiError}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="popup-overlay">
          <div className="popup-container" style={{ maxWidth: "400px" }}>
            {deleting ? (
              <div className="loading-container">
                <ClipLoader color="#ef4444" size={40} />
                <p className="loading-text">Deleting ingredient...</p>
              </div>
            ) : (
              <>
                <div className="popup-header">
                  <h2 className="popup-title">Confirm Delete</h2>
                  <button
                    className="close-button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteIngredientId(null);
                      setDeleteIngredientName("");
                    }}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div style={{ padding: "16px", textAlign: "center" }}>
                  <p style={{ marginBottom: "24px" }}>
                    Are you sure you want to delete{" "}
                    <strong>{deleteIngredientName}</strong>? This action cannot
                    be undone.
                  </p>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteIngredientId(null);
                        setDeleteIngredientName("");
                      }}
                      style={{
                        background: "#e5e7eb",
                        color: "#374151",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteIngredient}
                      style={{
                        background: "#ef4444",
                        color: "white",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
