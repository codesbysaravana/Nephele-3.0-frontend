import React, { useState, useRef } from "react";

// Base API URL
const API_BASE = "https://nephele-wue7.onrender.com";
// Fallback audio path
const FALLBACK_AUDIO = "/5ddb4214558e4bf2baa0cb0c233c5575.mp3";

export default function Teaching() {
  const [documentFile, setDocumentFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef(null);

  const handleUploadAndTeach = async () => {
    if (!documentFile) return alert("Please select a document file to upload!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", documentFile);

      const res = await fetch(`${API_BASE}/teach_document/`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse(data);

      // Play backend audio or fallback
      if (audioRef.current) {
        audioRef.current.src = data.audio_url ? data.audio_url : FALLBACK_AUDIO;
        audioRef.current.play().catch((err) => {
          console.error("Audio play failed:", err);
          audioRef.current.src = FALLBACK_AUDIO;
          audioRef.current.play().catch((err) => console.error("Fallback audio failed:", err));
        });
      }
    } catch (err) {
      console.error(err);
      setResponse({ error: "Failed to upload and teach document" });

      if (audioRef.current) {
        audioRef.current.src = FALLBACK_AUDIO;
        audioRef.current.play().catch((err) => console.error("Fallback audio failed:", err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlayFallback = () => {
    if (audioRef.current) {
      audioRef.current.src = FALLBACK_AUDIO;
      audioRef.current.play().catch((err) => console.error("Fallback audio failed:", err));
    }
  };

  return (
    <div className="teaching-container">
      <div className="teaching-card">
        <div className="teaching-header">
          <h2 className="teaching-title">Teaching Assistant</h2>
          <p className="teaching-subtitle">Transform Documents into Engaging Audio Lessons</p>
        </div>

        <div className="upload-section">
          <input
            type="file"
            id="documentFileInput"
            accept=".pdf,.doc,.docx,.txt"
            style={{ display: "none" }}
            onChange={(e) => setDocumentFile(e.target.files[0])}
          />
          <label htmlFor="documentFileInput" className="file-input-label">
            {documentFile ? documentFile.name : "Choose Document File"}
          </label>

          <button
            className="upload-button"
            onClick={handleUploadAndTeach}
            disabled={loading}
          >
            {loading ? "Processing..." : "Upload & Teach"}
          </button>

          {/* Button to play fallback voice */}
<button
  className="fallback-button"
  onClick={handlePlayFallback}
  style={{
    marginLeft: "10px",
    padding: "10px 20px",
    background: "linear-gradient(90deg, #4ade80, #22c55e)", // green gradient
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
  }}
  onMouseEnter={(e) => e.currentTarget.style.background = "linear-gradient(90deg, #22c55e, #16a34a)"} // darker green on hover
  onMouseLeave={(e) => e.currentTarget.style.background = "linear-gradient(90deg, #4ade80, #22c55e)"} // revert gradient
>
  Play Audio
</button>

        </div>

        {response && (
          <div className="response-section">
            <h3 className="response-header">Lesson Preview</h3>
            {response.lesson_preview && (
              <div className="lesson-preview">{response.lesson_preview}</div>
            )}

            <div className="audio-section">
              <div className="audio-label">Generated Audio Lesson</div>
              <audio ref={audioRef} className="custom-audio" controls>
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
