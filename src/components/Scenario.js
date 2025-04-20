// ✅ Scenario.js (Updated to store participantInfo correctly)
import React, { useState } from "react";
import UserInfoForm from "./UserInfoForm";

//import ParticipantInfoForm from "./ParticipantInfoForm";
import StoryScene from "./StoryScene";
import PolicySelector from "./PolicySelector";
import GroupDiscussion from "./GroupDiscussion";
import ReflectionScreen from "./ReflectionScreen";
import FadeScreen from "./FadeScreen";

function Scenario() {
  const [step, setStep] = useState(1);
  const [participantInfo, setParticipantInfo] = useState(null);
  const [userPolicy, setUserPolicy] = useState({});
  const [finalPolicyPackage, setFinalPolicyPackage] = useState({});
  const [policies, setPolicies] = useState([]);

  const handleInfoSubmit = (info) => {
    setParticipantInfo(info);
    setStep(2);
  };

  const handlePolicySubmit = (selections, budget) => {
    setUserPolicy({ selections, budget });
    setPolicies([{ agentId: "realPlayer", name: "You", selections }]);
    setStep(4);
  };

  const handleDiscussionComplete = (votes) => {
    setFinalPolicyPackage(votes);
    setStep(5);
  };

  return (
    <>
      {step === 1 && (
        <FadeScreen>
          <UserInfoForm onSubmit={handleInfoSubmit} />
        </FadeScreen>
      )}
      {step === 2 && (
        <FadeScreen>
          <StoryScene onContinue={() => setStep(3)} />
        </FadeScreen>
      )}
      {step === 3 && (
        <FadeScreen>
          <PolicySelector onSubmit={handlePolicySubmit} />
        </FadeScreen>
      )}
      {step === 4 && (
        <FadeScreen>
          <GroupDiscussion
            policies={policies}
            onVoteComplete={handleDiscussionComplete}
          />
        </FadeScreen>
      )}
      {step === 5 && (
        <FadeScreen>
          <ReflectionScreen
            userPolicy={userPolicy}
            finalPolicyPackage={finalPolicyPackage}
            participantInfo={participantInfo}
          />
        </FadeScreen>
      )}
    </>
  );
}

export default Scenario;
