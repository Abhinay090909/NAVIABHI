export function generateJustification(agent, category, option) {
    const { ideology, occupation } = agent;
  
    const optionLabels = {
      1: "the basic option",
      2: "a balanced option",
      3: "the most comprehensive option"
    };
  
    const themes = {
      "Justice-Oriented": {
        start: "I believe justice requires bold investment.",
        explain: (cat) => `This is why I chose ${optionLabels[option]} for ${cat.toLowerCase()}, to uplift those most affected.`
      },
      "Equity-Focused": {
        start: "Equity is non-negotiable in policy-making.",
        explain: (cat) => `I selected ${optionLabels[option]} for ${cat.toLowerCase()} to ensure no one is left behind.`
      },
      "Budget-Conscious": {
        start: "As someone focused on sustainability,",
        explain: (cat) => `I went with ${optionLabels[option]} for ${cat.toLowerCase()} to stay within our financial limits.`
      },
      "Practical Solutions": {
        start: "I value realistic implementation.",
        explain: (cat) => `That’s why I picked ${optionLabels[option]} for ${cat.toLowerCase()}; it’s what works on the ground.`
      }
    };
  
    const defaultTheme = {
      start: "I made this choice based on my experience.",
      explain: (cat) => `I believe ${optionLabels[option]} is the most appropriate for ${cat.toLowerCase()}.`
    };
  
    const tone = themes[ideology] || defaultTheme;
  
    return `As a ${occupation}, ${tone.start} ${tone.explain(category)}`;
  }
  