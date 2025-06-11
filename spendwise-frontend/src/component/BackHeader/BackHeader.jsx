import { useNavigate } from "react-router-dom";
import "./BackHeader.css";
import Inbox from "../Inbox/Inbox";

const BackHeader = ({ title = "Back", to = -1 }) => {
  const navigate = useNavigate();

  return (
    <header className="back-header">
      <div className="back-header-title">
        <button
          className="back-button"
          onClick={() => navigate(to)}
          aria-label="Go Back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="back-title">{title}</h2>
      </div>
      <Inbox />
    </header>
  );
};

export default BackHeader;
