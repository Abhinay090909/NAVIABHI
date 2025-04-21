import React, { useState } from "react";
import { generateJustification } from "../ai/generateJustifications";

const categories = [
  "Access to Education",
  "Language Instruction",
  "Teacher Training",
  "Curriculum Adaptation",
  "Psychosocial Support",
  "Financial Support",
  "Certification Accreditation"
];

function GroupDiscussion({ policies, onVoteComplete }) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const category = categories[currentCategoryIndex];
  const [userTranscript, setUserTranscript] = useState("");
  const [manualQuestions, setManualQuestions] = useState({});
  const [agentChats, setAgentChats] = useState({});
  const [typingAgent, setTypingAgent] = useState(null);

  const user = policies.find((p) => p.agentId === "realPlayer");
  const agents = policies.filter((p) => p.agentId !== "realPlayer");

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    synth.speak(utter);
  };

  const updateChat = (agentId, question, answer) => {
    setAgentChats((prev) => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), { q: question, a: answer }]
    }));
  };

  const handleTalkToAgent = async (agent, userMessage) => {
    setTypingAgent(agent.agentId);
    try {
      const { getAgentGPTResponse } = await import("../ai/getAgentGPTResponse");
      let reply = await getAgentGPTResponse(agent, category, userMessage);

      if (!reply || typeof reply !== "string" || reply.includes("⚠️ Failed to contact")) {
        reply = "⚠️ Sorry, I couldn't generate a response at the moment.";
      }

      updateChat(agent.agentId, userMessage, reply);
      speakText(`${agent.name} says: ${reply}`);
    } catch (error) {
      console.error("❌ Error in handleTalkToAgent:", error);
      updateChat(agent.agentId, userMessage, "⚠️ Failed to generate a response.");
    } finally {
      setTypingAgent(null);
    }
  };

  const handleVoiceQuestion = (agent) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setUserTranscript("🎤 Listening...");
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setUserTranscript(`✅ You asked: "${transcript}"`);
      await handleTalkToAgent(agent, transcript);
    };
    recognition.onerror = (event) => {
      setUserTranscript(`⚠️ Error: ${event.error}`);
      alert("Voice recognition error: " + event.error);
    };

    recognition.start();
  };

  const handleManualSubmit = (agent) => {
    const userMsg = manualQuestions[agent.agentId]?.trim();
    if (!userMsg) return;

    setUserTranscript(`📄 You typed: "${userMsg}"`);
    handleTalkToAgent(agent, userMsg);

    setManualQuestions((prev) => ({
      ...prev,
      [agent.agentId]: ""
    }));
  };

  const clearAgentChat = (agentId) => {
    setAgentChats((prev) => ({ ...prev, [agentId]: [] }));
  };

  const renderChatBubble = (agentId) => {
    const chats = agentChats[agentId] || [];
    if (chats.length === 0) return null;
    const last = chats[chats.length - 1];

    return (
      <div style={chatBubble}>
        <strong>You:</strong> {last.q}<br />
        <strong>{typingAgent === agentId ? "Agent (typing...)" : "Agent"}:</strong> {typingAgent === agentId ? "..." : last.a}
      </div>
    );
  };

  const renderDesk = (agent) => {
    const option = agent.selections[category]?.option;
    const justification = generateJustification(agent, category, option);
    const inputValue = manualQuestions[agent.agentId] || "";

    return (
      <div key={agent.agentId} style={deskCard}>
        <h4>{agent.name}</h4>
        <p style={{ fontSize: "14px" }}>Option {option}</p>
        <div style={avatarEmoji}>🧑‍💼</div>

        <button onClick={() => speakText(justification)} style={smallButton}>🎧 Hear Justification</button>
        <button onClick={() => handleVoiceQuestion(agent)} style={{ ...smallButton, backgroundColor: "#6c5ce7" }}>🎙️ Speak</button>

        <input
          type="text"
          placeholder="Type question"
          value={inputValue}
          onChange={(e) => setManualQuestions((prev) => ({ ...prev, [agent.agentId]: e.target.value }))}
          style={{ width: "100%", padding: "6px", fontSize: "13px", borderRadius: "5px" }}
        />
        <button onClick={() => handleManualSubmit(agent)} style={{ ...smallButton, width: "100%" }}>📩 Send</button>
        <button onClick={() => clearAgentChat(agent.agentId)} style={{ ...smallButton, marginTop: "4px", backgroundColor: "#d63031" }}>🔄 Clear</button>

        {renderChatBubble(agent.agentId)}
      </div>
    );
  };

  const renderUserDesk = () => {
    const option = user.selections[category]?.option;
    return (
      <div style={{ ...deskCard, backgroundColor: "#dff9fb" }}>
        <h4>You</h4>
        <p style={{ fontSize: "14px" }}>Option {option}</p>
        <div style={avatarEmoji}>🧍</div>
      </div>
    );
  };

  return (
    <div style={container}>
      <h2 style={header}>🧠 Policy Discussion: {category}</h2>
      <div style={instruction}><strong>Options:</strong><br />[1] Minimal Intervention &nbsp;&nbsp; [2] Moderate Change &nbsp;&nbsp; [3] Full Transformation</div>
      <div style={transcriptHint}>{userTranscript || "🗣️ Ask a question by speaking or typing below."}</div>

      <div style={gridRow}>{agents.slice(0, 3).map(renderDesk)}</div>
      <div style={bottomRow}>{renderDesk(agents[3])}{renderUserDesk()}</div>

      <div style={{ textAlign: "center" }}>
        {currentCategoryIndex > 0 && <button onClick={() => setCurrentCategoryIndex(currentCategoryIndex - 1)} style={navButton("#636e72")}>⬅ Back</button>}
        {currentCategoryIndex < categories.length - 1 ? (
          <button onClick={() => setCurrentCategoryIndex(currentCategoryIndex + 1)} style={navButton("#00b894")}>Next ➡</button>
        ) : (
          <button onClick={() => onVoteComplete({})} style={navButton("#0984e3")}>Proceed to Voting 🗳️</button>
        )}
      </div>
    </div>
  );
}

const avatarEmoji = { fontSize: "40px", margin: "10px 0" };
const chatBubble = { marginTop: "10px", padding: "10px", backgroundColor: "#dfe6e9", borderRadius: "8px", fontSize: "13px", textAlign: "left", maxWidth: "180px", marginLeft: "auto", marginRight: "auto" };
const deskCard = { width: "220px", backgroundColor: "#f1f2f6", borderRadius: "10px", padding: "15px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", textAlign: "center" };
const container = { padding: "40px", fontFamily: "Segoe UI", backgroundColor: "#f9f9ff", minHeight: "100vh" };
const header = { textAlign: "center", color: "#2d3436" };
const instruction = { textAlign: "center", marginTop: "10px", marginBottom: "20px" };
const transcriptHint = { textAlign: "center", fontSize: "15px", fontStyle: "italic", color: "#2d3436", marginBottom: "15px" };
const gridRow = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyItems: "center", gap: "30px", marginBottom: "30px" };
const bottomRow = { display: "flex", justifyContent: "center", gap: "60px", marginBottom: "40px" };
const smallButton = { marginTop: "8px", padding: "8px 10px", fontSize: "13px", backgroundColor: "#74b9ff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" };
const navButton = (bg) => ({ padding: "12px 20px", fontSize: "16px", backgroundColor: bg, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", margin: "0 10px" });

export default GroupDiscussion;
