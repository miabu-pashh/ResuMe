import React, { useState } from "react";
import { buildATSAnalysisPrompt, resumeTemplate } from "../utils/promptBuilder";
import { callGeminiATSAPI } from "../utils/apiHandler";

function ATSAnalysis({ jobDesc }) {
  const [resumeText, setResumeText] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    console.log("the handle analyze function is aclled in atsanalysis file");
    if (!resumeText.trim() || !jobDesc.trim()) return;

    setLoading(true);
    const prompt = buildATSAnalysisPrompt({
      resumeTemplate: resumeTemplate.full,
      jobDescription: jobDesc,
    });
    console.log("the prompt is", prompt);
    const result = await callGeminiATSAPI(prompt);
    console.log("the result from ats analysis is", result);

    setAtsScore(result.atsScore);
    setGaps(result.gaps || []);
    setImprovements(result.improvements || []);
    setSummary(result.summary || "");
    setLoading(false);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>📊 Resume vs JD - ATS Analysis</h2>
      <textarea
        rows={12}
        placeholder="Paste your LaTeX resume code here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        style={{ width: "100%", background: "#f9f9f9", marginBottom: "1rem" }}
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Run ATS Analysis"}
      </button>

      {(atsScore || gaps.length || improvements.length || summary) && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>💡 Suggestions & ATS Insights</h3>
          <div
            style={{
              background: "#e0ffe0",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>✅ ATS Score:</strong> {atsScore || "N/A"}
            </p>

            {gaps.length > 0 && (
              <>
                <h4>🚫 Gaps or Mismatches:</h4>
                <ul>
                  {gaps.map((gap, idx) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              </>
            )}

            {improvements.length > 0 && (
              <>
                <h4>🛠 Suggested Improvements:</h4>
                <ul>
                  {improvements.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </>
            )}

            {summary && (
              <>
                <h4>📝 Summary:</h4>
                <p>{summary}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ATSAnalysis;
