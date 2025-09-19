// client/src/pages/QrScanner.jsx

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, QrCode, Zap, CheckCircle, X, Camera, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QrScanner from 'qr-scanner';

export default function QrScannerPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  
  // State management
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [scannerReady, setScannerReady] = useState(false);

  // Initialize QR Scanner when scanning starts
  useEffect(() => {
    if (scanning && videoRef.current) {
      initializeScanner();
    }
    
    return () => {
      // Cleanup scanner on unmount
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, [scanning]);

  // Initialize QR Scanner
  const initializeScanner = async () => {
    try {
      setCameraError(null);
      setScannerReady(false);

      // Check if cameras are available
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        throw new Error('No camera found on this device');
      }

      // Create QR Scanner instance
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScan(result.data),
        {
          onDecodeError: (err) => {
            // Ignore decode errors (normal when no QR code in view)
            console.debug('QR decode attempt:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment', // Use back camera on mobile
          maxScansPerSecond: 5,
        }
      );

      // Start scanning
      await qrScannerRef.current.start();
      setScannerReady(true);
      setHasCamera(true);

    } catch (error) {
      console.error('Scanner initialization error:', error);
      setCameraError(error.message);
      setHasCamera(false);
      
      // Show error for a few seconds then go back to main screen
      setTimeout(() => {
        setScanning(false);
        setCameraError(null);
      }, 4000);
    }
  };

  // Handle successful QR scan
  const handleScan = async (qrText) => {
    if (!qrText || processing) return;

    try {
      // Stop scanner to prevent multiple scans
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
      
      setScanning(false);
      setProcessing(true);
      
      console.log('Scanned QR Code:', qrText);
      
      // Parse QR data (expected format: uid,name,reg_no,dept,college)
      const qrParts = qrText.trim().split(',');
      
      if (qrParts.length >= 5) {
        const [uid, name, regNo, dept, college] = qrParts;
        
        // Validate that required fields are not empty
        if (!uid.trim() || !name.trim() || !dept.trim() || !college.trim()) {
          throw new Error('QR code contains empty required fields');
        }
        
        // Show success message briefly
        setResult({
          type: 'success',
          message: `Welcome ${name.trim()}! Initializing conversation...`
        });
        
        // Route to conversation page with QR data after 1.5 seconds
        setTimeout(() => {
          navigate('/conversation', {
            state: {
              qrData: {
                uid: uid.trim(),
                name: name.trim(),
                regNo: regNo.trim(),
                dept: dept.trim(),
                college: college.trim(),
                rawQr: qrText.trim()
              }
            }
          });
        }, 1500);
        
      } else {
        throw new Error(`Invalid QR code format. Expected 5 fields (uid,name,reg_no,dept,college), got ${qrParts.length}`);
      }
      
    } catch (err) {
      console.error('QR processing error:', err);
      setResult({
        type: 'error',
        message: err.message || 'Invalid QR code format. Please try again.'
      });
      
      // Clear error and return to scanning after 3 seconds
      setTimeout(() => {
        setResult(null);
        setProcessing(false);
      }, 3000);
    }
  };

  // Reset all states
  const resetState = () => {
    setResult(null);
    setProcessing(false);
    setCameraError(null);
    setScannerReady(false);
  };

  // Start scanning
  const startScanning = async () => {
    resetState();
    
    // Check for camera permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately, just checking permission
      setScanning(true);
    } catch (permissionError) {
      console.error('Camera permission error:', permissionError);
      setCameraError('Camera access denied. Please allow camera access and try again.');
    }
  };

  // Stop scanning
  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setScanning(false);
    setScannerReady(false);
    resetState();
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    padding: '1rem 1.5rem',
    position: 'sticky',
    top: 0,
    zIndex: 40
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} color="#6366f1" />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <QrCode size={24} color="white" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
                Nova AI Scanner
              </h1>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                AWS Day Voice Assistant • QR Integration
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          {!scanning ? (
            <>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '16px',
                padding: '16px',
                display: 'inline-block',
                marginBottom: '2rem'
              }}>
                <QrCode size={48} color="white" />
              </div>
              
              <h2 style={{ 
                margin: '0 0 1rem 0', 
                fontSize: '32px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Nova AI Voice Scanner
              </h2>
              
              <p style={{ margin: '0 0 3rem 0', fontSize: '18px', color: '#64748b' }}>
                Scan QR codes to start voice conversations with Nova AI assistant
              </p>
              
              <button
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px 32px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: '200px'
                }}
                onClick={startScanning}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <Camera size={20} />
                  Start QR Scanner
                </div>
              </button>

              {/* Camera Permission Info */}
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#1e40af'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <AlertCircle size={16} />
                  Camera access required for QR scanning
                </div>
              </div>
            </>
          ) : (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.95)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              
              {/* Camera Error State */}
              {cameraError ? (
                <div style={{
                  color: 'white',
                  textAlign: 'center',
                  padding: '2rem',
                  maxWidth: '400px'
                }}>
                  <AlertCircle size={48} style={{ marginBottom: '1rem', color: '#ef4444' }} />
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '20px', fontWeight: '600' }}>
                    Camera Error
                  </h3>
                  <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>
                    {cameraError}
                  </p>
                  <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>
                    Returning to main screen...
                  </p>
                </div>
              ) : (
                <>
                  {/* Video Element for QR Scanner */}
                  <video
                    ref={videoRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: scannerReady ? 'block' : 'none'
                    }}
                  />

                  {/* Loading State */}
                  {!scannerReady && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(255, 255, 255, 0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                      }} />
                      <p>Starting camera...</p>
                    </div>
                  )}

                  {/* Instructions Overlay */}
                  {scannerReady && (
                    <div style={{
                      position: 'absolute',
                      top: '15%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'white',
                      textAlign: 'center',
                      background: 'rgba(0, 0, 0, 0.7)',
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      maxWidth: '90%'
                    }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '18px', fontWeight: '600' }}>
                        Point camera at QR code
                      </h3>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Format: uid,name,reg_no,dept,college
                      </p>
                    </div>
                  )}

                  {/* Cancel Button */}
                  <button
                    style={{
                      position: 'absolute',
                      bottom: '40px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '16px 32px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={stopScanning}
                  >
                    <X size={20} />
                    Cancel Scan
                  </button>
                </>
              )}
            </div>
          )}

          {/* Processing State */}
          {processing && (
            <div style={{
              marginTop: '2rem',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              color: '#1e40af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #3b82f6',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Processing QR code...
            </div>
          )}
          
          {/* Results */}
          {result && (
            <div style={{
              marginTop: '2rem',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              background: result.type === 'success' 
                ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' 
                : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              color: result.type === 'success' ? '#166534' : '#991b1b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={20} />
              {result.message}
            </div>
          )}
        </div>
      </main>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
