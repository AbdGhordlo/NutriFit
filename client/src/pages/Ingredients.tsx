import React, { useState } from "react";
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
} from "lucide-react";
// import spicesIcon from '../assets/svgs/spices.svg'; //FIX: I think this isn't working because of TS.
import { styles } from "./styles/IngredientsStyles";
import { commonStyles } from "./styles/commonStyles";
import "./Ingredients.css";

interface Ingredient {
  id: number;
  name: string;
  category: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  inStock: boolean;
}

//The following svg should be imported instead!!
const SpicesIcon = () => (
  <svg
    fill="#4d7051"
    height="24px"
    width="24px"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 460.845 460.845"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    enableBackground="new 0 0 460.845 460.845"
  >
    <g>
      <path d="m230.423,0c-41.633,0-80.909,5.202-110.594,14.649-42.583,13.55-51.521,31.274-51.521,43.757v344.033c0,12.482 8.938,30.207 51.521,43.757 29.685,9.446 68.961,14.648 110.594,14.648s80.909-5.202 110.594-14.648c42.582-13.551 51.521-31.275 51.521-43.757v-344.033c-0.001-38.344-81.555-58.406-162.115-58.406zm-104.529,33.707c27.776-8.839 64.899-13.707 104.529-13.707s76.752,4.868 104.528,13.707c25.964,8.262 37.586,18.358 37.586,24.699 0,6.341-11.622,16.437-37.586,24.699-27.776,8.839-64.898,13.707-104.528,13.707s-76.753-4.868-104.529-13.707c-25.964-8.262-37.586-18.358-37.586-24.699 0-6.341 11.622-16.437 37.586-24.699zm209.058,393.431c-27.776,8.839-64.899,13.707-104.529,13.707s-76.753-4.868-104.529-13.707c-25.964-8.262-37.586-18.358-37.586-24.699v-254.153c29.113,18.964 85.852,28.752 142.115,28.752 41.633,0 80.909-5.202 110.594-14.648 13.737-4.372 23.957-9.178 31.521-14.103v254.151c-0.001,6.342-11.623,16.437-37.586,24.7zm-.001-283.806c-27.775,8.839-64.898,13.707-104.528,13.707s-76.753-4.868-104.529-13.707c-25.964-8.262-37.586-18.358-37.586-24.699v-30.574c29.113,18.965 85.852,28.753 142.115,28.753 41.633,0 80.909-5.202 110.594-14.649 13.737-4.372 23.957-9.178 31.521-14.103v30.572c-0.001,6.342-11.623,16.437-37.587,24.7z" />
      <path d="m173.019,251.373c-5.466-0.726-10.506,3.11-11.238,8.584-0.733,5.474 3.109,10.505 8.584,11.239 19.02,2.547 39.226,3.838 60.058,3.838 20.839,0 41.048-1.292 60.067-3.838 5.475-0.733 9.317-5.765 8.584-11.239-0.733-5.475-5.769-9.316-11.238-8.584-18.143,2.43-37.459,3.662-57.413,3.662-19.948,0-39.262-1.232-57.404-3.662z" />
      <path d="m287.835,291.675c-18.143,2.43-37.459,3.662-57.413,3.662-19.947,0-39.261-1.232-57.403-3.662-5.466-0.727-10.506,3.11-11.238,8.584-0.733,5.474 3.109,10.505 8.584,11.239 19.02,2.547 39.226,3.838 60.058,3.838 20.839,0 41.048-1.292 60.067-3.838 5.475-0.733 9.317-5.765 8.584-11.239-0.734-5.474-5.769-9.315-11.239-8.584z" />
      <path d="m332.54,203.404c-2.449-1.894-5.639-2.547-8.632-1.769-26.188,6.802-59.39,10.549-93.486,10.549s-67.298-3.747-93.486-10.549c-2.99-0.778-6.183-0.125-8.632,1.769-2.448,1.894-3.882,4.815-3.882,7.91v157.84c0,4.555 3.078,8.534 7.486,9.679 28.188,7.321 62.253,11.191 98.514,11.191s70.326-3.87 98.514-11.191c4.408-1.145 7.486-5.124 7.486-9.679v-157.84c0-3.095-1.434-6.016-3.882-7.91zm-16.118,157.89c-24.889,5.649-55.076,8.73-86,8.73s-61.111-3.082-86-8.73v-137.357c25.516,5.411 54.952,8.248 86,8.248s60.484-2.837 86-8.248v137.357z" />
    </g>
  </svg>
);

const categories: {
  [key: string]: {
    icon: React.ComponentType<any> | string; // Allow both Lucide icons and image paths
  };
} = {
  "Vegetables": { icon: Carrot },
  "Fruits": { icon: Apple },
  "Meat & Poultry": { icon: Beef },
  "Dairy & Eggs": { icon: Milk },
  "Grains & Cereals": { icon: Wheat },
  "Legumes, Nuts & Seeds": { icon: Bean },
  "Seafood": { icon: Fish },
  "Fats & Oils": { icon: Oil },
  "Spices, Herbs & Condiments": { icon: SpicesIcon },
  "Other": { icon: UtensilsCrossed },
};

