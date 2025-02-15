// import express from "express";
// import dotenv from "dotenv";
// import fetch from "node-fetch";

// dotenv.config(); // Load environment variables from .env

// const router = express.Router();

// router.post("/generate-meal-plan", async (req, res) => {
//   try {
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // Use the API key from .env
//         "HTTP-Referer": "http://localhost:3000",
//         "X-Title": "NutriFit",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "deepseek/deepseek-chat:free",
//         messages: [
//           {
//             role: "user",
//             content: `Generate a 7-day meal plan in JSON format. The plan should include meals for breakfast, lunch, and dinner each day. Each meal should have a name, description, calories, protein, carbs, fats, and time. The JSON structure should match this format:
//             {
//               "meal_plan": {
//                 "name": "7-Day Meal Plan",
//                 "description": "A balanced meal plan for a week."
//               },
//               "meals": [
//                 {
//                   "name": "Meal Name",
//                   "description": "Meal Description",
//                   "calories": 500,
//                   "protein": 30,
//                   "carbs": 50,
//                   "fats": 20,
//                   "time": "08:00",
//                   "day_number": 1
//                 }
//               ]
//             }`,
//           },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     const generatedPlan = JSON.parse(data.choices[0].message.content); // Parse the AI response
//     res.status(200).json(generatedPlan); // Send the generated plan back to the frontend
//   } catch (error) {
//     console.error("Error generating meal plan:", error);
//     res.status(500).json({ error: "Failed to generate meal plan" });
//   }
// });

// export default router;