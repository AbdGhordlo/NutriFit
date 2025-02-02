export const commonStyles = {
  container: {
    padding: "20px",
    maxWidth: "1000px", // I think this much is enough
    width: "90%",
    margin: "0 auto",
  },
  mainContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    padding: "24px",
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "24px",
  },
  dayContainer: (isToday) =>
    ({
      borderRadius: "8px",
      padding: "24px",
      transition: "all 0.3s",
      border: isToday ? "2px solid #7ec987" : "1px solid #f3f4f6",
      boxShadow: isToday ? "0 0 15px rgba(126, 201, 135, 0.2)" : "none",
    } as React.CSSProperties),
  dayHeader: {
    textAlign: "center",
    marginBottom: "32px",
  } as React.CSSProperties,
  dayName: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
  },
  dayDate: {
    color: "#6b7280",
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px", // Reduced a bit
  } as React.CSSProperties,
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    borderRadius: "8px",
    transition: "border-color 0.2s",
  },
  itemInfo: {
    flex: 1, //this doesn't seem to be doing anything, but I'm not 100% sure
  },
  itemName: {
    fontWeight: "500",
    color: "#1f2937",
  },
  itemTimeInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
  },
  itemTime: {
    fontSize: "14px",
    color: "#6b7280",
  },
  dot: {
    fontSize: "14px",
    color: "#9ca3af",
  },
  navigationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "24px",
  },
  navButton: (disabled) => ({
    padding: "8px",
    borderRadius: "50%",
    transition: "all 0.2s",
    border: "none",
    cursor: disabled ? "default" : "pointer",
    height: "40px",
    width: "40px",
  }),

  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
  },

  generateButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  editButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    color: "#4d7051",
    borderRadius: "8px",
    border: "2px solid #7ec987",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};
