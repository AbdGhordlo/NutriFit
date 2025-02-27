export const styles = {
  container: {
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
    gap: '32px'
  },
  categoryContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  categoryIcon: {
    width: '24px',
    height: '24px',
    color: '#4d7051'
  },
  categoryTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb'
  },
  tableCell: {
    padding: '16px 0',
    fontSize: '14px',
    color: '#1f2937',
    verticalAlign: 'middle'
  },
  input: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    fontSize: '14px',
    color: '#1f2937',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    color: '#1f2937',
    backgroundColor: 'white',
    cursor: 'pointer',
    width: '100%'
  },
  photoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  photoPlaceholder: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoIcon: {
    color: '#9ca3af'
  },
  photoButton: {
    padding: '8px 16px',
    backgroundColor: '#7ec987',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#6db776'
    }
  },
  toggleContainer: {
    position: 'relative',
    display: 'inline-block'
  },
  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0
  },
  toggleSwitch: (checked: boolean) => ({
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: checked ? '#7ec987' : '#d1d5db',
    borderRadius: '34px',
    transition: 'background-color 0.2s',
    ':before': {
      position: 'absolute',
      content: '""',
      height: '20px',
      width: '20px',
      left: checked ? 'calc(100% - 22px)' : '2px',
      bottom: '2px',
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: 'transform 0.2s'
    }
  }),
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#7ec987',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px', // Add space above the button
    alignSelf: 'flex-end', // Align the button to the right if the parent is a flex container
    float: 'right', // Align the button to the right if the parent is not a flex container
    transition: 'background-color 0.2s', // Add a smooth color transition
    ':hover': {
      backgroundColor: '#6db776' // Darken the color on hover
    }
  },
};