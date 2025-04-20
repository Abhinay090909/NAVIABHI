import { optionTextMap } from "./optionTextMap";

export async function getAgentGPTResponse(agent, category, userTranscript) {
  const apiKey = "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";

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
1. ${options[1]}
2. ${options[2]}
3. ${options[3]}

❓ The participant asked you:
"${userTranscript}"

🎯 Think critically using your background, beliefs, and the available policy information. Respond in first person, directly addressing the participant's question. You may reference your selected option if helpful, but **do not just explain it**. Focus on giving an authentic, thoughtful response as if you're in a formal group discussion.
keep the answer usually limited to less than 3-4 lines.
(Do not mention gender, race, or names.)
`;



  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a refugee education policymaker in a serious deliberation exercise." },
          { role: "user", content: prompt }
        ],
        max_tokens: 350,
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("🧠 OpenRouter response:", data);

    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply || "⚠️ No response generated.";
  } catch (err) {
    console.error("❌ OpenRouter fetch failed:", err);
    return "⚠️ Failed to contact OpenRouter.";
  }
}
