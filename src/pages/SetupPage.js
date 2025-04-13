import { useEffect, useRef, useState } from 'react';
import LocationDetector from '../components/setup/LocationDetector';
import FileUpload from '../components/setup/FileUpload';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSession } from '../Store/sessionSlice';

const SetupPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userName = useRef();
    const areaName = useRef();
    const mobileNumber = useRef();

    const [location, setLocation] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    //find the current session from store
    const currentSessionId = useSelector((store) => store.session);

    //session is active => navigate to scan
    if(currentSessionId){
        navigate("/scan");
    }

    //find current session is present or not
    const findCurrentSession = async () => {
        try{
            const currentSessionData = await axios.get(`${BASE_URL}/session`,{withCredentials : true});

            dispatch(addSession(currentSessionData?.data?.sessionId))
        }catch(err){
            console.log("ERROR : " + err.message);
        }
    }

    const handleLocationChange = (loc) => {
        setLocation(loc);
    };

    const handleFileChange = (file) => {
        setCsvFile(file);
    };

    const handleSubmit = async () => {
        if (!userName?.current?.value || !areaName?.current?.value || 
            !mobileNumber?.current?.value) {
            setError('Please fill all required fields');
            return;
        }

        if (!location?.coordinates) {
            setError('Please set your location');
            return;
        }

        if (!csvFile) {
            setError('Please upload a CSV file');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('userName', userName.current.value);
            formData.append('areaName', areaName.current.value);
            formData.append('mobileNumber', mobileNumber.current.value);
            formData.append('location', JSON.stringify(location.coordinates));
            formData.append('csvFile', csvFile);

            const response = await axios.post(BASE_URL + "/session", formData, {
                withCredentials: true
            });

            console.log(response);
            //add sessionId to store
            dispatch(addSession(response?.data?.sessionId));

            localStorage.setItem('currentSession', JSON.stringify(response.data));

            navigate("/scan");
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create session');
        } finally {
            setIsLoading(false);
        }
    };


    //find the session => page loaded
    useEffect(() => {
        findCurrentSession();
    },[]);

    return (
        <div className="container mt-10 mx-auto p-6 bg-gray-50 shadow-lg rounded-lg max-w-2xl">
            {error && (
                <div className="alert alert-error mb-6 flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Setup Your Session</h1>

            <fieldset className="mb-4">
                <legend className="text-sm font-semibold text-gray-600">User Name</legend>
                <input ref={userName} type="text" className="input input-bordered w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </fieldset>

            <fieldset className="mb-4">
                <legend className="text-sm font-semibold text-gray-600">Area Name</legend>
                <input ref={areaName} type="text" className="input input-bordered w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </fieldset>

            <fieldset className="mb-4">
                <legend className="text-sm font-semibold text-gray-600">Mobile Number</legend>
                <input ref={mobileNumber} type="tel" className="input input-bordered w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </fieldset>

            <div className="mb-4">
                <LocationDetector onChange={handleLocationChange} />
            </div>

            <div className="mb-6">
                <fieldset>
                    <legend className="text-sm font-semibold text-gray-600">Upload CSV file</legend>
                    <FileUpload onChange={handleFileChange} />
                    {csvFile && (
                        <p className="mt-2 text-sm text-gray-500">Selected: {csvFile.name}</p>
                    )}
                </fieldset>
            </div>

            <button 
                onClick={handleSubmit} 
                className={`btn w-full py-3 rounded-lg text-white font-semibold ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <span className="loading loading-spinner mr-2"></span>
                        Creating Session...
                    </>
                ) : 'Start Session'}
            </button>
        </div>
    );
};

export default SetupPage;
