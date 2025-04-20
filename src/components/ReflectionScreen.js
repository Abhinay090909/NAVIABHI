import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generateOpenRouterSummary } from "../ai/generateOpenRouterSummary";

const questions = [
  "What emotions came up for you during the decision-making process—discomfort, frustration, detachment, guilt? What do those feelings reveal about your position in relation to refugee education?",
  "Did anything about your role in the game feel familiar—either from your personal or professional life? If so, how?",
  "What assumptions about refugees, policy, or education were challenged or reinforced during the game?",
  "How did the group dynamics impact your ability to advocate for certain policies? Were there moments when you chose silence or compromise? Why?",
  "Has your understanding of refugee education shifted from seeing it as a service “for them” to a system embedded in broader struggles over power, identity, and justice? If so, how?",
  "Whose interests did your decisions ultimately serve—refugees, citizens, or the state? Why?",
  "What power did you assume you had as a policymaker—and who did you imagine was absent or voiceless in that process?",
  "What compromises did you make for the sake of consensus, and who or what got erased in the process?",
  "How did the structure of the game (budget, options, scenario) shape or limit your imagination of justice?",
  "If refugee education wasn't about inclusion into existing systems—but about transforming those systems—what would that look like, and did your decisions move toward or away from that?"
];

const optionTextMap = {
  "Access to Education": [
    "Limit access to education for refugees to only emergency literacy programs managed by NGOs.",
    "Establish separate schools for refugees with reduced curriculum focused on integration.",
    "Provide equal access to national schools and curriculum for refugees and citizens alike."
  ],
  "Language Instruction": [
    "Maintain the current policy of teaching only Teanish, requiring all refugees to adapt.",
    "Provide primary Teanish language courses to refugees in parallel to core subjects.",
    "Implement comprehensive bilingual education programs supporting both refugee and local languages."
  ],
  "Teacher Training": [
    "Provide minimal or no specific training to teachers working with refugee populations.",
    "Offer basic training sessions focused on trauma awareness and classroom diversity.",
    "Implement comprehensive and ongoing training programs tailored to inclusive pedagogy."
  ],
  "Curriculum Adaptation": [
    "Maintain the existing national curriculum without changes or supplemental materials.",
    "Introduce supplementary materials that reflect refugee experiences and cultural heritage.",
    "Adapt the national curriculum to incorporate diverse histories, cultures, and migration narratives."
  ],
  "Psychosocial Support": [
    "Provide limited or no specific psychosocial support in schools.",
    "Establish basic support services with referrals to external specialists.",
    "Develop comprehensive and specialized psychosocial support embedded in the school system."
  ],
  "Financial Support": [
    "Allocate minimal funds and rely heavily on donor and NGO contributions.",
    "Increase financial support to partially subsidize refugee education costs.",
    "Allocate significant financial resources to fully integrate and sustain refugee-inclusive policies."
  ],
  "Certification Accreditation": [
    "Only recognize education from Republic of Bean schools; others are invalid.",
    "Establish comprehensive evaluation and recognition systems for foreign certificates.",
    "Develop tailored programs that merge local and refugee qualifications with equivalency paths."
  ]
};

function ReflectionScreen({ userPolicy, finalPolicyPackage, participantInfo }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleVoiceInput = (index) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleChange(index, answers[index] + " " + transcript);
    };

    recognition.onerror = (event) => {
      alert("Speech recognition error: " + event.error);
    };

    recognition.start();
  };

  const generatePDFBlob = (summaryText) => {
    const doc = new jsPDF();
    const now = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text("CHALLENGE Evaluation Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${now}`, 14, 28);

    if (participantInfo) {
      doc.setFont("helvetica", "bold");
      doc.text("Participant Info:", 14, 38);
      doc.setFont("helvetica", "normal");
      const infoLines = [
        `Age: ${participantInfo.age || "-"}`,
        `Nationality: ${participantInfo.nationality || "-"}`,
        `Occupation: ${participantInfo.occupation || "-"}`,
        `Education: ${participantInfo.education || "-"}`,
        `Displacement: ${participantInfo.displaced || "-"}`,
        `Location: ${participantInfo.location || "-"}`
      ];
      doc.text(infoLines, 14, 46);
    }

    let summaryY = 90;
    doc.setFont("helvetica", "bold");
    doc.text("AI Summary:", 14, summaryY);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(summaryText || "(Summary unavailable)", 180);
    doc.text(summaryLines, 14, summaryY + 8);
    summaryY += 8 + summaryLines.length * 6;

    const policyY = summaryY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Participant Policy Choices:", 14, policyY);
    autoTable(doc, {
      startY: policyY + 4,
      head: [["Category", "Selected Option"]],
      body: Object.entries(userPolicy?.selections || {}).map(([cat, val]) => {
        const num = typeof val === "object" ? val.option || val.value : val;
        const text = optionTextMap[cat]?.[num - 1] || "-";
        return [cat, `Option ${num}: ${text}`];
      })
    });

    const groupStartY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Final Group Policy Package (Majority Vote):", 14, groupStartY);
    autoTable(doc, {
      startY: groupStartY + 4,
      head: [["Category", "Group Decision"]],
      body: Object.entries(finalPolicyPackage || {}).map(([category, votes]) => {
        if (!Array.isArray(votes)) return [category, `Option ${votes}`];
        const voteCounts = {};
        votes.forEach(v => {
          voteCounts[v] = (voteCounts[v] || 0) + 1;
        });
        const max = Math.max(...Object.values(voteCounts));
        const winner = Object.keys(voteCounts).find(k => voteCounts[k] === max);
        const text = optionTextMap[category]?.[winner - 1] || "-";
        return [category, `Option ${winner}: ${text}`];
      })
    });

    const reflStartY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Participant Reflections:", 14, reflStartY);
    autoTable(doc, {
      startY: reflStartY + 4,
      head: [["Reflection Question", "Participant Answer"]],
      body: questions.map((q, i) => [q, answers[i] || "(No response)"]),
      styles: { cellWidth: 'wrap', fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 90 }
      }
    });

    return doc.output("blob");
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const agentPolicies = JSON.parse(localStorage.getItem("agentPolicies") || "[]");
      const summary = await generateOpenRouterSummary(participantInfo, answers, userPolicy, agentPolicies);

      const blob = generatePDFBlob(summary);

      const formData = new FormData();
      formData.append("report", blob, "CHALLENGE_Evaluation_Report.pdf");

      await fetch("http://localhost:5000/send-report", {
        method: "POST",
        body: formData
      });

      setSubmitted(true);
    } catch (err) {
      alert("Failed to generate or send report. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Segoe UI", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        🎓 Final Reflection & Evaluation Report
      </h2>

      {!submitted ? (
        <>
          {questions.map((question, index) => (
            <div key={index} style={{ marginBottom: "25px" }}>
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>
                {question}
              </label>
              <textarea
                value={answers[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
                placeholder="Type your response here..."
              />
              <button
                onClick={() => handleVoiceInput(index)}
                style={{
                  marginTop: "6px",
                  padding: "6px 12px",
                  backgroundColor: "#0984e3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                🎤 Speak Response
              </button>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              backgroundColor: "#00cec9",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              display: "block",
              margin: "20px auto"
            }}
          >
            📄 {loading ? "Generating Report..." : "Submit & Email PDF Report"}
          </button>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h3 style={{ color: "green" }}>✅ Reflection Submitted</h3>
          <p>The evaluation report has been emailed automatically.</p>
        </div>
      )}
    </div>
  );
}

export default ReflectionScreen;