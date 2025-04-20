import React, { useState } from "react";

// Screens
import StartScreen from "./components/StartScreen";
import StoryScene from "./components/StoryScene";
import PolicySelector from "./components/PolicySelector";
import GroupDiscussion from "./components/GroupDiscussion";
import VotingScreen from "./components/VotingScreen";
import ReflectionScreen from "./components/ReflectionScreen";
import ParticipantInfoForm from "./components/ParticipantInfoForm";

// AI
import { generateAllAgentPolicies } from "./ai/agentPolicyLogic";

function App() {
  const [step, setStep] = useState("start");

  const [userPolicy, setUserPolicy] = useState(null);
  const [aiPolicies] = useState(generateAllAgentPolicies());

  const [participantInfo, setParticipantInfo] = useState(null);
  const [finalPolicyPackage, setFinalPolicyPackage] = useState(null);

  return (
    <div>
      {step === "form" && (
        <ParticipantInfoForm
          onSubmit={(info) => {
            setParticipantInfo(info);
            setStep("story");
          }}
        />
      )}

      {step === "start" && (
        <StartScreen onStart={() => setStep("form")} />
      )}

      {step === "story" && (
        <StoryScene onContinue={() => setStep("policy")} />
      )}

      {step === "policy" && (
        <PolicySelector
          onSubmit={(selections, budgetUsed) => {
            const user = {
              agentId: "realPlayer",
              name: "You",
              selections,
              budgetUsed
            };
            setUserPolicy(user);
            setStep("discussion");
          }}
        />
      )}

      {step === "discussion" && (
        <GroupDiscussion
          policies={[userPolicy, ...aiPolicies]}
          onVoteComplete={() => setStep("voting")}
        />
      )}

      {step === "voting" && (
        <VotingScreen
          policies={[userPolicy, ...aiPolicies]}
          onComplete={(finalVotes) => {
            setFinalPolicyPackage(finalVotes);
            setStep("reflection");
          }}
        />
      )}

{step === "reflection" && (
  <ReflectionScreen
    userPolicy={userPolicy}
    finalPolicyPackage={finalPolicyPackage}
    participantInfo={participantInfo} // ✅ Add this line
  />
)}

    </div>
  );
}

export default App;
