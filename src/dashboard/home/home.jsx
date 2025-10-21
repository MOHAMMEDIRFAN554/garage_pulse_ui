import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-card">
                <h1> Welcome to Garage Pulse!</h1>
                <p>You have successfully logged in.</p>
                <button className="home-btn" onClick={() => alert("More features coming soon!")}>
                    Explore
                </button>
            </div>
        </div>
    );
};

export default Home;
