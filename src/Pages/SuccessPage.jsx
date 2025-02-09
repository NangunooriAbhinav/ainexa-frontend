import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const SuccessPage = ({ job }) => {
  console.log(job);
  if (!job) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-8 max-w-lg text-center"
      >
        <FiCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Congratulations!</h1>
        <p className="text-gray-600 mt-2">
          You have successfully posted a job at{" "}
          <span className="font-semibold">{job.company_name}</span> 🎉
        </p>

        {/* Job Info */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full">
          <h2 className="text-lg font-semibold text-gray-700">
            {job.job_title}
          </h2>
          <p className="text-gray-500">{job.company_name}</p>
          <p className="text-gray-500">
            {job.job_location} • {job.employment_type}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <Link
            to={`/`}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            View Offer
          </Link>
          <Link
            to="/"
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            Back to Jobs
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// **Define PropTypes**
SuccessPage.propTypes = {
  job: PropTypes.object.isRequired,
};

export default SuccessPage;
