import { useState } from "react";
import "./addExpense.css";
import { toast } from "react-toastify";
import useExpense from "../../store/useExpense";
import categories from "../../utilities/categories";
import useStore from "../../store/zustand";

const AddExpense = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("others");
  const [isLoading, setIsLoading] = useState(false);
  const [sharedWith, setSharedWith] = useState([]);
  const [shared, setShared] = useState(false);
  const { addExpense } = useExpense();
  const { user, friends } = useStore();
  const [splitMode, setSplitMode] = useState("equal");
  const [customSplit, setCustomSplit] = useState({});

  const handleCheckboxChange = (friendId) => {
    setSharedWith((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) {
      return toast.error("Amount field is required");
    }

    const totalAmount = parseFloat(amount);
    let sharedWithData = [];

    if (sharedWith.length > 0) {
      if (splitMode === "equal") {
        const splitAmount = totalAmount / (sharedWith.length + 1);
        sharedWithData = sharedWith.map((friendId) => ({
          friend: friendId,
          amount: Math.ceil(splitAmount),
        }));
      } else {
        const customTotal = Object.values(customSplit).reduce(
          (a, b) => a + b,
          0
        );
        if (customTotal > totalAmount) {
          setIsLoading(false);
          return toast.error("Custom split exceeds total amount.");
        }

        sharedWithData = sharedWith.map((friendId) => ({
          friend: friendId,
          amount: Math.ceil(customSplit[friendId] || 0),
        }));
      }
    }

    setIsLoading(true);

    try {
      await addExpense({
        title,
        amount: totalAmount,
        category,
        date: Date.now(),
        sharedWith: sharedWithData,
      });
      toast.success("Expense added successfully!");
      setTitle("");
      setAmount("");
      setCategory("");
      setSharedWith([]);
    } catch (error) {
      toast.error("Failed to add expense");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="expense-card">
      <div className="card-header">
        <h2>Add New Expense</h2>
        <p>Track your spending easily</p>
      </div>

      <form className="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Expense Title <span className="optional">(optional)</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="Dinner with friends"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount ({user.currency})</label>
          <div className="amount-input">
            <span className="currency">{user.currency}</span>
            <input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <div className="category-select">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="select-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="share-toggle-container">
          <label htmlFor="sharetofriend" className="share-toggle-label">
            Share with friends
          </label>
          <input
            id="sharetofriend"
            type="checkbox"
            className="share-toggle-input"
            onChange={() => setShared((prev) => !prev)}
            checked={shared}
            hidden
          />
          <span
            onClick={() => setShared((prev) => !prev)}
            className="slide"
          ></span>
        </div>

        {shared && (
          <div className="split-mode-toggle">
            <label>
              <input
                type="radio"
                value="equal"
                checked={splitMode === "equal"}
                onChange={() => setSplitMode("equal")}
              />
              Split Equally
            </label>
            <label>
              <input
                type="radio"
                value="custom"
                checked={splitMode === "custom"}
                onChange={() => setSplitMode("custom")}
              />
              Split Custom
            </label>
          </div>
        )}
        {shared && (
          <div className="friend-split-container">
            <label className="friend-split-title">Split with Friends</label>
            <div className="friend-split-list">
              {friends?.length > 0 ? (
                friends?.map((friend) => {
                  const isSelected = sharedWith.includes(friend._id);
                  return (
                    <div key={friend._id} className="friend-split-option">
                      <label>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(friend._id)}
                        />
                        <span className="friend-split-info">
                          {friend.name}{" "}
                          <span className="friend-split-email">
                            ({friend.email})
                          </span>
                        </span>
                      </label>

                      {splitMode === "custom" && isSelected && (
                        <input
                          type="number"
                          placeholder="Amount"
                          min="0"
                          className="custom-amount-input"
                          value={customSplit[friend._id] || ""}
                          onChange={(e) =>
                            setCustomSplit((prev) => ({
                              ...prev,
                              [friend._id]: parseFloat(e.target.value) || 0,
                            }))
                          }
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="friend-split-empty">
                  No friends available to split with.
                </p>
              )}
            </div>
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Add Expense
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