//Temporary. These will of course be stored in the DB
const ingredients: Ingredient[] = [
  {
    id: 1,
    name: "Chicken Breast",
    category: "Meat & Poultry",
    servingSize: "100g",
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    inStock: false,
  },
  {
    id: 2,
    name: "Carrot",
    category: "Vegetables",
    servingSize: "100g",
    calories: 41,
    protein: 0.9,
    carbs: 9.6,
    fats: 0.2,
    inStock: true,
  },
  {
    id: 3,
    name: "Apple",
    category: "Fruits",
    servingSize: "100g",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fats: 0.2,
    inStock: true,
  },
  {
    id: 4,
    name: "Milk",
    category: "Dairy & Eggs",
    servingSize: "1 cup (244ml)",
    calories: 103,
    protein: 8,
    carbs: 12,
    fats: 2.4,
    inStock: true,
  },
  {
    id: 5,
    name: "Brown Rice",
    category: "Grains & Cereals",
    servingSize: "100g",
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fats: 0.9,
    inStock: true,
  },
  {
    id: 6,
    name: "Lentils",
    category: "Legumes, Nuts & Seeds",
    servingSize: "100g",
    calories: 116,
    protein: 9,
    carbs: 20,
    fats: 0.4,
    inStock: true,
  },
  {
    id: 7,
    name: "Salmon",
    category: "Seafood",
    servingSize: "100g",
    calories: 208,
    protein: 20,
    carbs: 0,
    fats: 13,
    inStock: true,
  },
  {
    id: 8,
    name: "Olive Oil",
    category: "Fats & Oils",
    servingSize: "1 tbsp (13.5g)",
    calories: 119,
    protein: 0,
    carbs: 0,
    fats: 13.5,
    inStock: true,
  },
  {
    id: 9,
    name: "Black Pepper",
    category: "Spices, Herbs & Condiments",
    servingSize: "1 tsp (2.3g)",
    calories: 6,
    protein: 0.2,
    carbs: 1.5,
    fats: 0.1,
    inStock: true,
  },
  {
    id: 10,
    name: "red Pepper",
    category: "Spices, Herbs & Condiments",
    servingSize: "1 tsp (2.3g)",
    calories: 6,
    protein: 0.2,
    carbs: 1.5,
    fats: 0.1,
    inStock: true,
  },
  {
    id: 11,
    name: "pink Pepper",
    category: "Spices, Herbs & Condiments",
    servingSize: "1 tsp (2.3g)",
    calories: 6,
    protein: 0.2,
    carbs: 1.5,
    fats: 0.1,
    inStock: true,
  },
];

export default function Ingredients() {
  const [ingredientsList, setIngredientsList] =
    useState<Ingredient[]>(ingredients);
  const [isHoveredAdd, setIsHoveredAdd] = useState(false);
  const [hoveredStock, setHoveredStock] = useState<number>();

  const toggleStock = (id: number) => {
    setIngredientsList((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id
          ? { ...ingredient, inStock: !ingredient.inStock }
          : ingredient
      )
    );
  };

  return (
    <div style={commonStyles.container}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Ingredients</h1>
          <button
            style={{
              ...styles.addButton,
              backgroundColor: isHoveredAdd ? "#6db776" : "#7ec987",
            }}
            onMouseEnter={() => setIsHoveredAdd(true)}
            onMouseLeave={() => setIsHoveredAdd(false)}
          >
            <Plus style={{ width: 20, height: 20 }} />
            <span>Add Ingredient</span>
          </button>
        </div>

        <div style={styles.categoriesGrid}>
          {/* notice that with this, if there's a category that doesn't have an ingredient, it's not printed. Clean!*/}
          {Object.entries(categories).map(([category, { icon: Icon }]) =>
            ingredientsList.some(
              (ingredient) => ingredient.category === category
            ) ? (
              <div key={category} style={styles.categoryContainer}>
                <div style={styles.categoryHeader}>
                  <Icon style={styles.categoryIcon} />
                  <h2 style={styles.categoryTitle}>{category}</h2>
                </div>

                <div className="table-container">
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
                      </tr>
                    </thead>
                    <tbody>
                      {ingredientsList.map((ingredient) =>
                        ingredient.category === category ? (
                          <tr key={ingredient.id} style={styles.tableRow}>
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
                            <td style={styles.tableCell}>
                              {ingredient.carbs}g
                            </td>
                            <td style={styles.tableCell}>{ingredient.fats}g</td>
                            <td style={styles.tableCell}>
                              <button
                                onClick={() => toggleStock(ingredient.id)}
                                style={{
                                  ...styles.stockButton(ingredient.inStock),
                                  backgroundColor: ingredient.inStock
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
                                onMouseLeave={() => setHoveredStock(-1)}
                              >
                                {ingredient.inStock
                                  ? "In Stock"
                                  : "Out of Stock"}
                              </button>
                            </td>
                          </tr>
                        ) : null
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
