import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiDollarSign, FiMapPin } from "react-icons/fi";

const MyJobs = () => {
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Replace with actual user ID from auth
  const userId = "iy444f0_wa";

  useEffect(() => {
    const fetchApplicationsAndJobs = async () => {
      setIsLoading(true);
      try {
        // Fetch applications
        const applicationsResponse = await fetch(
          `http://localhost:5858/v1/applications/user/`,
        );
        const applicationsData = await applicationsResponse.json();

        if (applicationsData.success) {
          setApplications(applicationsData.data);

          // Get unique job IDs
          const uniqueJobIds = [
            ...new Set(applicationsData.data.map((app) => app.job_id)),
          ];

          // Fetch job details for each unique job ID
          const jobDetailsPromises = uniqueJobIds.map((jobId) =>
            fetch(`http://localhost:5858/v1/jobs/get/${jobId}`).then((res) =>
              res.json(),
            ),
          );

          const jobDetailsResults = await Promise.all(jobDetailsPromises);

          // Create a map of job details
          const jobDetailsMap = {};
          jobDetailsResults.forEach((response, index) => {
            if (response.success && response.data.length > 0) {
              jobDetailsMap[uniqueJobIds[index]] = response.data[0];
            }
          });

          setJobDetails(jobDetailsMap);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationsAndJobs();
  }, [userId]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = applications.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const nextPage = () => {
    if (indexOfLastItem < applications.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="my-jobs-container">
        <h1 className="text-center p-4 text-2xl font-bold">My Applications</h1>
      </div>

      <section className="py-1 bg-blueGray-50">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-5">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="block w-full overflow-x-auto">
              <table className="items-center bg-transparent w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Job Details
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Status
                    </th>
                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        Loading...
                      </td>
                    </tr>
                  ) : currentApplications.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No applications found.
                      </td>
                    </tr>
                  ) : (
                    currentApplications.map((application) => {
                      const job = jobDetails[application.job_id];
                      return (
                        <tr key={application.id}>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4">
                            {job ? (
                              <div className="flex items-start space-x-4">
                                <img
                                  src={
                                    job.company_logo ||
                                    "/default-company-logo.png"
                                  }
                                  alt={job.company_name}
                                  className="w-12 h-12 object-contain"
                                />
                                <div>
                                  <h3 className="font-semibold">
                                    {job.job_title}
                                  </h3>
                                  <p className="text-gray-600">
                                    {job.company_name}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    {job.job_location && (
                                      <span className="flex items-center gap-1">
                                        <FiMapPin className="text-blue-500" />
                                        {job.job_location}
                                      </span>
                                    )}
                                    {job.min_salary && job.max_salary && (
                                      <span className="flex items-center gap-1">
                                        <FiDollarSign className="text-blue-500" />
                                        ${job.min_salary / 1000}k-$
                                        {job.max_salary / 1000}k
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              "Loading job details..."
                            )}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                application.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : application.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm p-4">
                            <Link
                              to={`/job/${application.job_id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {applications.length > itemsPerPage && (
          <div className="flex justify-center gap-4 mb-8">
            {currentPage > 1 && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={prevPage}
              >
                Previous
              </button>
            )}
            {indexOfLastItem < applications.length && (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={nextPage}
              >
                Next
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyJobs;
