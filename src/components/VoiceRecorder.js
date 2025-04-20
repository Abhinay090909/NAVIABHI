// src/components/VoiceRecorder.js
import React, { useState } from "react";

function VoiceRecorder({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);

  const handleStart = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎙️ User said:", transcript);
      onTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);
      alert("Speech recognition failed. Try again.");
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <button
      onClick={handleStart}
      disabled={isRecording}
      style={{
        backgroundColor: "#fd79a8",
        color: "#fff",
        padding: "10px 20px",
        fontSize: "15px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      🎙️ {isRecording ? "Listening..." : "Ask by Voice"}
    </button>
  );
}

export default VoiceRecorder;
