import "./loadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-loader">
          <div className="logo-spinner"></div>
          <svg className="logo-icon" viewBox="0 0 24 24">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5L18 9v6l-6 3.5-6-3.5V9l6-3.5z"/>
          </svg>
        </div>
        <div className="progress-container">
          <div className="progress-bar"></div>
        </div>
        <p className="loading-text">Preparing your experience...</p>
        <div className="loading-hint">
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;