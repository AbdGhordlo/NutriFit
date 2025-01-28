import React, { useState } from 'react';
import { Home, Calendar, Dumbbell, Apple, LineChart, Settings } from 'lucide-react';
import { styles } from './styles/SidebarStyles';

const navItems = [
  { icon: Home, label: 'Home'},
  { icon: Calendar, label: 'Meal Planner', active: true },
  { icon: Dumbbell, label: 'Exercise Planner' },
  { icon: Apple, label: 'Ingredients' },
  { icon: LineChart, label: 'Progress' },
  { icon: Settings, label: 'Settings' },
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
          <button
            key={item.label}
            style={styles.menuItem(item.active, hoveredItem === item.label)}
            onMouseEnter={() => handleMouseEnter(item.label)}
            onMouseLeave={handleMouseLeave}
          >
            <item.icon style={styles.menuIcon} />
            <span style={styles.menuText}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}