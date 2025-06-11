import { useEffect, useState } from "react";
import useStore from "../../store/zustand";
import "./profile.css";
import API from "../../config/axios";
import BackHeader from "../../component/BackHeader/BackHeader";
import ButtonLoader from "../../component/ButtonLoader/ButtonLoader";

const Profile = () => {
  const { user, updateUser } = useStore();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [upiId, setUpiId] = useState(user?.upiId || "")
  const [weeklySummary, setWeeklySummary] = useState(user?.getSummary || false);
  const [currency, setCurrency] = useState(user?.currency);
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [dailyLimit, setDailyLimit] = useState(user?.dailyLimit || "");
  const [stats, setStats] = useState(null);
  const [daysTracked, setDaysTracked] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      API.get("/expenses/filter?groupByCategory=true").then((res) => {
        setStats(res.data);
        const uniqueTrackedDays = new Set(
          res.data.expenses.map((exp) =>
            new Date(exp.date).toLocaleDateString()
          )
        );
        setDaysTracked(uniqueTrackedDays.size);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await updateUser({
      name,
      getSummary: weeklySummary,
      dailyLimit: dailyLimit ? dailyLimit : 0,
      currency,
      upiId
    });
    setLoading(false);
    setEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
    <BackHeader title="Profile Settings" to="/" />
      <div className="profile-container">
        <div className="profile-header">
          {/* <h1>Profile Settings</h1> */}
          {editMode ? (
            <div className="profile-actions">
              <button className="cancel-btn-p" onClick={() => setEditMode(false)}>
                Cancel
              </button>
              <button disabled={loading} className="save-btn-p" onClick={handleSave}>
                {loading ? <ButtonLoader /> : "Save Changes"}
              </button>
            </div>
          ) : (
            <button className="edit-btn-p" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="profile-pic-container">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="profile-pic" />
              ) : (
                <div className="profile-pic-placeholder">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              {/* {editMode && (
              <div className="profile-pic-upload">
                <label htmlFor="profile-upload" className="upload-btn">
                  Change Photo
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            )} */}
            </div>

            <div className="profile-details">
              {editMode ? (
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              ) : (
                <h2>{user?.name || "User"}</h2>
              )}
              <p className="email">{user?.email}</p>
            </div>
          </div>

          <div className="payment-section">
            <h3>UPI ID</h3>
            {
              editMode ? (
                <input
                    type="text"
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="UPI id"
                  />
              ) : (
                <span>{upiId ? upiId : "Not set"}</span>
              )
            }
          </div>

          <div className="preferences-section">
            <h3>Preferences</h3>

            <div className="preference-item">
              <div className="preference-info">
                <h4>Weekly Summary</h4>
                <p>Receive a weekly email with your expense summary</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={weeklySummary}
                  onChange={(e) => setWeeklySummary(e.target.checked)}
                  disabled={!editMode}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h4>Default Currency</h4>
                <p>Set your preferred currency for displaying amounts</p>
              </div>
              {editMode ? (
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="currency-select"
                >
                  <option value="₹">Indian Rupee (₹)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="€">Euro (€)</option>
                  <option value="£">British Pound (£)</option>
                  <option value="¥">Japanese Yen (¥)</option>
                </select>
              ) : (
                <span className="currency-value">{currency}</span>
              )}
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h4>Daily Spending Limit</h4>
                <p>Set a daily budget limit for your expenses</p>
              </div>
              {editMode ? (
                <div className="daily-limit-input">
                  <span className="currency-symbol">{currency}</span>
                  <input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                    placeholder="Enter daily limit"
                    min="0"
                  />
                </div>
              ) : (
                <span className="daily-limit-value">
                  {dailyLimit ? `${currency}${dailyLimit}` : "Not set"}
                </span>
              )}
            </div>

            {!editMode && (
              <div className="stats-section">
                <h3>Your Stats</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-value">
                      {currency}
                      {stats?.total || 0}
                    </span>
                    <span className="stat-label">Total Spent</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">
                      {stats?.expenses.length || 0}
                    </span>
                    <span className="stat-label">Transactions</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">
                      {stats?.grouped.length || 0}
                    </span>
                    <span className="stat-label">Categories</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-value">{daysTracked || 0}</span>
                    <span className="stat-label">Days Tracked</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
