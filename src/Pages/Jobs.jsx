import React from "react";

import PropTypes from "prop-types";

const Jobs = ({ result }) => {
  return (
    <>
      <div>
        <h3 className="text-lg font-bold mb-2">{result.length} Jobs</h3>
      </div>
      <section>{result}</section>
    </>
  );
};

// **Define PropTypes**
Jobs.propTypes = {
  result: PropTypes.array.isRequired,
};

export default Jobs;
