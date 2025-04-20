import React from "react";

function StartPage({ onStart }) {
  return (
    <div
      style={{
        backgroundColor: "#f5f0ff", // soft lavender background
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px"
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "700px",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
          textAlign: "center"
        }}
      >
        <h1 style={{ fontSize: "3rem", color: "#2d3436", marginBottom: "20px" }}>
          🎮 Welcome to the CHALLENGE Game
        </h1>

        <p style={{ fontSize: "1.2rem", color: "#636e72", marginBottom: "40px" }}>
          Step into the Republic of Bean as a policymaker. Navigate difficult trade-offs, make just decisions, and shape a better future for refugee education.
        </p>

        <button
          onClick={onStart}
          style={{
            padding: "14px 32px",
            fontSize: "16px",
            fontWeight: "600",
            backgroundColor: "#6c5ce7",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            boxShadow: "0 4px 12px rgba(108, 92, 231, 0.4)"
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#4834d4")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6c5ce7")}
        >
          🚀 Start Simulation
        </button>
      </div>
    </div>
  );
}

export default StartPage;
