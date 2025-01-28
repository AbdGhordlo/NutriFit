export const styles = {
  container: {
    padding: '24px'
  },
  mainContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    padding: '24px',
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '24px'
  },
  dayContainer: (isToday) => ({
    position: 'relative',
    borderRadius: '8px',
    padding: '24px',
    transition: 'all 0.3s',
    border: isToday ? '2px solid #7ec987' : '1px solid #f3f4f6',
    boxShadow: isToday ? '0 0 15px rgba(126, 201, 135, 0.2)' : 'none'
  }),
  dayHeader: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  dayName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937'
  },
  dayDate: {
    color: '#6b7280'
  },
  mealsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  mealItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #f3f4f6',
    transition: 'border-color 0.2s',
    ':hover': {
      borderColor: '#e5e7eb'
    }
  },
  mealInfo: {
    flex: 1
  },
  mealName: {
    fontWeight: '500',
    color: '#1f2937'
  },
  mealTimeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px'
  },
  mealTime: {
    fontSize: '14px',
    color: '#6b7280'
  },
  dot: {
    fontSize: '14px',
    color: '#9ca3af'
  },
  macrosContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '14px'
  },
  macroItem: {
    textAlign: 'center'
  },
  macroValue: {
    display: 'block',
    fontWeight: '500',
    color: '#4d7051'
  },
  macroLabel: {
    color: '#6b7280'
  },
  navigationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px'
  },
  navButton: (disabled) => ({
    padding: '8px',
    borderRadius: '50%',
    transition: 'all 0.2s',
    color: disabled ? '#d1d5db' : '#7ec987',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ':hover': !disabled ? {
      backgroundColor: 'rgba(126, 201, 135, 0.1)'
    } : {}
  }),
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px'
  },
  generateButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#7ec987',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#6db776'
    }
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#4d7051',
    borderRadius: '8px',
    border: '2px solid #7ec987',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(126, 201, 135, 0.1)'
    }
  }
};