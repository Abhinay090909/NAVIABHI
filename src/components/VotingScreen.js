import React, { useState } from "react";

const categories = [
  "Access to Education",
  "Language Instruction",
  "Teacher Training",
  "Curriculum Adaptation",
  "Psychosocial Support",
  "Financial Support",
  "Certification Accreditation"
];

function VotingScreen({ policies, onComplete }) {
  const [votes, setVotes] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const user = policies.find((p) => p.agentId === "realPlayer");
  const agents = policies.filter((p) => p.agentId !== "realPlayer");

  const budgetUsed = Object.values(votes).reduce((sum, val) => sum + (val || 0), 0);
  const allCategoriesVoted = categories.every((cat) => votes[cat]);

  const handleVote = (category, option) => {
    const previous = votes[category] || 0;
    const newBudget = budgetUsed - previous + option;

    if (newBudget > 14) {
      alert("❌ Budget exceeded! You only have 14 units.");
      return;
    }

    setVotes((prev) => ({ ...prev, [category]: option }));
  };

  const finalizeVotes = () => {
    const finalPackage = {};

    for (let cat of categories) {
      const allVotes = [votes[cat], ...agents.map((a) => a.selections[cat]?.option)];
      const tally = {};
      for (let v of allVotes) tally[v] = (tally[v] || 0) + 1;

      const maxCount = Math.max(...Object.values(tally));
      const topOptions = Object.keys(tally).filter((k) => tally[k] === maxCount);
      const finalOption = topOptions.length === 1 ? topOptions[0] : topOptions[Math.floor(Math.random() * topOptions.length)];

      finalPackage[cat] = parseInt(finalOption);
    }

    setSubmitted(true);
    onComplete(finalPackage);
  };

  return (
    <div style={container}>
      <h2 style={header}>🗳️ Final Policy Voting</h2>
      <p style={subheader}>
        Vote once per category. You must stay within your 14-unit budget.
      </p>

      <div style={{
        textAlign: "center",
        fontSize: "16px",
        color: budgetUsed > 13 ? "#d63031" : "#6c5ce7",
        marginBottom: "30px"
      }}>
        💰 <strong>Budget Used:</strong> {budgetUsed} / 14
      </div>

      {categories.map((cat) => (
        <div key={cat} style={categoryBlock}>
          <h3 style={categoryTitle}>{cat}</h3>

          <div style={cardRow}>
            {[1, 2, 3].map((opt) => (
              <div
                key={opt}
                onClick={() => handleVote(cat, opt)}
                style={{
                  ...optionCard,
                  backgroundColor: votes[cat] === opt ? "#6c5ce7" : "#dfe6e9",
                  color: votes[cat] === opt ? "#fff" : "#2d3436"
                }}
              >
                <h4>Option {opt}</h4>
                <p style={{ fontSize: "13px", opacity: 0.8 }}>Cost: {opt}</p>
                <div style={{ fontSize: "20px", marginTop: "5px" }}>
                  {opt === 1 ? "🌱" : opt === 2 ? "⚖️" : "🚀"}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "13px", marginTop: "10px", color: "#636e72" }}>
            🧠 AI Votes: {agents.map((a) => a.selections[cat]?.option).join(", ")}
          </p>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={finalizeVotes}
          disabled={!allCategoriesVoted}
          style={{
            ...submitBtn,
            backgroundColor: allCategoriesVoted ? "#00b894" : "#b2bec3",
            cursor: allCategoriesVoted ? "pointer" : "not-allowed"
          }}
        >
          ✅ Submit Final Team Vote
        </button>
      ) : (
        <p style={{ color: "#00b894", fontSize: "16px" }}>
          ✔️ Voting complete. Submitting results...
        </p>
      )}
    </div>
  );
}

// STYLES
const container = {
  padding: "40px",
  fontFamily: "Segoe UI",
  backgroundColor: "#f9f9ff",
  minHeight: "100vh"
};

const header = {
  textAlign: "center",
  fontSize: "28px",
  color: "#2d3436",
  marginBottom: "10px"
};

const subheader = {
  textAlign: "center",
  fontSize: "16px",
  color: "#636e72",
  marginBottom: "20px"
};

const categoryBlock = {
  marginBottom: "40px"
};

const categoryTitle = {
  textAlign: "center",
  fontSize: "20px",
  color: "#2d3436",
  marginBottom: "10px"
};

const cardRow = {
  display: "flex",
  justifyContent: "center",
  gap: "30px"
};

const optionCard = {
  width: "180px",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "0.3s",
  textAlign: "center"
};

const submitBtn = {
  marginTop: "30px",
  padding: "14px 28px",
  fontSize: "16px",
  color: "#fff",
  border: "none",
  borderRadius: "6px"
};

export default VotingScreen;
