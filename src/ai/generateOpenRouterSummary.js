const OPENROUTER_API_KEY = "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";

export async function generateOpenRouterSummary(participantInfo, reflections, userPolicy, aiPolicies) {
  const reflectionText = reflections.map((r, i) => `Q${i + 1}: ${r}`).join("\n\n");

  const aiSummary = aiPolicies.map((agent) => {
    const choices = Object.entries(agent.selections || {})
      .map(([cat, val]) => `${cat}: Option ${val.option || val.value}`)
      .join("; ");
    return `Agent (${agent.politicalIdeology}, ${agent.occupation}) chose: ${choices}`;
  }).join("\n");

  const prompt = `
🧠 Generate a concise summary of the participant's engagement in the refugee education simulation.

🎓 Participant Info:
${JSON.stringify(participantInfo, null, 2)}

📊 Participant Policy Selections:
${Object.entries(userPolicy.selections || {}).map(([k, v]) => `- ${k}: Option ${v.option || v.value}`).join("\n")}

💬 Reflection Answers:
${reflectionText}

🧠 AI Agent Policy Trends:
${aiSummary}

✅ Summary Instructions:
- Describe the participant's general policy leanings (minimal, moderate, transformational).
- Analyze their values based on reflection answers.
- Identify key trends across AI agent decisions.
- Make it sound like an educator's feedback paragraph.
- Do not list questions or reveal any agent names.

Keep it concise, neutral, and thoughtful.
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // or "openrouter/cinematika-7b" if needed
        messages: [
          { role: "system", content: "You are a policy analyst summarizing education game outcomes." },
          { role: "user", content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.6
      })
    });

    const data = await response.json();
    console.log("📄 Summary API Response:", data);

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("No summary returned");

    return content;
  } catch (err) {
    console.error("❌ Failed to generate OpenRouter summary:", err);
    throw err;
  }
}
