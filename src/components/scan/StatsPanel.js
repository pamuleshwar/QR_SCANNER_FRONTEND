const StatsPanel = ({ stats }) => {
    return (
      <div className="stats-panel">
        <h3>Scan Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Scans</div>
          </div>
          <div className="stat-card success">
            <div className="stat-value">{stats.success}</div>
            <div className="stat-label">Successful</div>
          </div>
          <div className="stat-card failed">
            <div className="stat-value">{stats.failed}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default StatsPanel;