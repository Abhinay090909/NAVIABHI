import React, { useState } from "react";

function ParticipantInfoForm({ onSubmit }) {
   const [form, setForm] = useState({
    age: "",
    nationality: "",
    occupation: "",
    education: "",
    displaced: "",
    location: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => v.trim() === "")) {
      alert("Please fill out all fields.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f0ff",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        padding: "20px"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <h2 style={{ textAlign: "center", color: "#2d3436" }}>👤 Participant Information</h2>

        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} required />
        <input name="nationality" placeholder="Nationality" value={form.nationality} onChange={handleChange} required />
        <input name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} required />
        <input name="education" placeholder="Education Level" value={form.education} onChange={handleChange} required />
        <input name="displaced" placeholder="Displacement Experience" value={form.displaced} onChange={handleChange} required />
        <input name="location" placeholder="Current Location" value={form.location} onChange={handleChange} required />

        <button
          type="submit"
          style={{
            backgroundColor: "#6c5ce7",
            color: "#fff",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(108, 92, 231, 0.4)"
          }}
        >
          ➡ Continue
        </button>
      </form>
    </div>
  );
}

export default ParticipantInfoForm;
