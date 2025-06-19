-- User Table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255),
    profile_picture TEXT,
    is_first_login BOOLEAN DEFAULT TRUE,

    -- password-reset support
    reset_token   VARCHAR(64),
    reset_expires BIGINT,

    -- email verification support
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_code VARCHAR(64),
    email_verification_expires BIGINT,

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

CREATE TABLE meal_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_plan_meal_id INT REFERENCES meal_plan_meal(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, meal_plan_meal_id)
);

CREATE TABLE exercise_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  exercise_plan_exercise_id INT REFERENCES exercise_plan_exercise(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, exercise_plan_exercise_id)
);

CREATE TABLE progress_photo (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL
                REFERENCES "user"(id)
                ON DELETE CASCADE,
  file_path   TEXT    NOT NULL,
  file_name   TEXT    NOT NULL,
  file_type   TEXT    NOT NULL, 
  uploaded_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
  completed_days_count INT DEFAULT 0,
  penalty_days_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE body_measurements (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
  measurement_type VARCHAR(20) NOT NULL, -- e.g. 'weight', 'height', 'bmi'
  value NUMERIC NOT NULL,
  unit VARCHAR(20),                      -- e.g. 'kg', 'cm', 'm²'
  measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    meal_plan_meal_id INT REFERENCES meal_plan_meal(id) ON DELETE CASCADE,
    exercise_plan_exercise_id INT REFERENCES exercise_plan_exercise(id) ON DELETE CASCADE,
    notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN ('water', 'meal', 'exercise')),
    notification_time TIME NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ALTER TABLE user_ingredient_ingredient RENAME TO _user_ingredient_ingredient_backup;
UPDATE user_ingredients
SET ingredient_id = 2
WHERE id = 2;

ALTER TABLE user_ingredients
ADD CONSTRAINT fk_ingredient
FOREIGN KEY (ingredient_id)
REFERENCES ingredient(id)
ON DELETE CASCADE;

ALTER TABLE user_ingredient_ingredient RENAME TO _user_ingredient_ingredient_backup;

ALTER TABLE ingredient DROP CONSTRAINT unique_ingredient_name;
ALTER TABLE ingredient DROP CONSTRAINT ingredient_name_key;

-- Add the new composite unique constraint
ALTER TABLE ingredient ADD CONSTRAINT ingredient_unique_nutrition 
UNIQUE (name, category, calories, protein, carbs, fats, serving_size);

-- Insert dummy measurements for user_id = 7
INSERT INTO body_measurements (user_id, measurement_type, value, unit, measured_at, created_at)
VALUES
  -- Weight measurements
  (7, 'weight', 45.0, 'kg', '2025-02-01', CURRENT_TIMESTAMP),
  (7, 'weight', 44.8, 'kg', '2025-03-01', CURRENT_TIMESTAMP),
  (7, 'weight', 44.6, 'kg', '2025-04-01', CURRENT_TIMESTAMP),
  (7, 'weight', 44.5, 'kg', '2025-05-01', CURRENT_TIMESTAMP),
  (7, 'weight', 44.3, 'kg', '2025-06-01', CURRENT_TIMESTAMP),

  -- Height measurements
  (7, 'height', 146.9, 'cm', '2023-06-08', CURRENT_TIMESTAMP),
  (7, 'height', 147.0, 'cm', '2025-06-01', CURRENT_TIMESTAMP),

  -- Waist measurements
  (7, 'waist', 70.5, 'cm', '2025-01-01', CURRENT_TIMESTAMP),
  (7, 'waist', 69.8, 'cm', '2025-04-01', CURRENT_TIMESTAMP),
  (7, 'waist', 68.9, 'cm', '2025-06-01', CURRENT_TIMESTAMP),

  -- Hip measurements
  (7, 'hip', 91.5, 'cm', '2025-02-01', CURRENT_TIMESTAMP),
  (7, 'hip', 91.2, 'cm', '2025-03-01', CURRENT_TIMESTAMP),
  (7, 'hip', 91.0, 'cm', '2025-05-01', CURRENT_TIMESTAMP),
  (7, 'hip', 90.8, 'cm', '2025-06-01', CURRENT_TIMESTAMP),

 -- Body Fat Mass measurements
  (7, 'fat_mass', 13.5, 'kg', '2025-03-01', CURRENT_TIMESTAMP),
  (7, 'fat_mass', 12.9, 'kg', '2025-06-01', CURRENT_TIMESTAMP);

