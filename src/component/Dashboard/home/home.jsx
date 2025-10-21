import React, { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  const [user, setUser] = useState(null);

  // Replace with your backend API URL
  const userId = "12345"; // this can come from login token or localStorage

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  const handleLogout = () => {
    // clear any stored tokens and redirect to login page
    alert("You have logged out!");
  };

  if (!user) return <h2 style={{ color: "white" }}>Loading user data...</h2>;

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="user-name">Welcome, {user.name}</div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="home-card">
        <h1>Welcome to Garage Pulse!</h1>
        <p>You have successfully logged in as <strong>{user.email}</strong>.</p>
        <button
          className="home-btn"
          onClick={() => alert("More features coming soon!")}
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default Home;
