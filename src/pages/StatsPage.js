import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScansTable from '../components/stats/ScansTable';
import ExportButton from '../components/stats/ExportButton';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { useDispatch } from 'react-redux';
import { removeSession } from '../Store/sessionSlice';

const StatsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
  
      const [statsResponse, scansResponse] = await Promise.all([
        axios.get(`${BASE_URL}/session/${sessionId}`),
        axios.get(`${BASE_URL}/scan/${sessionId}`)
      ]);
  
      setStats(statsResponse.data);
      setScans(scansResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  const handleEndSession = async () => {
    if (window.confirm('Are you sure you want to end this session? This cannot be undone.')) {
      try {
        const response = await axios.delete(`${BASE_URL}/session/${sessionId}`, { withCredentials: true });

        if (!response) {
          throw new Error("Failed to end session");
        }

        dispatch(removeSession());
        navigate("/");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading statistics...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Session Statistics</h2>
        <button
          onClick={() => navigate('/scan')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Scanning
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Scans</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-100 shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-green-700">Successful</h3>
          <p className="text-3xl font-bold text-green-900">{stats.success}</p>
          <p className="text-sm text-green-600">
            {stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%
          </p>
        </div>
        <div className="bg-red-100 shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold text-red-700">Failed</h3>
          <p className="text-3xl font-bold text-red-900">{stats.failed}</p>
          <p className="text-sm text-red-600">
            {stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <ExportButton sessionId={sessionId} />
        <button
          onClick={handleEndSession}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          End Session
        </button>
      </div>

      <div className="mt-6">
        <ScansTable scans={scans} />
      </div>
    </div>
  );
};

export default StatsPage;