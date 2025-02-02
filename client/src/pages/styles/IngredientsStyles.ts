export const styles = {
  container: {
    padding: '24px'
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
  addButton: {
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
  },
  ingredientCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  categoryIconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'rgba(126, 201, 135, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  categoryIcon: {
    width: '24px',
    height: '24px',
    color: '#4d7051'
  },
  stockButton: (inStock) => ({
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: inStock ? 'rgba(126, 201, 135, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: inStock ? '#4d7051' : '#ef4444',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: inStock ? 'rgba(126, 201, 135, 0.2)' : 'rgba(239, 68, 68, 0.2)'
    }
  }),
  ingredientName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  servingSize: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px'
  },
  nutritionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  nutritionItem: {
    textAlign: 'center'
  },
  nutritionValue: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '600',
    color: '#4d7051'
  },
  nutritionLabel: {
    fontSize: '14px',
    color: '#6b7280'
  }
};