export const styles = {
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '16px 24px',
    zIndex: 45  // Ensure footer is above other elements
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
  }
};