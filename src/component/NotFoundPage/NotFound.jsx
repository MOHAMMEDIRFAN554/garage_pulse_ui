import React from "react";
import "./notFound.css"; 
import underConstructionImg from "../../assets/404_error.png"; 

const NotFound = () => {
  return (
    <div className="notfound-container">
      <main className="notfound-page">
        <h1>404 - Uh oh! This page is still getting a makeover</h1>
        <p>
          
          <span className="sarcasm">
            "Currently under construction... because Rome and this page wasn’t built in one commit."
          </span>
        </p>

        <div className="notfound-wrapper">
          <img
            src={underConstructionImg}
            alt="Developer painting poorly"
          />
          <a className="notfound-link" href="/landing">
            Take me back to Home
          </a>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
