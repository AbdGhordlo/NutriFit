export const styles = {
  container: {
    padding: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '32px'
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  sectionIcon: {
    width: '24px',
    height: '24px',
    color: '#4d7051'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937'
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  } as React.CSSProperties,
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0'
  },
  settingInfo: {
    flex: 1,
    marginRight: '24px'
  },
  settingName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: '4px'
  },
  settingDescription: {
    fontSize: '14px',
    color: '#6b7280'
  },
  toggle: (active) => ({
    width: '44px',
    height: '20px',
    backgroundColor: active ? '#7ec987' : '#d1d5db',
    borderRadius: '12px',
    padding: '2px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }),
  toggleHandle: (active) => ({
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transform: active ? 'translateX(23px)' : 'translateX(0)',
    transition: 'transform 0.2s'
  }),
  input: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    fontSize: '14px',
    color: '#1f2937',
    width: '120px'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    color: '#1f2937',
    backgroundColor: 'white',
    cursor: 'pointer'
  }
};