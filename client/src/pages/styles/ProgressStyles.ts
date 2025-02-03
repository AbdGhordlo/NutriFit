import React from "react";

export const styles = {
  container: {
    padding: "24px",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "24px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  statIcon: {
    width: "24px",
    height: "24px",
    color: "#4d7051",
  },
  statTrend: (positive) => ({
    fontSize: "14px",
    fontWeight: "500",
    color: positive ? "#059669" : "#dc2626",
  }),
  statTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#4b5563",
    marginBottom: "8px",
  },
  statValue: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
    marginBottom: "12px",
  },
  statNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
  },
  statTotal: {
    fontSize: "16px",
    color: "#6b7280",
  },
  statLabel: {
    fontSize: "16px",
    color: "#6b7280",
    marginLeft: "4px",
  },
  progressBar: {
    height: "8px",
    backgroundColor: "#f3f4f6",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: (percentage) => ({
    height: "100%",
    width: `${percentage}%`,
    backgroundColor: "#7ec987",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  }),
  weeklyProgress: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "20px",
  },
  progressTable: {
    width: "100%",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 2fr 1.5fr",
    padding: "12px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    marginBottom: "12px",
    fontWeight: "500",
    color: "#6b7280",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 2fr 1.5fr",
    padding: "12px 20px",
    alignItems: "center",
    borderBottom: "1px solid #f3f4f6",
  },
  dayCell: {
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,
  dayName: {
    fontWeight: "500",
    color: "#1f2937",
  },
  dayDate: {
    fontSize: "14px",
    color: "#6b7280",
  },
  progressCell: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  } as React.CSSProperties,
  progressText: {
    fontSize: "14px",
    color: "#6b7280",
  },
  caloriesCell: {
    display: "flex",
    alignItems: "baseline",
    gap: "2px",
  },
  caloriesActual: {
    fontWeight: "500",
    color: "#1f2937",
  },
  caloriesGoal: {
    fontSize: "14px",
    color: "#6b7280",
  },
  generalProgress: {
    marginBottom: "32px",
  },
  generalStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  dailyBreakdown: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
};
