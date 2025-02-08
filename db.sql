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

-- Meal Plan Meal Table
CREATE TABLE meal_plan_meal (
    id SERIAL PRIMARY KEY,
    meal_plan_id INT REFERENCES meal_plan(id) ON DELETE CASCADE,
    meal_id INT REFERENCES meal(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (meal_plan_id, meal_id) -- Prevent duplicate entries
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

-- Notification Table
CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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