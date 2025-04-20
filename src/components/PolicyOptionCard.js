import React from "react";

function PolicyOptionCard({ image, alt, onClick, selected }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: selected ? "4px solid #00cec9" : "2px solid #ccc",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: selected
          ? "0 0 12px rgba(0, 206, 201, 0.8)"
          : "0 0 6px rgba(0,0,0,0.1)",
        transform: selected ? "scale(1.03)" : "scale(1)",
      }}
    >
      <img
        src={image}
        alt={alt}
        style={{
          width: "250px",
          height: "auto",
          borderRadius: "8px",
          display: "block",
        }}
      />
    </div>
  );
}

export default PolicyOptionCard;
