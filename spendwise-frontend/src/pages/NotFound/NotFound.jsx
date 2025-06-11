import { Link } from "react-router-dom";
import "./notFound.css"; 

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-link">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;