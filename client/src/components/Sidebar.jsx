import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Dumbbell, Apple, LineChart, Settings } from 'lucide-react';
import { styles } from './styles/SidebarStyles';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Calendar, label: 'Meal Planner', path: '/meal-planner' },
  { icon: Dumbbell, label: 'Exercise Planner', path: '/exercise-planner' },
  { icon: Apple, label: 'Ingredients', path: '/ingredients' },
  { icon: LineChart, label: 'Progress', path: '/progress' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (label) => {
    setHoveredItem(label);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  /* Notice that if you want to shrink the navbar's width, you'll need to do it 
  using responsive logic here (in the JSX file) with a state and useEffect. A media
  query didn't work for me using CSS-in-JS*/

  return (
    <nav style={styles.nav}>
      <div style={styles.menuContainer}>
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            style={styles.menuItem(item.active, hoveredItem === item.label)}
            onMouseEnter={() => handleMouseEnter(item.label)}
            onMouseLeave={handleMouseLeave}
          >
            <item.icon style={styles.menuIcon} />
            <span style={styles.menuText}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}