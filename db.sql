-- User Table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255),
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- Meal Plan Table
CREATE TABLE meal_plan (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_adopted_plan BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise Plan Table
CREATE TABLE exercise_plan (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_adopted_plan BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE ingredient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    calories INT,
    protein NUMERIC,
    carbs NUMERIC,
    fats NUMERIC,
    serving_size TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Notification Table
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal Plan Meal Table
CREATE TABLE meal_plan_meal (
    id SERIAL PRIMARY KEY,
    meal_plan_id INT REFERENCES meal_plan(id) ON DELETE CASCADE,
    meal_id INT REFERENCES meal(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    day_number INT NOT NULL DEFAULT 1,
    meal_order INT NOT NULL DEFAULT 1,
    time TIME NOT NULL DEFAULT '08:00'
);

-- Exercise Plan Exercise Table
CREATE TABLE exercise_plan_exercise (
    id SERIAL PRIMARY KEY,
    exercise_plan_id INT REFERENCES exercise_plan(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercise(id) ON DELETE CASCADE,
    reps INT,
    sets INT,
    time TIME,
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    day_number INT NOT NULL DEFAULT 1,
    exercise_order INT NOT NULL DEFAULT 1
);

CREATE TABLE user_ingredients (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredient(id) ON DELETE CASCADE,
    in_stock BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- User Ingredient Ingredient Table
-- CREATE TABLE user_ingredient_ingredient (
--     id SERIAL PRIMARY KEY,
--     user_ingredients_id INT REFERENCES user_ingredients(id) ON DELETE CASCADE,
--     ingredient_id INT REFERENCES ingredient(id) ON DELETE CASCADE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE (user_ingredients_id, ingredient_id)
-- );

-- User Notification Table
CREATE TABLE user_notification (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    notification_id INT REFERENCES notification(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, notification_id)
);

-- Settings Table
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    meal_reminders BOOLEAN DEFAULT TRUE,
    exercise_reminders BOOLEAN DEFAULT TRUE,
    progress_updates BOOLEAN DEFAULT TRUE,
    water_intake_reminder BOOLEAN DEFAULT TRUE,
    profile_picture VARCHAR(255),
    personalize_steps JSONB,
    personalize_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id)
);

-- Personalization Table
CREATE TABLE personalization (
    personalization_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    steps_data JSONB,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id)
);

CREATE TABLE user_favorite_meals (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    meal_id INT REFERENCES meal(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, meal_id) -- Ensure a user can't favorite the same meal multiple times
);

-- User Favorite Exercises Table
CREATE TABLE user_favorite_exercises (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercise(id) ON DELETE CASCADE,
    reps INT,
    sets INT,
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, exercise_id) -- Ensure a user can't favorite the same exercise multiple times
);

-- Data

-- Insert Meal Plan
INSERT INTO meal_plan (user_id, name, description)
VALUES (1, '7-Day Healthy Meal Plan', 'A balanced 7-day meal plan focusing on protein and nutrient-rich foods.');

-- Insert Meals
INSERT INTO meal (name, description, calories, protein, carbs, fats)
VALUES 
('Scrambled Eggs with Avocado Toast', 'A protein-packed breakfast with healthy fats.', 400, 20, 30, 18),
('Grilled Chicken Salad', 'Grilled chicken breast with fresh greens and vinaigrette.', 450, 35, 20, 12),
('Salmon with Quinoa', 'Grilled salmon with lemon and a side of quinoa.', 500, 40, 30, 18),
('Greek Yogurt with Berries', 'Greek yogurt topped with mixed berries and honey.', 300, 25, 35, 5),
('Oatmeal with Almond Butter', 'Oatmeal with almond butter and banana slices.', 350, 15, 45, 12),
('Beef Stir-Fry with Brown Rice', 'Lean beef with mixed vegetables served over brown rice.', 550, 45, 50, 15),
('Tuna Sandwich on Whole Grain', 'Tuna with lettuce and tomato on whole grain bread.', 400, 35, 40, 10),
('Vegetable Soup with Lentils', 'A hearty vegetable and lentil soup.', 380, 25, 50, 8),
('Chicken Breast with Sweet Potato', 'Oven-baked chicken breast with mashed sweet potato.', 480, 40, 45, 8),
('Egg Omelet with Spinach', 'Three-egg omelet with spinach and feta cheese.', 370, 30, 20, 15),
('Protein Shake', 'Whey protein shake with almond milk.', 250, 30, 10, 5),
('Fruit & Nuts', 'Mixed nuts with apple slices.', 300, 10, 40, 15),
('Cottage Cheese with Pineapple', 'Low-fat cottage cheese with fresh pineapple chunks.', 350, 30, 35, 5);

-- Day 1
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES 
(1, 1, 1, 1, '08:00'), -- Breakfast
(1, 11, 1, 2, '10:30'), -- Snack: Protein Shake
(1, 2, 1, 3, '13:00'), -- Lunch
(1, 12, 1, 4, '16:00'), -- Snack: Fruit & Nuts
(1, 3, 1, 5, '19:30'), -- Dinner
(1, 12, 1, 6, '20:00'); -- Snack: Fruit & Nuts

-- Day 2
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES 
(1, 4, 2, 1, '07:45'), -- Breakfast
(1, 5, 2, 2, '12:00'), -- Lunch
(1, 6, 2, 3, '18:30'), -- Dinner
(1, 13, 2, 4, '21:00'); -- Snack: Cottage Cheese with Pineapple

-- Day 3
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES 
(1, 7, 3, 1, '08:15'), -- Breakfast
(1, 8, 3, 2, '12:45'), -- Lunch
(1, 9, 3, 3, '18:00'), -- Dinner
(1, 4, 3, 4, '20:30'); -- Snack: Greek Yogurt with Berries

-- Day 4
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES 
(1, 10, 4, 1, '08:30'), -- Breakfast
(1, 1, 4, 2, '12:15'), -- Lunch
(1, 2, 4, 3, '19:00'), -- Dinner
(1, 12, 4, 4, '21:30'); -- Snack: Fruit & Nuts

-- Day 5
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES 
(1, 3, 5, 1, '09:00'), -- Breakfast
(1, 4, 5, 2, '13:00'), -- Lunch
(1, 5, 5, 3, '17:30'), -- Snack: Oatmeal with Almond Butter
(1, 6, 5, 4, '20:00'); -- Dinner

-- Day 6
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES 
(1, 6, 6, 1, '08:00'), -- Breakfast
(1, 7, 6, 2, '12:30'), -- Lunch
(1, 8, 6, 3, '15:30'), -- Snack: Vegetable Soup with Lentils
(1, 9, 6, 4, '19:00'); -- Dinner

-- Day 7
INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES 
(1, 9, 7, 1, '07:45'), -- Breakfast
(1, 10, 7, 2, '11:30'), -- Snack: Egg Omelet with Spinach
(1, 11, 7, 3, '14:00'), -- Lunch: Protein Shake
(1, 12, 7, 4, '17:00'), -- Snack: Fruit & Nuts
(1, 13, 7, 5, '20:00'); -- Dinner: Cottage Cheese with Pineapple

-- Insert Exercise Plan
INSERT INTO exercise_plan (user_id, name, description)
VALUES 
(1, '7-Day Fitness Plan', 'A balanced 7-day exercise plan focusing on strength and cardio.');

-- Insert Exercises
INSERT INTO exercise (name, description, calories_burned, has_reps_sets, has_duration)
VALUES 
('Push-ups', 'Bodyweight exercise targeting chest, shoulders, and triceps.', 100, TRUE, FALSE),
('Squats', 'Bodyweight exercise targeting legs and glutes.', 150, TRUE, FALSE),
('Plank', 'Core strengthening exercise.', 50, FALSE, TRUE),
('Running', 'Cardio exercise to improve endurance.', 300, FALSE, TRUE),
('Pull-ups', 'Bodyweight exercise targeting back and biceps.', 120, TRUE, FALSE),
('Burpees', 'Full-body exercise combining strength and cardio.', 200, TRUE, FALSE),
('Jumping Jacks', 'Cardio exercise to improve heart rate.', 100, FALSE, TRUE),
('Lunges', 'Bodyweight exercise targeting legs and glutes.', 120, TRUE, FALSE),
('Mountain Climbers', 'Core and cardio exercise.', 150, FALSE, TRUE),
('Bicycle Crunches', 'Core exercise targeting abs.', 80, TRUE, FALSE);

-- Day 1
    INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, exercise_order, time, reps, sets, duration)
    VALUES 
    (1, 1, 1, 1, '08:00', 15, 3, NULL), -- Push-ups
    (1, 2, 1, 2, '08:30', 20, 3, NULL), -- Squats
    (1, 3, 1, 3, '09:00', NULL, NULL, '1 minute'), -- Plank
    (1, 4, 1, 4, '18:00', NULL, NULL, '30 minutes'); -- Running

    -- Day 2
    INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, exercise_order, time, reps, sets, duration)
    VALUES 
    (1, 5, 2, 1, '08:00', 10, 3, NULL), -- Pull-ups
    (1, 6, 2, 2, '08:30', 12, 3, NULL), -- Burpees
    (1, 7, 2, 3, '09:00', NULL, NULL, '5 minutes'), -- Jumping Jacks
    (1, 8, 2, 4, '18:00', 15, 3, NULL); -- Lunges

    -- Day 3
    INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, exercise_order, time, reps, sets, duration)
    VALUES 
    (1, 9, 3, 1, '08:00', NULL, NULL, '2 minutes'), -- Mountain Climbers
    (1, 10, 3, 2, '08:30', 20, 3, NULL), -- Bicycle Crunches
    (1, 1, 3, 3, '09:00', 15, 3, NULL), -- Push-ups
    (1, 2, 3, 4, '18:00', 20, 3, NULL); -- Squats

    -- Day 4
    INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, exercise_order, time, reps, sets, duration)
    VALUES 
    (1, 3, 4, 1, '08:00', NULL, NULL, '45 seconds'), -- Plank
    (1, 4, 4, 2, '08:30', NULL, NULL, '25 minutes'), -- Running
    (1, 5, 4, 3, '09:00', 10, 3, NULL), -- Pull-ups
    (1, 6, 4, 4, '18:00', 12, 3, NULL); -- Burpees

    -- Day 5
    INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, exercise_order, time, reps, sets, duration)
    VALUES 
    (1, 7, 5, 1, '08:00', NULL, NULL, '3 minutes'), -- Jumping Jacks
    (1, 8, 5, 2, '08:30', 15, 3, NULL), -- Lunges
    (1, 9, 5, 3, '09:00', NULL, NULL, '2 minutes'), -- Mountain Climbers
    (1, 10, 5, 4, '18:00', 20, 3, NULL); -- Bicycle Crunches

    -- Day 6
    INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, exercise_order, time, reps, sets, duration)
    VALUES 
    (1, 1, 6, 1, '08:00', 15, 3, NULL), -- Push-ups
    (1, 2, 6, 2, '08:30', 20, 3, NULL), -- Squats
    (1, 3, 6, 3, '09:00', NULL, NULL, '1 minute'), -- Plank
    (1, 4, 6, 4, '18:00', NULL, NULL, '30 minutes'); -- Running

    -- Day 7
    INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, exercise_order, time, reps, sets, duration)
    VALUES 
    (1, 5, 7, 1, '08:00', 10, 3, NULL), -- Pull-ups
    (1, 6, 7, 2, '08:30', 12, 3, NULL), -- Burpees
    (1, 7, 7, 3, '09:00', NULL, NULL, '5 minutes'), -- Jumping Jacks
    (1, 8, 7, 4, '18:00', 15, 3, NULL); -- Lunges

