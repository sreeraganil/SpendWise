import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../config/axios";
import "./borrowLend.css";
import BackHeader from "../../component/BackHeader/BackHeader";

const BorrowLend = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    type: "borrow",
    person: "",
    amount: "",
    note: "",
    status: "pending",
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await API.get("/borrowlend");
      setEntries(res.data.transactions);
    } catch (err) {
      toast.error("Failed to fetch entries");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editId) {
        const res = await API.put(`/borrowlend/${editId}`, formData);
        toast.success(res.data.message);
      } else {
        const res = await API.post("/borrowlend", formData);
        toast.success(res.data.message);
      }
      setFormData({
        type: "borrow",
        person: "",
        amount: "",
        note: "",
        status: "pending",
      });
      setEditId(null);
      fetchEntries();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error processing request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettle = async (id) => {
    try {
      await API.put(`/borrowlend/${id}`, { status: "settled" });
      toast.success("Marked as settled");
      fetchEntries();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        const res = await API.delete(`/borrowlend/${id}`);
        toast.success(res.data.message);
        fetchEntries();
      } catch (err) {
        toast.error("Error deleting entry");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      type: "borrow",
      person: "",
      amount: "",
      note: "",
      status: "pending",
    });
    setEditId(null);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <>
      <BackHeader title="Borrow / Lend Tracker" to="/" />
      <div className="borrow-lend-page">
        <form onSubmit={handleSubmit} className="borrow-lend-form">
          <div className="form-row">
            <div className="form-group">
              <label>Transaction Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="borrow">Borrow</option>
                <option value="lend">Lend</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="settled">Settled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Person's Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={formData.person}
              onChange={(e) =>
                setFormData({ ...formData, person: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label>Note (Optional)</label>
            <textarea
              placeholder="Add any notes"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              rows="3"
              style={{ resize: "vertical" }}
            />
          </div>

          <div className="form-actions">
            {editId ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Entry"}
                </button>
              </>
            ) : (
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Entry"}
              </button>
            )}
          </div>
        </form>

        <div className="entry-list">
          {entries?.length === 0 ? (
            <div className="empty-state">
              <p>No entries found. Add your first borrow/lend transaction.</p>
            </div>
          ) : (
            entries?.map((entry) => (
              <div
                key={entry._id}
                className={`entry-card ${entry.type} ${entry.status}`}
              >
                <div className="entry-header">
                  <h4>
                    {entry.type === "borrow" ? "Borrowed from" : "Lent to"}{" "}
                    <strong>{entry.person}</strong>
                  </h4>
                  <div className="entry-actions">
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="delete-btn"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>

                <div className="entry-details">
                  <div className="detail-item">
                    <span>Amount:</span>
                    <strong>₹{entry.amount}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Status:</span>
                    <span className={`status-badge ${entry.status}`}>
                      {entry.status}
                    </span>
                  </div>
                  {entry.note && (
                    <div className="detail-item">
                      <span>Note:</span>
                      <p>{entry.note}</p>
                    </div>
                  )}
                  <div className="entry-date">
                    {new Date(entry.createdAt).toLocaleString()}
                  </div>

                  {entry.status === "pending" && (
                    <button
                      className="settle-btn"
                      onClick={() => handleSettle(entry._id)}
                    >
                      Mark as Settled
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default BorrowLend;
