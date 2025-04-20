import { agents } from "./agents";

const allCategories = [
  "Access to Education",
  "Language Instruction",
  "Teacher Training",
  "Curriculum Adaptation",
  "Psychosocial Support",
  "Financial Support",
  "Certification Accreditation"
];

// AI logic for policy scoring (based on ideology)
function chooseOption(agent, category) {
  const { ideology } = agent;

  // Sample heuristic: the more equity-oriented, the more likely to pick higher cost
  const weights = {
    "Justice-Oriented": [0.1, 0.3, 0.6],
    "Equity-Focused": [0.2, 0.3, 0.5],
    "Budget-Conscious": [0.6, 0.3, 0.1],
    "Practical Solutions": [0.4, 0.4, 0.2]
  };

  const options = [1, 2, 3];
  const probs = weights[ideology] || [0.3, 0.4, 0.3];

  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < probs.length; i++) {
    sum += probs[i];
    if (rand < sum) return options[i];
  }

  return 1; // fallback
}

// Pick 7 options staying under 14 units
export function generateAgentPolicy(agent) {
  const policy = {};
  let budgetUsed = 0;

  for (let category of allCategories) {
    const remaining = 14 - budgetUsed;
    const choice = chooseOption(agent, category);

    if (choice + budgetUsed <= 14) {
      policy[category] = { option: choice, cost: choice };
      budgetUsed += choice;
    } else {
      // fallback to cheapest
      policy[category] = { option: 1, cost: 1 };
      budgetUsed += 1;
    }
  }

  return { agentId: agent.id, selections: policy, budgetUsed };
}

// Generate all agents' decisions
export function generateAllAgentPolicies() {
  return agents.map((agent) => ({
    ...agent,
    ...generateAgentPolicy(agent)
  }));
}
