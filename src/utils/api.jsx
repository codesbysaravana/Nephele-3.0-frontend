import { ArrowLeft, QrCode, Zap, CheckCircle, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";

// ✅ Use centralized API
import { markAttendance } from "..";

export default function QrScanner() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [previewImg, setPreviewImg] = useState(null); // ✅ To show snapshot

  // Handle QR scan result
  const handleScan = async (data) => {
    if (data?.text) {
      setScanning(false);
      setProcessing(true);
      setResult(null);
      setError(null);

      try {
        const res = await markAttendance(data.text);
        setProcessing(false);

        if (res.status === "success") {
          setResult({
            type: "success",
            message: `Attendance marked for ${res.record?.name || "User"}`,
          });
        } else if (res.status === "already_marked") {
          setResult({
            type: "warning",
            message: `Already marked for ${res.record?.name || "User"}`,
          });
        } else {
          setError("Failed to mark attendance. Please try again.");
        }
      } catch (err) {
        setProcessing(false);
        setError("Network error. Please check your connection.");
      }
    }
  };

  // ✅ Capture preview image from camera
  const capturePreview = (videoEl) => {
    if (!videoEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    setPreviewImg(canvas.toDataURL("image/png"));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header
        style={{ padding: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}
      >
        <button
          onClick={() => navigate("/")}
          style={{ border: "none", background: "transparent" }}
        >
          <ArrowLeft size={24} color="#6366f1" />
        </button>
        <h2 style={{ margin: 0 }}>QR Scanner</h2>
      </header>

      {/* Main */}
      <main style={{ padding: "2rem", textAlign: "center" }}>
        {!scanning ? (
          <>
            <QrCode size={64} color="#6366f1" />
            <h3>Start Scanning</h3>
            <button
              style={{
                background: "#6366f1",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
              onClick={() => {
                setPreviewImg(null);
                setScanning(true);
              }}
            >
              <Zap size={20} style={{ marginRight: "8px" }} />
              Start Scanner Session
            </button>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result, err) => {
                if (!!result) {
                  // ✅ capture image before processing
                  const videoEl = document.querySelector("video");
                  if (videoEl) capturePreview(videoEl);

                  handleScan(result);
                }
                if (!!err) console.info("Scan error:", err);
              }}
              style={{ width: "100%" }}
              videoStyle={{ borderRadius: "12px" }}
            />

            <button
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
              onClick={() => setScanning(false)}
            >
              <X size={20} style={{ marginRight: "8px" }} />
              Stop Scanner
            </button>
          </div>
        )}

        {/* ✅ Preview Image */}
        {previewImg && (
          <div style={{ marginTop: "1rem" }}>
            <h4>Scanned Snapshot:</h4>
            <img
              src={previewImg}
              alt="QR Snapshot"
              style={{ width: "280px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
          </div>
        )}

        {/* Feedback messages */}
        {processing && (
          <div style={{ marginTop: "1rem", color: "#2563eb" }}>
            Processing attendance...
          </div>
        )}
        {result && (
          <div
            style={{
              marginTop: "1rem",
              padding: "12px",
              borderRadius: "8px",
              background: result.type === "success" ? "#dcfce7" : "#fef3c7",
              color: result.type === "success" ? "#166534" : "#92400e",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            {result.type === "success" ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            {result.message}
          </div>
        )}
        {error && (
          <div
            style={{
              marginTop: "1rem",
              padding: "12px",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#991b1b",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            <X size={20} />
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
