import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../../constants";

const ExportButton = ({ sessionId }) => {
    const [isExporting, setIsExporting] = useState(false);
  
    const handleExport = async () => {
      try {
        setIsExporting(true);
        
        const response = await axios.get(
          `${BASE_URL}/scan/${sessionId}/export`,
          {
            withCredentials: true,
            responseType: 'blob'
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `scan_results_${sessionId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsExporting(false);
      }
    };
  
    return (
      <button 
        onClick={handleExport}
        disabled={isExporting}
        className={`
          flex items-center justify-center gap-2
          px-4 py-2 rounded-md
          text-white font-medium
          bg-blue-600 hover:bg-blue-700
          transition-colors duration-200
          shadow-md hover:shadow-lg
          disabled:bg-blue-400 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
      >
        {isExporting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Export as CSV
          </>
        )}
      </button>
    );
};
  
export default ExportButton;