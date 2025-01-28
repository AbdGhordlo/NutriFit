export const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    backgroundColor: 'white',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    zIndex: 50,
    padding: '0 24px'
  },
  container: {
    maxWidth: '1920px',
    margin: '0 auto',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  logo: {
    // width: '32px',
    height: '30px'
  },
  brandName: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#4d7051'
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  notificationButton: {
    padding: '8px 8px 4px', /* for some reason, the bell has some extra 
    space at the bottom, so I decreased the bottom padding */
    borderRadius: '50%',
    backgroundColor: 'white',
    position: 'relative',
    border: '2px solid transparent', // Default border
    transition: 'background-color 0.3s ease', // Smooth transition
  },
  notificationIcon: {
    height: '24px',
    color: '#4b5563'
  },
  notificationDot: {
    position: 'absolute',
    top: '7px',
    right: '10px',
    width: '8px',
    height: '8px',
    backgroundColor: '#ef4444',
    borderRadius: '50%'
  },
  accountButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '9999px',
    cursor: 'pointer',
    border: '2px solid transparent', // Default border
    transition: 'background-color 0.3s ease', // Smooth transition
  },
  accountIcon: {
    height: '24px',
    color: '#4b5563'
  },
  accountText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4b5563'
  }
};