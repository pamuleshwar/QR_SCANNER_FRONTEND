const ScanResult = ({ result }) => {
    if (!result) return null;
  
    const getStatusDetails = () => {
      switch (result.status) {
        case 'success':
          return {
            className: 'success',
            icon: '✓',
            message: 'Valid Code - Scan Successful!'
          };
        case 'invalid_code':
          return {
            className: 'error',
            icon: '✗',
            message: 'Invalid Code'
          };
        case 'limit_exceeded':
          return {
            className: 'warning',
            icon: '⚠',
            message: 'Scan Limit Exceeded'
          };
        default:
          return {
            className: 'error',
            icon: '!',
            message: result.message || 'Scan Error'
          };
      }
    };
  
    const status = getStatusDetails();
  
    return (
      <div className={`scan-result ${status.className}`}>
        <div className="status-icon">{status.icon}</div>
        <div className="status-message">
          <p>{status.message}</p>
          {result.codeValue && <p className="code-value">Code: {result.codeValue}</p>}
          {result.remainingScans !== undefined && (
            <p className="remaining-scans">Remaining scans: {result.remainingScans}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default ScanResult;