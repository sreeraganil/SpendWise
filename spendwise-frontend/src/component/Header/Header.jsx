import { useEffect, useRef, useState } from "react";
import useStore from "../../store/zustand";
import "./header.css";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import Inbox from "../Inbox/Inbox";

const Header = () => {
  const { user, logoutUser } = useStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef();
  const menuIconRef = useRef();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    document.addEventListener("click", documentClick);

    return () => document.removeEventListener("click", documentClick);
  }, []);

  const documentClick = (e) => {
    if (
      menuRef?.current &&
      menuIconRef?.current &&
      !menuRef.current.contains(e.target) &&
      !menuIconRef.current.contains(e.target)
    ) {
      setShowProfileMenu(false);
    }
  };


  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

   const handleDownloadClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("App is not installable yet.");
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img src={logo} className="logo" alt="logo" />
        <h1>SpendWise</h1>
      </div>

      <div className="profile-section-icon">
        <button
          className="profile-btn"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          aria-label="Profile menu"
          ref={menuIconRef}
        >
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="profile-name">{user?.name || "User"}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className={`dropdown-icon ${showProfileMenu ? "open" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {showProfileMenu && (
          <div className="profile-menu" ref={menuRef}>
            <NavLink to="/history" className="nav-link">
              <span className="material-symbols-outlined">history_toggle_off</span>
              History
            </NavLink>
            <NavLink to="/profile" className="nav-link">
              <span className="material-symbols-outlined">person</span>
              Profile
            </NavLink>
            <NavLink to="/friends" className="nav-link">
              <span className="material-symbols-outlined">group</span>
              Friends
            </NavLink>
            <NavLink to="/shared" className="nav-link">
              <span className="material-symbols-outlined">communication</span>
              Shared
            </NavLink>
            <NavLink to="/borrowlend" className="nav-link">
              <span className="material-symbols-outlined">money_bag</span>
              Borrow/Lend
            </NavLink>
            <NavLink to="/analytics" className="nav-link">
              <span className="material-symbols-outlined">bar_chart</span>
              Analytics
            </NavLink>
            <button
              onClick={() => logoutUser(null)}
              className="nav-link logout"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>

            { deferredPrompt && (
              <button
              onClick={handleDownloadClick}
              style={{
                display: "flex",
                height: "30px",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                padding: "0 12px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <span>Install App</span>
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "18px",
                  lineHeight: "1",
                }}
              >
                download
              </span>
            </button>
            )}
          </div>
        )}
        <Inbox />
      </div>
    </header>
  );
};

export default Header;
