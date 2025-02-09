import React from "react";
import FailPage from "./FailPage";

const CandidateFail = () => {
  const job = {
    id: "123",
    companyName: "TechCorp",
    jobTitle: "Frontend Developer",
    jobLocation: "Remote",
    employmentType: "Full-time",
  };

  return <FailPage job={job} />;
};

export default CandidateFail;
