import React, { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/CoverLetterPage.css";
import html2pdf from "html2pdf.js";

function CoverLetterPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const original = state?.template || "";
  const updated = state?.updated || "";

  const editableRef = useRef();

  const handleCopy = () => {
    const html = editableRef.current.innerText;
    navigator.clipboard.writeText(html).then(() => {
      alert("Cover letter copied to clipboard!");
    });
  };

  const handleDownloadPDF = () => {
    const element = editableRef.current;
    const opt = {
      margin: 0.5,
      filename: `CoverLetter.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="cover-page">
      <header className="cover-header">
        <h1>📝 Tailored Cover Letter</h1>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </header>

      <div className="cover-grid">
        <div className="cover-box">
          <h3>📄 Original Template</h3>
          <textarea readOnly value={original} />
        </div>

        <div className="cover-box">
          <h3>✅ Updated Cover Letter</h3>
          <div
            ref={editableRef}
            className="cover-letter-output"
            contentEditable={true}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{
              __html: updated
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\n/g, "<br>"),
            }}
          />
          <div className="action-buttons">
            <button onClick={handleCopy}>📋 Copy</button>
            <button onClick={handleDownloadPDF}>💾 Save as PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverLetterPage;
