export const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    padding: '24px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px'
  },
  mealsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  } as React.CSSProperties,
  mealItem: (completed) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '8px',
    border: completed ? '1px solid #7ec987' : '1px solid #f3f4f6',
    backgroundColor: completed ? 'rgba(126, 201, 135, 0.05)' : 'white'
  }),
  mealInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconContainer: (completed) => ({
    height: '30px',
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: completed ? 'rgba(126, 201, 135, 0.1)' : '#f3f4f6',
    color: completed ? '#4d7051' : '#6b7280'
  }),
  mealDetails: {
    display: 'flex',
    flexDirection: 'column'
  } as React.CSSProperties,
  mealName: {
    fontWeight: '500',
    color: '#1f2937'
  },
  mealTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
    color: '#6b7280',
    fontSize: '14px'
  },
  //-----------
  checkboxContainer: {
    display: 'inline-block',
    position: 'relative',
    width: '20px',
    height: '20px',
  } as React.CSSProperties,
  checkboxInput: {
    position: 'absolute',
    opacity: 0, // Hide the default checkbox
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    zIndex: 1,
  } as React.CSSProperties,
  customCheckbox: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid #7ec987',
    backgroundColor: 'white',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  customCheckboxChecked: {
    backgroundColor: '#7ec987',
  },
  checkmark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: '12px',
    height: '30px',
    opacity: 0,
    transition: 'opacity 0.2s',
  } as React.CSSProperties,
  checkmarkChecked: {
    opacity: 1,
  },
};