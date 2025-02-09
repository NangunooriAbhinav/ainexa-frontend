import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";

const FailPage = ({ job }) => {
  console.log(job);
  if (!job) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <FiXCircle className="text-red-500 text-6xl mb-4" />{" "}
      {/* Changed color to red */}
      <h1 className="text-3xl font-bold text-gray-800">
        Oops, something went wrong!
      </h1>
      <p className="text-gray-600 mt-2">
        Unfortunately, we couldnt complete the process for the job at{" "}
        <span className="font-semibold">{job.companyName}</span> 😔
      </p>
      {/* Job Info */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full">
        <h2 className="text-lg font-semibold text-gray-700">{job.jobTitle}</h2>
        <p className="text-gray-500">{job.companyName}</p>
        <p className="text-gray-500">
          {job.jobLocation} • {job.employmentType}
        </p>
      </div>
      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <Link
          to={`/offer/${job.id}`}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          View Offer
        </Link>
        <Link
          to="/jobs"
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
        >
          Back to Jobs
        </Link>
      </div>
    </div>
  );
};

// **Define PropTypes**
FailPage.propTypes = {
  job: PropTypes.object.isRequired,
};

export default FailPage;
