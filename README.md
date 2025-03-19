# NutriFit

A comprehensive fitness and nutrition tracking application designed to help users achieve their health and wellness goals through personalized plans, meal tracking, and workout management.

https://github.com/AbdGhordlo/NutriFit/blob/11a1f7db98c9555b2c70a58b2f93fe7f6b5ec51c/NutriFit.png

## Features

- *User Authentication*: Secure login and registration system
- *Personalized Experience*: Customized fitness and nutrition plans based on user preferences and goals
- *Profile Management*: User profile with customizable settings
- *Meal Tracking*: Log and monitor daily food intake
- *Workout Plans*: Access to customized workout routines
- *Progress Tracking*: Monitor fitness achievements and nutritional habits
- *Notification System*: Stay on track with reminders for meals, workouts, and water intake

## Tech Stack

### Frontend
- React.js
- TypeScript
- React Router for navigation
- Lucide React for icons
- React Spinners for loading animations

### Backend
- Node.js
- Express.js
- JWT for authentication
- RESTful API architecture

### Database
- PostgreSQL

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- PostgreSQL

### Setup

1. *Clone the repository*
   bash
   git clone https://github.com/yourusername/nutrifit.git
   cd nutrifit
   

2. *Install dependencies*
   
   For the client:
   bash
   cd client
   npm install
   
   
   For the server:
   bash
   cd server
   npm install
   

3. *Set up environment variables*
   
   Create a .env file in the server directory with the following variables:
   
   PORT=5000
   DATABASE_URL=postgres://username:password@localhost:5432/nutrifit
   JWT_SECRET=your_jwt_secret
   

4. *Run the application*
   
   Start the server:
   bash
   cd server
   npm run dev
   
   
   Start the client:
   bash
   cd client
   npm run dev
   

5. *Access the application*
   
   Open your browser and navigate to http://localhost:5173

## Project Structure


nutrifit/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/                 # Source files
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── components/      # Reusable components
│   │   │   ├── SettingsComponents/  # Settings page components
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service files
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx          # Main application component
│   └── package.json         # Frontend dependencies
│
└── server/                  # Backend Node.js/Express application
    ├── controllers/         # Request handlers
    ├── middleware/          # Express middlewares
    ├── models/              # Database models
    ├── routes/              # API routes
    ├── utils/               # Utility functions
    ├── index.js             # Entry point
    └── package.json         # Backend dependencies


## Features in Detail

### Authentication
- JWT-based authentication
- Password encryption
- Session management

### User Settings
- Profile customization
- Notification preferences
- Privacy controls
- Account management

### Personalization
- Multi-step personalization process
- Goal setting (weight loss, muscle gain, etc.)
- Dietary preference configuration
- Fitness level assessment

### Meal Planning
- Daily calorie targets
- Macronutrient tracking
- Meal recommendations
- Water intake monitoring

### Workouts
- Customized workout plans
- Exercise demonstrations
- Progress tracking
- Weekly goal setting

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Lucide Icons](https://lucide.dev/)


-----------------------------------------------------------------------------------
Developer's Handbook: [Link](https://docs.google.com/document/d/14qFg33aHujP1xLAjaE9RkSGSIPYOWQJO5TyUi8mA1Vg/edit?usp=sharing)
