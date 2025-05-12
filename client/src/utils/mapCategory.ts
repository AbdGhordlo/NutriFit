export const mapCategory = (apiCategory: string): string => {
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
    Drink: "Other Drinks",
    Beverage: "Other Drinks",
    Tea: "Other Drinks", // isteğe bağlı
    Juice: "Other Drinks", // isteğe bağlı
  };

  for (const key in mappings) {
    if (apiCategory.toLowerCase().includes(key.toLowerCase())) {
      return mappings[key];
    }
  }

  return "Other";
};