-- -- Insert default settings for test user
-- INSERT INTO settings (
--   user_id, 
--   meal_reminders, 
--   exercise_reminders, 
--   progress_updates, 
--   water_intake_reminder,
--   profile_picture, 
--   personalize_completed
-- )
-- VALUES (
--   1, -- Replace with a valid user ID when testing
--   TRUE, 
--   TRUE, 
--   TRUE, 
--   TRUE, 
--   NULL,
--   FALSE
-- )
-- ON CONFLICT (user_id) 
-- DO NOTHING; -- Skip if the user already has settings

-- --Insert Ingredients
-- INSERT INTO ingredient (name, category, calories, protein, carbs, fats)
-- VALUES 
--   ('Spinach', 'Vegetables', 23, 2.9, 3.6, 0.4),
--   ('Chicken Breast', 'Meat & Poultry', 165, 31, 0, 3.6),
--   ('Brown Rice', 'Grains & Cereals', 111, 2.6, 23, 0.9);

-- INSERT INTO ingredient (name, category, calories, protein, carbs, fats)
-- VALUES ('Salmon', 'Seafood', 208, 20, 0, 13)
-- RETURNING id;

-- -- Ardından kullanıcıya bu malzemeyi ekleyin
-- INSERT INTO user_ingredients (user_id)
-- VALUES (1)
-- RETURNING id;

