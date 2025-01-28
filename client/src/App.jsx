import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import MealPlanner from './components/MealPlanner'; // Assuming you have MealPlanner component
import AppStyles from './AppStyles';

function App() {
  return (
    <div style={AppStyles.appContainer}>
      <Header />
      <Sidebar />
      
      {/* <main style={AppStyles.mainContent}>
        <div style={AppStyles.contentWrapper}>
          <MealPlanner />
        </div>
      </main> */}

      <Footer />
    </div>
  );
}

export default App;
