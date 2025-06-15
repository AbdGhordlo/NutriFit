export const styles = {
  container: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px'
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: '8px'
  } as React.CSSProperties,
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '24px'
  } as React.CSSProperties,
  googleButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    color: '#374151',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f9fafb'
    }
  },
  googleIcon: {
    width: '20px',
    height: '20px'
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '6px 0',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: '#e5e7eb'
    }
  } as React.CSSProperties,
  dividerText: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '0 12px',
    color: '#6b7280',
    fontSize: '14px'
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  } as React.CSSProperties,
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%'
  } as React.CSSProperties,
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '12px 16px 12px 40px',
    borderRadius: '8px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1f2937',
    transition: 'all 0.2s',
    outline: "none",
    boxSizing: 'border-box',
  } as React.CSSProperties,
  inputFocused: {
    borderColor: "#7ec987",
    boxShadow: "0 0 0 3px rgba(126, 201, 135, 0.1)",
  } as React.CSSProperties,
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    cursor: "not-allowed",
    opacity: 0.7,
  } as React.CSSProperties,
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: '#9ca3af'
  } as React.CSSProperties,
  forgotPassword: {
    textAlign: 'right',
    marginTop: '-12px'
  } as React.CSSProperties,
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#7ec987',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: '#6db776'
    }
  },
  buttonIcon: {
    width: '20px',
    height: '20px'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280'
  } as React.CSSProperties,
  link: {
    color: '#4d7051',
    textDecoration: 'none',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline'
    }
  }
};