-- -- Son olarak ilişkiyi ekleyin
-- INSERT INTO user_ingredient_ingredient (user_ingredients_id, ingredient_id)
-- VALUES (1, 2);

-- WITH duplicates AS (
--   SELECT
--     	id,
--     ROW_NUMBER() OVER (
--       PARTITION BY name
--       ORDER BY id
--     ) AS rn
--   FROM ingredient
-- )
-- DELETE FROM ingredient
-- WHERE id IN (
--   SELECT id FROM duplicates WHERE rn > 1
-- );

-- ALTER TABLE ingredient
-- ADD CONSTRAINT unique_ingredient_name UNIQUE (name);

-- -- protein, carbs and fats changed to NUMERIC instead of integers
-- ALTER TABLE ingredients
-- ALTER COLUMN protein TYPE NUMERIC USING protein::NUMERIC,
-- ALTER COLUMN carbs TYPE NUMERIC USING carbs::NUMERIC,
-- ALTER COLUMN fats TYPE NUMERIC USING fats::NUMERIC;
-- ALTER TABLE ingredient
-- ADD COLUMN serving_size TEXT;


-- ---
-- ALTER TABLE user_ingredients
-- ADD COLUMN ingredient_id INTEGER;

-- ALTER TABLE user_ingredients
-- ADD CONSTRAINT fk_ingredient
-- FOREIGN KEY (ingredient_id)
-- REFERENCES ingredient(id)
-- ON DELETE CASCADE;

-- ALTER TABLE user_ingredient_ingredient RENAME TO _user_ingredient_ingredient_backup;
