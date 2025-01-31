export const styles = {
  nav: {
    position: 'fixed',
    left: 0,
    top: '64px',
    height: 'calc(100vh - 64px)',
    width: '255.2px', // Default width
    backgroundColor: 'white',
    borderRight: '1px solid #e5e7eb',
    padding: '24px 0',
    transition: 'width 0.3s ease', // Smooth transition for width change
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '0 12px'
  },
  menuItem: (active, hovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    // width: '100%', /* For some reason, when I use <Link> instead of <button> in Sidebar.jsx, 
    // this goes out of bounds, which is why I specified the width in pixels below. You'll probably need
    // to change this if you later want the sidebar to shrink.*/
    width: '198px',
    transition: 'all 0.2s',
    backgroundColor: active
      ? hovered
        ? 'rgba(126, 201, 135, 0.2)' // Darker when active and hovered
        : 'rgba(126, 201, 135, 0.1)' // Normal active color
      : hovered
      ? '#f3f4f6'
      : 'transparent',
    color: active ? '#4d7051' : '#4b5563',
    cursor: 'pointer',
    border: '2px solid transparent', // Default transparent border
  }),
  menuIcon: {
    width: '20px',
    height: '20px'
  },
  menuText: {
    fontWeight: '500'
  }
};