import { useState } from 'react';
import Papa from 'papaparse';

const FileUpload = ({ onChange, error }) => {
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        if (!results.meta.fields.includes('code') || !results.meta.fields.includes('allowedScans')) {
          setValidationError('CSV must contain "code" and "allowedScans" columns');
          return;
        }
        setValidationError('');
        setFile(selectedFile);
        onChange(selectedFile);
      },
      error: (error) => {
        setValidationError('Error parsing CSV file');
      }
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {validationError && <p className="error">{validationError}</p>}
    </div>
  );
};

export default FileUpload;