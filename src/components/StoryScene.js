import React, { useEffect, useState } from "react";

const paragraphs = [
  `You are an honorable member of parliament in the Republic of Bean, a unique nation situated in a distant realm beyond Earth. While the country is not wealthy, its citizens enjoy free access to education, healthcare, and various public services. The Republic of Bean prides itself on its multicultural society, comprising three ethnicities and two religious minority groups. Thanks to the country's commitment to secularism, citizens are free to practice their religions without any obstacles. However, due to safety concerns, the nation follows many monolithic praxis and policies, which includes a monolingual education system and teaching only Grapes', the majority group, history, and literature. Also, Grapes' language, Teanish is the only official language used for public services.`,

  `The largest minority group in the Republic of Bean is the Curly Hairs, who possess distinct ethnic backgrounds and their own language. They have long been advocating for their cultural rights, with a specific focus on education in their mother tongue. The Curly Hairs make up approximately 22% of the country's total population.`,

  `While poverty is not a prevalent issue in the Republic of Bean, the nation suffers from corruption, which angers citizens. In response, citizens occasionally take to the streets in protest, sometimes resulting in clashes with the police. Additionally, Grapes seeks to maintain their dominance in the administration and bureaucracy. They hold the belief that sharing power with other groups would jeopardize the nation's future.`,

  `The Republic of Bean shares borders with four neighboring countries, three of which enjoy stable conditions. However, the country’s northwestern neighbor, Orangenya, is currently experiencing internal conflicts. As a result, two million individuals have sought refuge in the Republic of Bean, comprising 14% of its entire population. Despite their geographic proximity, these refugees and the citizens of the Republic of Bean possess numerous cultural differences.`,

  `In the aftermath of a global economic crisis, the Republic's economy has become increasingly unstable. Moreover, other nations worldwide are hesitant to extend solidarity towards the country. This unfortunately promotes xenophobia and political debates, leading to heightened polarization within the nation. In response to these challenges, the parliament has initiated an educational reform aimed at providing contemporary, quality, and accessible education for all refugees. Also, the parliament wants to focus on the social integration of refugees to prevent possible conflicts.`,

  `As a member of parliament, you bear the responsibility of actively participating in and contributing to this reform process. The reform package comprises 7 key factors, and you will be tasked with choosing an option from each factor, ensuring the allocation of limited resources. By making these decisions, you can help shape the future of refugee education in the Republic of Bean.`,

  `**Rules**:\n
<strong>1. Budget Limit:</strong>\n
  - Your team has a total budget of 14 units to allocate across all policy decisions.\n
\n
<strong>2. Option Costs:</strong>\n
  - Each policy option has a specific cost:\n
    • Option 1 costs 1 unit\n
    • Option 2 costs 2 units\n
    • Option 3 costs 3 units\n
\n
<strong>3. Budget Management:</strong>\n
  - You must ensure that the total cost of your chosen policies does not exceed the 14-unit budget.\n
  - Balance the costs of each decision while addressing the needs of the refugees and the nation.\n
\n
<strong>4. Policy Selection Variety:</strong>\n
  - You cannot select all your policies from just one option across the seven policy areas.\n
  - For example, you cannot choose only Option 1 or only Option 2 for all seven decisions.\n
  - Ensure a mix of options to encourage balanced decision-making.\n
\n
<strong>5. Strategic Decision–Making:</strong>\n
  - Consider the advantages and disadvantages of each policy option.\n
  - Your goal is to create an effective and inclusive refugee education package within the budget constraints.`

];

function StoryScene({ onContinue }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(true);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(paragraphs[currentIndex]);
    utter.rate = 1;
    utter.pitch = 1.1;
    utter.onend = () => setIsSpeaking(false);
    synth.speak(utter);

    return () => synth.cancel();
  }, [currentIndex]);

  const handleContinue = () => {
    if (currentIndex < paragraphs.length - 1) {
      setIsSpeaking(true);
      setCurrentIndex(currentIndex + 1);
    } else {
      window.speechSynthesis.cancel();
      onContinue();
    }
  };

  const handleSkip = () => {
    window.speechSynthesis.cancel();
    if (currentIndex < paragraphs.length - 1) {
      setIsSpeaking(true);
      setCurrentIndex(currentIndex + 1);
    } else {
      onContinue();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f0ff",
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
          maxWidth: "800px",
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          position: "relative"
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "#2d3436", marginBottom: "20px" }}>
          📖 Republic of Bean — Introduction
        </h2>
        <div
  style={{
    fontSize: "1.1rem",
    color: "#636e72",
    lineHeight: "1.8",
    textAlign: "left",
    maxHeight: "65vh",
    overflowY: "auto",
    paddingRight: "10px"
  }}
>
  {currentIndex === paragraphs.length - 1 ? (
    <div>
      <h3><strong>Rules:</strong></h3>
      <ol>
        <li>
          <strong>Budget Limit:</strong>
          <ul>
            <li>Your team has a total budget of 14 units to allocate across all policy decisions.</li>
          </ul>
        </li>
        <li>
          <strong>Option Costs:</strong>
          <ul>
            <li>Option 1 costs 1 unit</li>
            <li>Option 2 costs 2 units</li>
            <li>Option 3 costs 3 units</li>
          </ul>
        </li>
        <li>
          <strong>Budget Management:</strong>
          <ul>
            <li>You must ensure the total cost of your chosen policies does not exceed the 14-unit budget.</li>
            <li>Balance the costs of each decision while addressing the needs of the refugees and the nation.</li>
          </ul>
        </li>
        <li>
          <strong>Policy Selection Variety:</strong>
          <ul>
            <li>You cannot choose the same option for all 7 policy areas.</li>
            <li>Ensure a mix (e.g., not all Option 1 or all Option 2).</li>
          </ul>
        </li>
        <li>
          <strong>Strategic Decision–Making:</strong>
          <ul>
            <li>Consider the pros and cons of each policy option.</li>
            <li>Your goal is to create an effective and inclusive education package within the budget.</li>
          </ul>
        </li>
      </ol>
    </div>
  ) : (
    <p>{paragraphs[currentIndex]}</p>
  )}
</div>



        <div style={{ marginTop: "40px" }}>
          <button
            onClick={handleContinue}
            disabled={isSpeaking}
            style={{
              backgroundColor: isSpeaking ? "#dfe6e9" : "#6c5ce7",
              color: isSpeaking ? "#999" : "#fff",
              padding: "14px 28px",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              borderRadius: "8px",
              cursor: isSpeaking ? "not-allowed" : "pointer",
              boxShadow: isSpeaking ? "none" : "0 4px 12px rgba(108, 92, 231, 0.4)",
              transition: "all 0.3s ease"
            }}
          >
            {currentIndex === paragraphs.length - 1 ? "Start" : "➡ Continue"}
          </button>
        </div>

        <button
          onClick={handleSkip}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "transparent",
            color: "#888",
            border: "none",
            fontSize: "14px",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Skip ⏭
        </button>
      </div>
    </div>
  );
}

export default StoryScene;
