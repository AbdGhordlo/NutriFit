export const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    padding: '16px',
    marginBottom: '24px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937'
  },
  progressText: {
    fontSize: '14px',
    color: '#6b7280'
  },
  progressBarContainer: {
    height: '12px',
    backgroundColor: '#f3f4f6',
    borderRadius: '9999px',
    overflow: 'hidden'
  },
  progressBar: (progress) => ({
    height: '100%',
    backgroundColor: '#7ec987',
    transition: 'width 500ms ease-out',
    borderRadius: '9999px',
    width: `${progress}%`
  }),
  milestonesContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px'
  },
  milestone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    width: `${100 / 6}%`
  },
  milestoneIcon: (completed) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
    backgroundColor: completed ? '#7ec987' : '#f3f4f6',
    color: completed ? 'white' : '#9ca3af'
  }),
  milestoneTime: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#4b5563',
    whiteSpace: 'nowrap'
  },
  milestoneLabel: {
    fontSize: '12px',
    textAlign: 'center',
    color: '#6b7280',
  }
};