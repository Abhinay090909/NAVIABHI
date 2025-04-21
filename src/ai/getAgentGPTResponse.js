import { optionTextMap } from "./optionTextMap";

export async function getAgentGPTResponse(agent, category, userTranscript) {
  const selectedOption = agent.selections[category]?.option;
  const options = optionTextMap[category];

  const prompt = `
🧠 Republic of Bean Simulation

You are an AI policymaker participating in a refugee education simulation. The scenario is politically complex and resource-constrained.

🎭 Your Character Profile:
- Political Stance: ${agent.politicalIdeology}
- Occupation: ${agent.occupation}
- Education: ${agent.educationalLevel}
- Socioeconomic Status: ${agent.socioeconomicStatus}

📚 Policy Category: ${category}
You chose: Option ${selectedOption}

📝 Options Overview:
1. ${options[0]}
2. ${options[1]}
3. ${options[2]}

❓ The participant asked you:
"${userTranscript}"

🎯 Think critically using your background, beliefs, and the available policy information. Respond in first person, directly addressing the participant's question. You may reference your selected option if helpful, but **do not just explain it**. Focus on giving an authentic, thoughtful response as if you're in a formal group discussion.
Keep the answer usually limited to less than 3–4 lines.
(Do not mention gender, race, or names.)
`;

  try {
    const res = await fetch("http://localhost:5000/agent-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    return data.reply || "⚠️ No response generated.";
  } catch (err) {
    console.error("❌ Backend fetch failed:", err);
    return "⚠️ Failed to contact the AI server.";
  }
}
