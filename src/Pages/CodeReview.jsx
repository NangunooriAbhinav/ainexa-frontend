import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaRobot } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";

const CodeReview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [codeReview, setCodeReview] = useState(null);
  const [error, setError] = useState(null);

  // Sample submitted code (In real app, this would come from props or context)
  const submittedCode = `
function calculateTotal(items) {
  let total = 0;
  for(let i=0; i<items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

  // Simulate AI review generation
  const generateAIReview = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real application, this would be an API call to your AI service
      // For demo, using setTimeout to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAIReview = {
        overallAssessment:
          "The code is functional but has room for improvement.",
        suggestions: [
          {
            id: 1,
            type: "Performance",
            suggestion:
              "Consider using reduce() method instead of for loop for better readability and functional approach.",
            improvedCode: `function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}`,
          },
          {
            id: 2,
            type: "Error Handling",
            suggestion:
              "Add input validation to handle null/undefined items array and invalid price values.",
            improvedCode: `function calculateTotal(items) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }
  return items.reduce((total, item) => {
    if (!item?.price || typeof item.price !== 'number') {
      throw new Error('Invalid item price');
    }
    return total + item.price;
  }, 0);
}`,
          },
        ],
        codeQualityMetrics: {
          complexity: "Low",
          maintainability: "Medium",
          reliability: "Medium",
          security: "Medium",
        },
      };

      setCodeReview(mockAIReview);
    } catch (err) {
      setError("Failed to generate code review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateAIReview();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <FaRobot className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold">AI Code Review</h1>
      </div>

      {/* Original Code Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Submitted Code</h2>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language="javascript"
            style={tomorrow}
            showLineNumbers={true}
          >
            {submittedCode}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* AI Review Section */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <BiLoaderAlt className="animate-spin text-4xl text-blue-600" />
          <span className="ml-2">Generating AI Review...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : (
        codeReview && (
          <div className="space-y-8">
            {/* Overall Assessment */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Overall Assessment</h2>
              <p className="text-gray-700">{codeReview.overallAssessment}</p>
            </div>

            {/* Code Quality Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Code Quality Metrics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(codeReview.codeQualityMetrics).map(
                  ([metric, value]) => (
                    <div key={metric} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600 capitalize">{metric}</p>
                      <p className="font-semibold text-lg">{value}</p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Suggestions for Improvement
              </h2>
              <div className="space-y-6">
                {codeReview.suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="border-b pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {suggestion.type}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {suggestion.suggestion}
                    </p>
                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                      <SyntaxHighlighter
                        language="javascript"
                        style={tomorrow}
                        showLineNumbers={true}
                      >
                        {suggestion.improvedCode}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CodeReview;
