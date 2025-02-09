import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { useNavigate } from "react-router-dom";

const inputStyles =
  "block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
const labelStyles = "block mb-2 text-sm font-medium text-gray-700";

const CreateJob = () => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Format the data according to the API structure
    const formattedData = {
      company_name: data.companyName,
      job_title: data.jobTitle,
      company_logo: data.companyLogo,
      min_salary: parseInt(data.minPrice),
      max_salary: parseInt(data.maxPrice),
      salary_type: data.salaryType.toLowerCase(),
      job_location: data.jobLocation,
      experience_level: data.experienceLevel.toLowerCase(),
      employment_type: data.employmentType.toLowerCase(),
      description: data.description,
      required_skills: selectedSkills
        ? selectedSkills.map((skill) => skill.value)
        : [],
      project_id: data.projectId, // You might want to add this field to your form
    };

    fetch("http://localhost:5858/v1/jobs/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        navigate("/selected", { state: { job: formattedData } });
        reset();
        setSelectedSkills(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to post job");
      });
  };

  const skillOptions = [
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "PostgreSQL", label: "PostgreSQL" },
    { value: "AWS", label: "AWS" },
    { value: "Docker", label: "Docker" },
    { value: "GraphQL", label: "GraphQL" },
    { value: "System Design", label: "System Design" },
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen flex">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Job</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Company and Job Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Company Name</label>
                <input
                  type="text"
                  {...register("companyName", { required: true })}
                  className={inputStyles}
                  placeholder="Ex: TechCorp Solutions"
                />
                {errors.companyName && (
                  <span className="text-red-500 text-sm">
                    This field is required
                  </span>
                )}
              </div>
              <div>
                <label className={labelStyles}>Job Title</label>
                <input
                  type="text"
                  {...register("jobTitle", { required: true })}
                  className={inputStyles}
                  placeholder="Ex: Senior Full Stack Developer"
                />
                {errors.jobTitle && (
                  <span className="text-red-500 text-sm">
                    This field is required
                  </span>
                )}
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelStyles}>Minimum Salary</label>
                <input
                  type="number"
                  {...register("minPrice", { required: true })}
                  className={inputStyles}
                  placeholder="Ex: 120000"
                />
              </div>
              <div>
                <label className={labelStyles}>Maximum Salary</label>
                <input
                  type="number"
                  {...register("maxPrice", { required: true })}
                  className={inputStyles}
                  placeholder="Ex: 180000"
                />
              </div>
              <div>
                <label className={labelStyles}>Salary Type</label>
                <select
                  {...register("salaryType", { required: true })}
                  className={inputStyles}
                >
                  <option value="annual">Annual</option>
                  <option value="monthly">Monthly</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
            </div>

            {/* Location and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Job Location</label>
                <input
                  type="text"
                  {...register("jobLocation", { required: true })}
                  className={inputStyles}
                  placeholder="Ex: San Francisco, CA (Hybrid)"
                />
              </div>
              <div>
                <label className={labelStyles}>Experience Level</label>
                <select
                  {...register("experienceLevel", { required: true })}
                  className={inputStyles}
                >
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>

            {/* Employment Type and Logo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyles}>Employment Type</label>
                <select
                  {...register("employmentType", { required: true })}
                  className={inputStyles}
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className={labelStyles}>Company Logo URL</label>
                <input
                  type="url"
                  {...register("companyLogo")}
                  className={inputStyles}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label className={labelStyles}>Required Skills</label>
              <CreatableSelect
                isMulti
                options={skillOptions}
                value={selectedSkills}
                onChange={setSelectedSkills}
                className="border border-gray-300 rounded-md"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                  }),
                }}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelStyles}>Job Description</label>
              <textarea
                {...register("description", { required: true })}
                rows={6}
                className={inputStyles}
                placeholder="Enter detailed job description..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Create Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
