import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScanResult from '../components/scan/ScanResult';
import StatsPanel from '../components/scan/StatsPanel';
import { BASE_URL } from '../constants';
import axios from 'axios';

const ScanPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (!savedSession) {
      navigate('/');
      return;
    }
    setSession(JSON.parse(savedSession));
  }, []);

  const updateStats = (status) => {
    setStats((prev) => ({
      total: prev.total + 1,
      success: status === 'success' ? prev.success + 1 : prev.success,
      failed: status !== 'success' ? prev.failed + 1 : prev.failed,
    }));
  };

  const handleScan = async (result) => {
    if (result && session) {
      try {
        const response = await axios.post(
          `${BASE_URL}/scan/${session.sessionId}`,
          { codeValue: result },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
  
        // console.log('Scan response:', response.data);
        setScanResult(response.data);
        updateStats(response.data.status);
      } catch (err) {
        console.error('Scan error:', err);
        setScanResult({
          status: 'error',
          message: err.response?.data?.message || 'Failed to process scan',
        });
      }
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      const video = document.getElementById('scanner-video');
      video.srcObject = stream;
      video.onloadedmetadata = () => video.play();
    } catch (err) {
      setCameraError('Camera access denied or not available');
    }
  };


  useEffect(() => {
    startCamera();
    return () => {
      const video = document.getElementById('scanner-video');
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Scan QR/Barcode</h2>

      {cameraError ? (
        <div className="text-red-500 bg-red-100 p-4 rounded-md shadow-md">
          {cameraError}
        </div>
      ) : (
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <video
            id="scanner-video"
            playsInline
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 border-4 border-dashed border-gray-300 pointer-events-none" />
        </div>
      )}

      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => {
            handleScan('TEST_CODE_' + Math.floor(Math.random() * 1000));
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
        >
          Simulate Scan
        </button>
        <button
          onClick={() => navigate(`/stats/${session?.sessionId}`)}
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
        >
          View Statistics
        </button>
      </div>

      <div className="w-full max-w-md mt-6">
        <ScanResult result={scanResult} />
      </div>
      <div className="w-full max-w-md mt-4">
        <StatsPanel stats={stats} />
      </div>
    </div>
  );
};

export default ScanPage;