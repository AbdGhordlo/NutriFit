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
  exercisesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  exerciseItem: (completed) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '8px',
    border: completed ? '1px solid #7ec987' : '1px solid #f3f4f6',
    backgroundColor: completed ? 'rgba(126, 201, 135, 0.05)' : 'white'
  }),
  exerciseInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconContainer: (completed) => ({
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: completed ? 'rgba(126, 201, 135, 0.1)' : '#f3f4f6',
    color: completed ? '#4d7051' : '#6b7280'
  }),
  exerciseDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  exerciseName: {
    fontWeight: '500',
    color: '#1f2937'
  },
  exerciseTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
    color: '#6b7280',
    fontSize: '14px'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid #7ec987',
    accentColor: '#7ec987'
  }
};