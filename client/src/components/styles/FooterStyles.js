export const styles = {
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '16px 24px',
    zIndex: 45 // Higher than sidebar's z-index (40) to ensure it appears on top
  },
  container: {
    maxWidth: '1920px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logo: {
    // width: '20px',
    height: '20px'
  },
  brandName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4d7051'
  },
  copyright: {
    fontSize: '14px',
    color: '#6b7280'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  link: {
    fontSize: '14px',
    textDecoration: 'none',
    transition: "color 0.2s ease-in-out",
    cursor: 'pointer'
  },
  socialLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginLeft: '24px',
    paddingLeft: '24px',
    borderLeft: '1px solid #e5e7eb'
  },
  socialIcon: {
    width: '20px',
    height: '20px',
    color: '#9ca3af',
    transition: 'color 0.2s'
  },
  // Modal styles
  modal: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    container: {
      backgroundColor: 'white',
      borderRadius: '8px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    header: {
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px',
      lineHeight: '1'
    },
    content: {
      padding: '24px',
      overflowY: 'auto',
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#374151'
    }
  }
};