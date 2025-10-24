import React from "react";

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h2>Total Vehicles</h2>
          <p>25</p>
        </div>
        <div style={styles.card}>
          <h2>Pending Services</h2>
          <p>5</p>
        </div>
        <div style={styles.card}>
          <h2>Completed Jobs</h2>
          <p>18</p>
        </div>
      </div>
    </div>
  );
};

// Simple inline styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
    fontSize: "28px",
    textAlign: "center",
  },
  cardContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "20px",
    width: "200px",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};

export default Dashboard;
