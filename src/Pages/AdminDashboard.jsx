import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// New ApplicationModal Component
const ApplicationModal = ({
  applications,
  job,
  onClose,
  handleApplicationStatus,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Applications for {job.job_title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {applications.length === 0 ? (
          <p className="text-center text-gray-500">No applications yet</p>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">
                      Application ID: {application.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      User ID: {application.user_id}
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          application.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : application.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      onClick={() =>
                        handleApplicationStatus(application.id, "accepted")
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      onClick={() =>
                        handleApplicationStatus(application.id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
ApplicationModal.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      user_id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      job_id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    job_title: PropTypes.string.isRequired,
    company_name: PropTypes.string,
    job_location: PropTypes.string,
    employment_type: PropTypes.string,
    min_salary: PropTypes.number,
    max_salary: PropTypes.number,
    salary_type: PropTypes.string,
    description: PropTypes.string,
    required_skills: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  handleApplicationStatus: PropTypes.func.isRequired,
};

// Default props (optional)
ApplicationModal.defaultProps = {
  applications: [],
  job: {
    required_skills: [],
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplications, setShowApplications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          fetch("http://localhost:5858/v1/jobs/all"),
          fetch("http://localhost:5858/v1/applications/user/"),
        ]);

        if (!jobsResponse.ok || !applicationsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [jobsData, applicationsData] = await Promise.all([
          jobsResponse.json(),
          applicationsResponse.json(),
        ]);

        setJobs(jobsData.data);
        setApplications(applicationsData.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5858/v1/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (response.ok) {
        setApplications(
          applications.map((app) =>
            app.id === applicationId ? { ...app, status } : app,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const getApplicationsForJob = (jobId) => {
    return applications.filter((app) => app.job_id === jobId);
  };

  const getApplicationsCountForJob = (jobId) => {
    return getApplicationsForJob(jobId).length;
  };

  const getTotalApplicationsCount = () => {
    return applications.length;
  };

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    setShowApplications(true);
  };

  const handleDelete = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:5858/v1/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setJobs(jobs.filter((job) => job.id !== jobId));
      }
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex flex-col">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Total Jobs Posted</h2>
            <p className="text-3xl font-bold">{jobs.length}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Active Jobs</h2>
            <p className="text-3xl font-bold">{jobs.length}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Total Applications</h2>
            <p className="text-3xl font-bold">{getTotalApplicationsCount()}</p>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Posted Jobs</h2>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => navigate("/post-job")}
            >
              Post New Job
            </button>
          </div>

          <div className="p-4">
            {jobs.length === 0 ? (
              <p className="text-center text-gray-500">No jobs posted yet</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {job.job_title}
                        </h3>
                        <p className="text-gray-600">{job.company_name}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Location: {job.job_location}</p>
                          <p>Employment Type: {job.employment_type}</p>
                          <p>
                            Salary Range: ${job.min_salary} - ${job.max_salary}{" "}
                            ({job.salary_type})
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                          onClick={() => handleViewApplications(job)}
                        >
                          View Applications (
                          {getApplicationsCountForJob(job.id)})
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => navigate(`/edit-job/${job.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={() => handleDelete(job.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-700">{job.description}</p>
                    </div>
                    <div className="mt-3">
                      {job.required_skills && (
                        <div className="flex flex-wrap gap-2">
                          {job.required_skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-sm rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showApplications && selectedJob && (
        <ApplicationModal
          applications={getApplicationsForJob(selectedJob.id)}
          job={selectedJob}
          onClose={() => {
            setShowApplications(false);
            setSelectedJob(null);
          }}
          handleApplicationStatus={handleApplicationStatus}
        />
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
