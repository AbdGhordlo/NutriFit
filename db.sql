-- User Table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal Plan Table
CREATE TABLE meal_plan (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal Plan Meal Table
CREATE TABLE meal_plan_meal (
    id SERIAL PRIMARY KEY,
    meal_plan_id INT REFERENCES meal_plan(id) ON DELETE CASCADE,
    meal_id INT REFERENCES meal(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    day_number INT NOT NULL DEFAULT 1,
    meal_order INT NOT NULL DEFAULT 1,
);

-- Meal Table
CREATE TABLE meal (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    calories INT,
    protein INT,
    carbs INT,
    fats INT,
    time TIME NOT NULL DEFAULT '08:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise Plan Table
CREATE TABLE exercise_plan (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise Plan Exercise Table
CREATE TABLE exercise_plan_exercise (
    id SERIAL PRIMARY KEY,
    exercise_plan_id INT REFERENCES exercise_plan(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercise(id) ON DELETE CASCADE,
    reps INT,
    sets INT,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (exercise_plan_id, exercise_id) -- Prevent duplicate entries
);

-- Exercise Table
CREATE TABLE exercise (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    calories_burned INT,
    has_reps_sets BOOLEAN DEFAULT FALSE,
    has_duration BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Ingredients Table
CREATE TABLE user_ingredients (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    in_stock BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Ingredient Ingredient Table
CREATE TABLE user_ingredient_ingredient (
    id SERIAL PRIMARY KEY,
    user_ingredients_id INT REFERENCES user_ingredients(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredient(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_ingredients_id, ingredient_id) -- Prevent duplicate entries
);

-- Ingredient Table
CREATE TABLE ingredient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    calories INT,
    protein INT,
    carbs INT,
    fats INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Notification Table
CREATE TABLE user_notification (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    notification_id INT REFERENCES notification(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, notification_id) -- Prevent duplicate notifications
);

-- Notification Table
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    weight_goal INT,
    calorie_target INT,
    dark_mode BOOLEAN DEFAULT FALSE,
    meal_reminders BOOLEAN DEFAULT TRUE,
    exercise_reminders BOOLEAN DEFAULT TRUE,
    progress_updates BOOLEAN DEFAULT TRUE,
    water_intake_reminder BOOLEAN DEFAULT TRUE,
    language VARCHAR(50) DEFAULT 'English',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Data

INSERT INTO meal_plan (user_id, name, description)
VALUES (1, '7-Day Healthy Meal Plan', 'A balanced 7-day meal plan focusing on protein and nutrient-rich foods.');

INSERT INTO meal (name, description, calories, protein, carbs, fats, time)
VALUES 
('Scrambled Eggs with Avocado Toast', 'A protein-packed breakfast with healthy fats.', 400, 20, 30, 18, '08:00'),
('Grilled Chicken Salad', 'Grilled chicken breast with fresh greens and vinaigrette.', 450, 35, 20, 12, '12:00'),
('Salmon with Quinoa', 'Grilled salmon with lemon and a side of quinoa.', 500, 40, 30, 18, '19:00'),
('Greek Yogurt with Berries', 'Greek yogurt topped with mixed berries and honey.', 300, 25, 35, 5, '08:00'),
('Oatmeal with Almond Butter', 'Oatmeal with almond butter and banana slices.', 350, 15, 45, 12, '12:00'),
('Beef Stir-Fry with Brown Rice', 'Lean beef with mixed vegetables served over brown rice.', 550, 45, 50, 15, '19:00'),
('Tuna Sandwich on Whole Grain', 'Tuna with lettuce and tomato on whole grain bread.', 400, 35, 40, 10, '08:00'),
('Vegetable Soup with Lentils', 'A hearty vegetable and lentil soup.', 380, 25, 50, 8, '12:00'),
('Chicken Breast with Sweet Potato', 'Oven-baked chicken breast with mashed sweet potato.', 480, 40, 45, 8, '19:00'),
('Egg Omelet with Spinach', 'Three-egg omelet with spinach and feta cheese.', 370, 30, 20, 15, '08:00');

-- Day 1
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order) VALUES 
(1, 1, 1, 1), -- Breakfast: Scrambled Eggs
(1, 2, 1, 2), -- Lunch: Grilled Chicken Salad
(1, 3, 1, 3); -- Dinner: Salmon with Quinoa

-- Day 2
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order) VALUES 
(1, 4, 2, 1), -- Breakfast: Greek Yogurt
(1, 5, 2, 2), -- Lunch: Oatmeal with Almond Butter
(1, 6, 2, 3); -- Dinner: Beef Stir-Fry

-- Day 3
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order) VALUES 
(1, 7, 3, 1), -- Breakfast: Tuna Sandwich
(1, 8, 3, 2), -- Lunch: Vegetable Soup
(1, 9, 3, 3); -- Dinner: Chicken Breast with Sweet Potato

-- Day 4
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order) VALUES 
(1, 10, 4, 1), -- Breakfast: Egg Omelet
(1, 1, 4, 2), -- Lunch: Scrambled Eggs with Avocado Toast
(1, 2, 4, 3); -- Dinner: Grilled Chicken Salad

-- Day 5
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order) VALUES 
(1, 3, 5, 1), -- Breakfast: Salmon with Quinoa
(1, 4, 5, 2), -- Lunch: Greek Yogurt with Berries
(1, 5, 5, 3); -- Dinner: Oatmeal with Almond Butter

-- Day 6
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order) VALUES 
(1, 6, 6, 1), -- Breakfast: Beef Stir-Fry with Brown Rice
(1, 7, 6, 2), -- Lunch: Tuna Sandwich
(1, 8, 6, 3); -- Dinner: Vegetable Soup with Lentils

-- Day 7
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order) VALUES 
(1, 9, 7, 1), -- Breakfast: Chicken Breast with Sweet Potato
(1, 10, 7, 2), -- Lunch: Egg Omelet with Spinach
(1, 1, 7, 3); -- Dinner: Scrambled Eggs with Avocado Toast

