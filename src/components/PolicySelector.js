import React, { useState } from "react";
import PolicyOptionCard from "./PolicyOptionCard";

const categories = [
  "Access to Education",
  "Language Instruction",
  "Teacher Training",
  "Curriculum Adaptation",
  "Psychosocial Support",
  "Financial Support",
  "Certification Accreditation"
];

function PolicySelector({ onSubmit }) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [budgetUsed, setBudgetUsed] = useState(0);

  const category = categories[currentCategoryIndex];

  // Format filename: "accessToEducationOption1.jpg"
  //const categoryKey = category.toLowerCase().replace(/\s+/g, '');
  const categoryKeyMap = {
    "Access to Education": "access",
    "Language Instruction": "languageInstruction",
    "Teacher Training": "teacherTraining",
    "Curriculum Adaptation": "curriculum",
    "Psychosocial Support": "psychosocial",
    "Financial Support": "financial",
    "Certification Accreditation": "certification"
  };
  
  const categoryKey = categoryKeyMap[category];
  const getImageName = (optionNum) => `${categoryKey}Option${optionNum}.jpg`;
  
  //const getImageName = (optionNum) => `${categoryKey}Option${optionNum}.jpg`;

  const handleSelect = (optionNum) => {
    const cost = optionNum;

    const previous = selections[category];
    const previousCost = previous ? previous.cost : 0;

    const newBudget = budgetUsed - previousCost + cost;
    if (newBudget > 14) {
      alert("❌ You’ve exceeded the 14-unit budget. Please choose a cheaper option.");
      return;
    }

    setSelections((prev) => ({
      ...prev,
      [category]: {
        option: optionNum,
        cost,
      },
    }));

    setBudgetUsed(newBudget);
  };

  const nextCategory = () => {
    if (!selections[category]) {
      alert("⚠️ Please select an option before continuing.");
      return;
    }
    setCurrentCategoryIndex((i) => i + 1);
  };

  const handleSubmit = () => {
    console.log("✅ Final Selections:", selections);
    alert("Your decisions have been recorded! Thank you.");
    onSubmit(selections, budgetUsed);

    
    // Optionally route to summary screen or store in state
  };

  return (
    <div style={{ padding: "30px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "28px", color: "#2d3436", marginBottom: "10px" }}>
        Policy Category: <span style={{ color: "#00cec9" }}>{category}</span>
      </h2>
      <h4 style={{ fontSize: "18px", marginBottom: "30px" }}>
        Budget Used: <strong>{budgetUsed} / 14</strong>
      </h4>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        flexWrap: "wrap",
        marginBottom: "40px"
      }}>
        {[1, 2, 3].map((optionNum) => (
          <PolicyOptionCard
            key={optionNum}
            image={`/images/${getImageName(optionNum)}`}
            alt={`Option ${optionNum}`}
            selected={selections[category]?.option === optionNum}
            onClick={() => handleSelect(optionNum)}
          />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        {currentCategoryIndex > 0 && (
          <button
            onClick={() => setCurrentCategoryIndex(currentCategoryIndex - 1)}
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              backgroundColor: "#636e72",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ⬅ Back
          </button>
        )}

        {currentCategoryIndex < categories.length - 1 ? (
          <button
            onClick={nextCategory}
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              backgroundColor: "#00b894",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Next ➡
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#0984e3",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ✅ Submit All Policies
          </button>
        )}
      </div>
    </div>
  );
}

export default PolicySelector;
