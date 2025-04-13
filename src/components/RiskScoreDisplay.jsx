// components/RiskScoreDisplay.jsx
"use client";

import { useState, useEffect } from "react";

export default function RiskScoreDisplay({ username }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/riskScore?username=${username}`);
        const data = await res.json();
        if (res.ok) {
          // The risk score should now be a number between 0 and 100.
          setAnalysis(data.finalAnalysis);
        } else {
          setError(data.error || "Failed to fetch analysis");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [username]);

  if (loading) return <div className="text-white">Loading risk analysis...</div>;
  if (error) return <div className="text-white">Error: {error}</div>;

  return (
    <div className="risk-analysis max-w-screen-2xl mx-auto text-white">
      <h2>Final Risk Analysis</h2>
      <pre>{analysis}</pre>
    </div>
  );
}
