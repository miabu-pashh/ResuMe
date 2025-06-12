import axios from "axios";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function callGeminiAPI(prompt) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  try {
    console.log("🛠️ Prompt Sent to Gemini:\n"); // 🔍 log the prompt

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("📩 Gemini API Response:\n"); // 🔍 log the response

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("📩 Raw Gemini Response:\n", raw); // 🔍 log the raw response

    // 🧹 Clean and parse JSON safely
    let cleaned = raw.replace(/```json|```/g, "").trim();
    // HEAL JSON: escape unescaped backslashes for JSON safety!
    cleaned = cleaned.replace(/([^\\])\\(?![\\nt"\/bfru])/g, "$1\\\\");

    // console.log("cleaned data", cleaned);
    let parsed = {};
    try {
      parsed = JSON.parse(cleaned);
      console.log("📩 parsed Gemini Response:\n", parsed); // 🔍 log the cleaned response
    } catch (err) {
      console.error("❌ JSON Parse Error:", err);
      console.error("❓ Problematic Response:\n", cleaned); // 🧪 help spot what's wrong
      throw new Error("Failed to parse Gemini JSON response");
    }

    return {
      summaryLatex: parsed.summaryLatex || "",
      skillsLatex: parsed.skillsLatex || "",
      metlifeLatex: parsed.metlifeLatex || "",
      adonsLatex: parsed.adonsLatex || "",
      changes: parsed.changes || "", // added changes field
      coverLetter: parsed.coverLetter || "",
      coldEmail: parsed.coldEmail || "",
      FinalResumeLatex: parsed.FinalResumeLatex || "",
    };
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    alert(
      "Gemini API Error: " +
        JSON.stringify(error.response?.data || error.message)
    );
    return {
      summaryLatex: "",
      skillsLatex: "",
      metlifeLatex: "",
      adonsLatex: "",
      changes: "", // added changes field
      coverLetter: "",
      coldEmail: "",
      FinalResumeLatex: "",
      // analysis: "", // fallback in case ATS fails
    };
  }
}

export async function callGeminiATSAPI(prompt) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err);
      console.error("❓ Problematic Response:\n", cleaned);
      throw new Error("Failed to parse Gemini JSON response");
    }

    return {
      atsScore: parsed.atsScore || "N/A",
      gaps: parsed.gaps || [],
      improvements: parsed.improvements || [],
      summary: parsed.summary || "",
    };
  } catch (error) {
    console.error(
      "Gemini ATS API Error:",
      error.response?.data || error.message
    );
    return {
      atsScore: "N/A",
      gaps: [],
      improvements: [],
      summary: "",
    };
  }
}

export async function callGeminiAPIforJD(prompt) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  try {
    console.log("🛠️ Prompt Sent to Gemini:\n", prompt); // 🔍 log the prompt

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    // console.log("📩 Raw Gemini Response:\n", raw); // 🔍 log the raw response

    const cleaned = raw.replace(/```json|```/g, "").trim();
    console.log("📩 Cleaned Gemini Response:\n", cleaned); // 🔍 log the cleaned response
    let parsed = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err);
      console.error("❓ Problematic Response:\n", cleaned);
      throw new Error("Failed to parse Gemini JSON response");
    }

    return {
      result: parsed.result || cleaned,
    };
  } catch (error) {
    console.error(
      "Gemini ATS API Error:",
      error.response?.data || error.message
    );
    return {
      result: "",
    };
  }
}

export async function callGeminiAPIForLinkedInMessage(prompt) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  try {
    console.log("🛠️ Prompt Sent to Gemini:\n", prompt); // 🔍 log the prompt
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed = {};
    try {
      parsed = JSON.parse(cleaned);
      console.log("📩 Cleaned Gemini Response:\n", cleaned); // 🔍 log the cleaned response
    } catch (err) {
      console.error("❌ LinkedIn Message JSON Parse Error:", err);
      console.error("❓ Problematic Response:\n", cleaned);
      throw new Error("Failed to parse LinkedIn Message response");
    }

    return {
      linkedinMessage: parsed.linkedinMessage || "",
    };
  } catch (error) {
    console.error(
      "Gemini LinkedIn API Error:",
      error.response?.data || error.message
    );
    return {
      linkedinMessage: "",
    };
  }
}

export async function callGeminiAPIForCoverLetterUpdate(prompt) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  console.log("🛠️ The api handler functions is triggered"); // 🔍 log the prompt
  console.log("🛠️ Prompt Sent to Gemini:\n", prompt); // 🔍 log the prompt

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("📩 Updated Cover Letter Response:\n", raw);

    return { updatedCoverLetter: raw };
  } catch (error) {
    console.error(
      "❌ Gemini Cover Letter API Error:",
      error.response?.data || error.message
    );
    return { updatedCoverLetter: "Error generating updated cover letter." };
  }
}
