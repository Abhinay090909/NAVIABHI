import React, { useState } from "react";

function UserInfoForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: "",
    nationality: "",
    occupation: "",
    education: "",
    displaced: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You can store this in state/context/localStorage as needed
    console.log("User Info:", formData);

    onSubmit(formData); // Go to next screen
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h2>Before We Begin...</h2>
      <p>Please tell us a little about yourself.</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />
        <input type="text" name="nationality" placeholder="Nationality" value={formData.nationality} onChange={handleChange} required />
        <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} required />
        <input type="text" name="education" placeholder="Educational Level" value={formData.education} onChange={handleChange} required />
        <input type="text" name="displaced" placeholder="Displacement Experience (Yes/No or short answer)" value={formData.displaced} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Current Location (City, Country)" value={formData.location} onChange={handleChange} required />
        <button
          type="submit"
          style={{
            padding: "12px",
            fontSize: "16px",
            backgroundColor: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Submit & View Story
        </button>
      </form>
    </div>
  );
}

export default UserInfoForm;
