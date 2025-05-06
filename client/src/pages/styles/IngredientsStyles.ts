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
    color: '#1f2937',
    padding: '12px 24px',

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
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px'
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
  'category-box': {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // HOVER efekti için EKLEDİM
    cursor: 'pointer', // Hover olunca mouse değişsin diye
  },
  'category-box-hover': {
    transform: 'scale(1.02)', // HOVER efekti için EKLEDİM
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // HOVER efekti için EKLEDİM
  },
  'category-header-box': {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },

  stockButton: (inStock) => ({
    padding: '8px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: inStock ? 'rgba(126, 201, 135, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: inStock ? '#4d7051' : '#ef4444',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: inStock ? '75px' : '103px',
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
  },
  categoriesGrid: {
    display: 'flex',
    flexDirection: 'column', // ALT ALTA sıralamak için EKLEDİM
    gap: '32px'
  } as React.CSSProperties,
  categoryContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // HOVER efekti için
    cursor: 'pointer', // HOVER efekti için
  } as React.CSSProperties,
  categoryContainerHover: {
    transform: 'scale(1.02)', // HOVER efekti için
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // HOVER efekti için
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  categoryTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937'
  },
  tableContainer: {
    overflowX: 'auto'
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  } as React.CSSProperties,
  tableHeader: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    color: '#4b5563',
    fontSize: '14px',
    fontWeight: '500'
  } as React.CSSProperties,
  tableRow: {
    borderBottom: '1px solid #f3f4f6'
  },
  tableCell: {
    padding: '10px 12px',
    fontSize: '14px',
    color: '#1f2937',
    fontWeight: '400',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle',
  } as React.CSSProperties,
};
