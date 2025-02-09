import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import PageHeader from "../components/PageHeader";
import { FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

const JobDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Replace this with actual user ID from your auth system
  const userId = "iy444f0_wa";

  useEffect(() => {
    if (location.state?.data) {
      const foundJob = location.state.data.find((job) => job.id === id);
      if (foundJob) {
        setJob(foundJob);
        return;
      }
    }

    fetch(`http://localhost:5858/v1/jobs/get/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch((error) => {
        console.error("Error fetching job details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load job details. Please try again later.",
        });
      });
  }, [id, location.state]);

  const handleApply = async () => {
    // Check if user is logged in
    if (!userId) {
      await Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to apply for this job.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5858/v1/applications/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            job_id: id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      await Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: "Your application has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      await Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <PageHeader title={"Job Details"} path={"job details"} />

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          {job.company_logo && (
            <img
              src={job.company_logo}
              alt={job.company_name}
              className="w-20 h-20 object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{job.job_title}</h1>
            <h2 className="text-xl text-gray-600">{job.company_name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {job.job_location && (
            <div className="flex items-center gap-2">
              <FiMapPin className="text-blue-600" />
              <span>{job.job_location}</span>
            </div>
          )}
          {job.employment_type && (
            <div className="flex items-center gap-2">
              <FiClock className="text-blue-600" />
              <span>{job.employment_type}</span>
            </div>
          )}
          {job.min_salary && job.max_salary && (
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-blue-600" />
              <span>{`$${job.min_salary / 1000}k - $${
                job.max_salary / 1000
              }k ${job.salary_type}`}</span>
            </div>
          )}
        </div>

        {job.description && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {job.description}
            </p>
          </div>
        )}

        {job.required_skills && job.required_skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.required_skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          className={`bg-blue px-8 py-3 text-white rounded-lg hover:bg-blue-700
                     transition-all duration-300 w-full md:w-auto ${
                       isLoading ? "opacity-50 cursor-not-allowed" : ""
                     }`}
          onClick={handleApply}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
              Applying...
            </div>
          ) : (
            "Apply Now"
          )}
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
