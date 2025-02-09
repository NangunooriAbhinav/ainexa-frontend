import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

const Card = ({ data }) => {
  const {
    id,
    company_name,
    company_logo,
    job_title,
    min_salary,
    max_salary,
    salary_type,
    job_location,
    employment_type,
    description,
    required_skills,
  } = data;

  return (
    <section className="card">
      <Link
        to={`/job/${id}`}
        state={{ data: [data] }}
        className="flex gap-4 flex-col sm:flex-row items-start"
      >
        <img
          src={company_logo || "/default-company-logo.png"}
          alt={company_name}
          className="w-20 h-20 object-contain"
        />
        <div>
          <h4 className="text-primary mb-1">{company_name}</h4>
          <h3 className="text-lg font-semibold mb-2">{job_title}</h3>

          <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
            {job_location && (
              <span className="flex items-center gap-2">
                <FiMapPin />
                {job_location}
              </span>
            )}
            {employment_type && (
              <span className="flex items-center gap-2">
                <FiClock />
                {employment_type}
              </span>
            )}
            {min_salary && max_salary && (
              <span className="flex items-center gap-2">
                <FiDollarSign />
                {min_salary / 1000}-{max_salary / 1000}k {salary_type}
              </span>
            )}
          </div>

          {required_skills && (
            <div className="flex flex-wrap gap-2 mb-2">
              {required_skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {description && (
            <p className="text-base text-primary/70">
              {description.slice(0, 150)}
              {description.length > 150 ? "..." : ""}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-4">
        <Link
          to={`/job/${id}`}
          className="block text-center bg-blue text-white font-medium py-2 px-4 rounded-lg
                    transition-all duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
        >
          Apply Now
        </Link>
      </div>
    </section>
  );
};

Card.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    company_name: PropTypes.string.isRequired,
    company_logo: PropTypes.string,
    job_title: PropTypes.string.isRequired,
    min_salary: PropTypes.number,
    max_salary: PropTypes.number,
    salary_type: PropTypes.string,
    job_location: PropTypes.string,
    employment_type: PropTypes.string,
    description: PropTypes.string,
    required_skills: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Card;
