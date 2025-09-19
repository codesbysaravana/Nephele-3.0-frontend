import { useState } from "react";
import { QrReader } from "react-qr-reader";
import "../styles/attendance.css";

export default function Attendance() {
  const [status, setStatus] = useState("🤖 Ready to Scan");

  const handleScan = async (result) => {
    if (result?.text) {
      setStatus("📡 QR Detected: Sending...");

      try {
        const response = await fetch("http://127.0.0.1:8000/mark-attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qr_data: result.text }),
        });

        const data = await response.json();

        if (data.status === "success") {
          setStatus(`✅ Attendance Marked for ${data.name}`);
        } else if (data.status === "marked") {
          setStatus(`⚠️ ${data.name}, you already marked today!`);
        } else {
          setStatus("❌ Error: " + data.status);
        }

        // Play voice file if returned by backend
        if (data.voice_file) {
          const audio = new Audio(`http://127.0.0.1:8000/voice/${data.voice_file}`);
          audio.play();
        }
      } catch (error) {
        console.error("Error:", error);
        setStatus("❌ Server Error");
      }
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
    setStatus("⚠️ Error accessing camera");
  };

  return (
<div className="qr-scanner-container">
  <h2 className="qr-scanner-header">Attendance mark</h2>
  <div className="qr-reader-wrapper">
    <QrReader
      onResult={handleScan}
      constraints={{ facingMode: "environment" }}
      onError={handleError}
      style={{ width: "100%" }}
    />
  </div>
  <p className={`qr-status ${
    status.includes("Ready") ? "status-ready" :
    status.includes("✅") ? "status-success" :
    status.includes("⚠️") ? "status-warning" :
    "status-error"
  }`}>{status}</p>
</div>

  );
}
