import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SuccessPage from "./SuccessPage";

const CandidateSuccess = () => {
  const location = useLocation();
  const job = location.state?.job;
  return <SuccessPage job={job} />;
};

export default CandidateSuccess;
