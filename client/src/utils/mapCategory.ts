const mappings: { [key: string]: string } = {
  "Meat/Poultry": "Meat & Poultry",
  Dairy: "Dairy & Eggs",
  Eggs: "Dairy & Eggs",
  Grains: "Grains & Cereals",
  Vegetables: "Vegetables",
  Fruits: "Fruits",
  Legumes: "Legumes, Nuts & Seeds",
  Nuts: "Legumes, Nuts & Seeds",
  Seeds: "Legumes, Nuts & Seeds",
  Fish: "Seafood",
  Fats: "Fats & Oils",
  Oils: "Fats & Oils",
  "Condiments and sauces": "Spices, Herbs & Condiments",
  "Spices and Herbs": "Spices, Herbs & Condiments",
  Spices: "Spices, Herbs & Condiments",
  Herbs: "Spices, Herbs & Condiments",
  Seasoning: "Spices, Herbs & Condiments",
  Drink: "Drinks",
  Beverage: "Drinks",
  Tea: "Drinks",
  Juice: "Drinks",
};

export const mapCategory = (apiCategory: string): string => {
  for (const key in mappings) {
    if (apiCategory.toLowerCase().includes(key.toLowerCase())) {
      return mappings[key];
    }
  }
  return "Other";
};

export const mappedCategories = Array.from(new Set(Object.values(mappings)));
export const mappedCategoriesWithOther = [
  ...mappedCategories,
  "Other",
];