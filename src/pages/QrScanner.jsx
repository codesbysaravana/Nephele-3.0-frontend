// client/src/pages/QrScanner.jsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, CheckCircle, X, Send, Loader2 } from "lucide-react";
import QrScannerLib from "qr-scanner";
import "../styles/scannerconverse.css";

export default function QrScanner() {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const audioRef = useRef(new Audio());

  const [scannedData, setScannedData] = useState("");
  const [uid, setUid] = useState(null);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState("");

  const navigate = useNavigate();

  // Initialize QR scanner
  useEffect(() => {
    if (videoRef.current) {
      scannerRef.current = new QrScannerLib(
        videoRef.current,
        (result) => handleQrScan(result.data),
        { highlightScanRegion: true }
      );
      scannerRef.current.start();
    }

    return () => scannerRef.current?.stop();
  }, []);

  // Handle QR code scanning
  const handleQrScan = async (data) => {
    if (scannedData) return; // prevent duplicate scans
    setScannedData(data);
    setLoading(true);

    try {
      const resp = await fetch("http://127.0.0.1:8000/voice/process_qr/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_data: data }),
      });

      if (!resp.ok) throw new Error("Failed to process QR");

      const audioBlob = await resp.blob();
      const uidHeader = resp.headers.get("X-UID");
      const convoEnd = resp.headers.get("X-Conversation-End") === "true";

      setUid(uidHeader);
      setConversationEnded(convoEnd);

      playAudio(audioBlob);
    } catch (err) {
      console.error("❌ QR Init Error:", err);
      alert("Error processing QR. Try again.");
      setScannedData(""); // Reset scanned data to allow retry
    } finally {
      setLoading(false);
    }
  };

  // Play assistant audio
  const playAudio = (blob) => {
    const url = URL.createObjectURL(blob);
    audioRef.current.src = url;
    audioRef.current.play().catch((e) => console.error("Audio play error:", e));
  };

  // Send user message
  const sendMessage = async () => {
    if (!userMessage.trim() || !uid) return;
    setLoading(true);

    try {
      const resp = await fetch("http://127.0.0.1:8000/voice/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, message: userMessage }),
      });

      if (!resp.ok) throw new Error("Failed to send message");

      const audioBlob = await resp.blob();
      const convoEnd = resp.headers.get("X-Conversation-End") === "true";
      setConversationEnded(convoEnd);

      playAudio(audioBlob);
      setUserMessage("");
    } catch (err) {
      console.error("❌ Chat Error:", err);
      alert("Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qrscanner-container">
      {!scannedData ? (
        <div className="qr-video-section">
          <video ref={videoRef} className="qr-video" />
          <p className="qr-hint">
            <QrCode /> Scan your QR code
          </p>
        </div>
      ) : (
        <div className="qr-card">
          <h2>
            <CheckCircle className="success-icon" />
            Conversation Started
          </h2>
          <p>
            UID: <span className="uid">{uid}</span>
          </p>

          {!conversationEnded ? (
            <div className="qr-input-wrapper">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your message..."
                className="qr-input"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="qr-btn"
              >
                {loading ? <Loader2 className="loader-icon" /> : <Send />}
              </button>
            </div>
          ) : (
            <div className="qr-ended">
              <X /> Conversation Ended
            </div>
          )}
        </div>
      )}
    </div>
  );
}
