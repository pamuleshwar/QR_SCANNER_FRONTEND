import { useEffect, useState } from 'react';

const LocationDetector = ({ onChange }) => {
  const [location, setLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [isManual, setIsManual] = useState(false);
  const [status, setStatus] = useState('initializing');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isManual && navigator.geolocation) {
      setStatus('detecting');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            coordinates: [position.coords.longitude, position.coords.latitude],
            manualOverride: false
          };
          setLocation(coords);
          onChange(coords);
          setStatus('success');
          setTimeout(() => setStatus('ready'), 2000);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError('Could not detect your location automatically');
          setStatus('manual');
          setIsManual(true);
        }
      );
    }
  }, [isManual]);

  const handleManualLocation = () => {
    setStatus('processing');
    // Simulate geocoding API call
    setTimeout(() => {
      
      const mockCoords = {
        coordinates: [-0.127758, 51.507351], 
        manualOverride: true
      };
      setLocation(mockCoords);
      onChange(mockCoords);
      setStatus('success');
      setTimeout(() => setStatus('ready'), 2000);
    }, 1000);
  };

  const handleTryAgain = () => {
    setError(null);
    setStatus('detecting');
    setIsManual(false);
  };

  const statusMessages = {
    initializing: 'Initializing location services...',
    detecting: '🌍 Getting your location...',
    processing: '🔍 Processing your location...',
    success: '✅ Location fetched successfully!',
    manual: '📍 Please enter your location manually',
    ready: 'Location ready'
  };

  return (
    <div className="space-y-4">
      {status === 'detecting' && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-pulse">🔄</div>
          <p>{statusMessages[status]}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-600">
          <div>✅</div>
          <p>{statusMessages[status]}</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 mb-2">
          <p>{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setIsManual(true)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          disabled={isManual}
        >
          📍 Enter Location Manually
        </button>

        {isManual && (
          <button
            onClick={handleTryAgain}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            🔄 Try Auto-Detect Again
          </button>
        )}
      </div>

      {isManual && (
        <div className="space-y-2">
          <input
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            placeholder="e.g., 123 Main St, City, Country"
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleManualLocation}
            disabled={!manualLocation || status === 'processing'}
            className={`px-4 py-2 rounded text-white ${!manualLocation || status === 'processing' ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {status === 'processing' ? 'Processing...' : 'Set Location'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationDetector;