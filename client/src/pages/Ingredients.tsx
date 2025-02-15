import React, { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { ClipLoader } from "react-spinners";
import "../pages/Ingredients.css";
import "../assets/commonStyles.css";

interface Ingredient {
  id: number;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  inStock: boolean;
}

interface Category {
  name: string;
  ingredients: Ingredient[];
}

export default function Ingredients() {
  const [ingredients, setIngredients] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState(0);

  useEffect(() => {
    const fetchIngredients = async () => {
      const userId = 1; // Replace with the logged-in user's ID
      const token = localStorage.getItem("token"); // Retrieve JWT from local storage

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login"; // Redirect if no token is found
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/ingredients/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          console.error("Unauthorized, removing token and redirecting...");
          localStorage.removeItem("token"); // Remove expired/invalid token
          window.location.href = "/login"; // Redirect to login page
          return;
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("result:" , data); // Log the API response

        // Group ingredients by category
        const groupedData = data.reduce((acc: any, ingredient: any) => {
          const category = ingredient.category;
          if (!acc[category]) {
            acc[category] = { name: category, ingredients: [] };
          }
          acc[category].ingredients.push({
            id: ingredient.id,
            name: ingredient.name,
            category: ingredient.category,
            calories: ingredient.calories,
            protein: ingredient.protein,
            carbs: ingredient.carbs,
            fats: ingredient.fats,
            inStock: ingredient.inStock,
          });
          return acc;
        }, []);

        setIngredients(Object.values(groupedData));
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchIngredients();
  }, []);

  const handlePrevCategory = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    }
  };

  const handleNextCategory = () => {
    if (currentCategory < ingredients.length - 1) {
      setCurrentCategory(currentCategory + 1);
    }
  };

  const toggleStock = async (ingredientId: number) => {
    const userId = 1; // Replace with the logged-in user's ID
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/ingredients/${userId}/${ingredientId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inStock: !ingredients[currentCategory].ingredients.find(ing => ing.id === ingredientId)?.inStock }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const updatedIngredient = await response.json();
      setIngredients((prev) =>
        prev.map((category) => ({
          ...category,
          ingredients: category.ingredients.map((ing) =>
            ing.id === ingredientId ? { ...ing, inStock: updatedIngredient.inStock } : ing
          ),
        }))
      );
    } catch (error) {
      console.error("Error toggling stock:", error);
    }
  };

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
        <ClipLoader color="#7ec987" size={50} /> {/* Display the spinner */}
      </div>
    );
  }

  if (ingredients.length === 0) {
    return <div>No ingredients found.</div>;
  }

  return (
    <div className="outer-container">
      <div className="main-container">
        <h1 className="title">My Ingredients</h1>

        <div className="category-container">
          <div className="category-header">
            <h2 className="category-name">
              {ingredients[currentCategory].name}
            </h2>
          </div>

          <div className="items-list">
            {ingredients[currentCategory].ingredients.map((ingredient) => (
              <div key={ingredient.id} className="list-item">
                <div className="item-info">
                  <h3 className="item-name">{ingredient.name}</h3>
                  <div className="item-macros">
                    <span>{ingredient.calories} kcal</span>
                    <span>•</span>
                    <span>{ingredient.protein}g protein</span>
                    <span>•</span>
                    <span>{ingredient.carbs}g carbs</span>
                    <span>•</span>
                    <span>{ingredient.fats}g fats</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleStock(ingredient.id)}
                  className={`stock-button ${ingredient.inStock ? "in-stock" : "out-of-stock"}`}
                >
                  {ingredient.inStock ? "In Stock" : "Out of Stock"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="navigation-container">
          <button
            onClick={handlePrevCategory}
            disabled={currentCategory === 0}
            className={`nav-button ${currentCategory === 0 ? "disabled" : ""}`}
          >
            <ChevronLeft className="nav-icon" />
          </button>

          <button
            onClick={handleNextCategory}
            disabled={currentCategory === ingredients.length - 1}
            className={`nav-button ${currentCategory === ingredients.length - 1 ? "disabled" : ""}`}
          >
            <ChevronRight className="nav-icon" />
          </button>
        </div>
      </div>

      <div className="buttons-container">
        <button className="add-button">
          <Plus className="button-icon" />
          <span>Add Ingredient</span>
        </button>
      </div>
    </div>
  );
}