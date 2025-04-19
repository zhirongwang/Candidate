import React from "react";
import Candidate from "./Candidate";

const CandidateList = ({ candidates, selectSkilles }) => {
  return (
    <div>
      {candidates.map((candidate, index) => (
        <Candidate
          key={index}
          candidate={candidate}
          selectSkilles={selectSkilles}
        /> // Render 5 Candidate components
      ))}
    </div>
  );
};

export default CandidateList;
