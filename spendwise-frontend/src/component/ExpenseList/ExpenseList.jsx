import { useEffect, useState } from "react";
import useExpense from "../../store/useExpense";
import "./expenseList.css";
import useStore from "../../store/zustand";
import { Link } from "react-router-dom";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const ExpenseList = () => {
  const { expenses, total, fetchExpenses, deleteExpense, updateExpense } =
    useExpense();
  const { user, balance } = useStore();
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", amount: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleEdit = (expense) => {
    setEditId(expense._id);
    setEditForm({ title: expense.title, amount: expense.amount });
  };

  const saveEdit = async (id) => {
    setIsLoading(true);
    try {
      await updateExpense(id, editForm);
      setEditId(null);
      setEditForm({ title: "", amount: "" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const askToDelete = (id) => {
    setExpenseToDelete(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (expenseToDelete) {
      await deleteExpense(expenseToDelete);
    }
    setModalOpen(false);
    setExpenseToDelete(null);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setExpenseToDelete(null);
  };

  return (
    <>
      <div className="expense-dashboard" data-aos="flip-left" data-aos-duration="500">
        <div className="expense-header">
          <h2>Today's Expenses</h2>
          <div className="expense-summary">
            <span>
              Total Expenses:{" "}
              <b className={total > user.dailyLimit ? "red" : "green"}>
                {user.currency}
                {total}
              </b>
            </span>
            <Link to="/profile" className="link">
              <span>
                Daily Limit:{" "}
                <b className="dailylimit">
                  {user.currency}
                  {user.dailyLimit}
                </b>
              </span>
            </Link>
            <span>
              Today's balance{" "}
              <b className={balance < 0 ? "red" : "green"}>
                {balance < 0 && "-"}
                {user.currency}
                {Math.abs(balance)}
              </b>
            </span>
            <span>
              Count: <b>{expenses.length}</b>
            </span>
          </div>
        </div>

        {expenses?.length === 0 ? (
          <div className="empty-state">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M3 3h18v18H3zM8 8v8m8-8v8" />
            </svg>
            <p>No expenses recorded yet</p>
            <small>Add your first expense to get started</small>
          </div>
        ) : (
          <div className="expense-table">
            <div className="table-header">
              <span>Category</span>
              <span>Description</span>
              <span>Amount</span>
              <span>Date</span>
              <span>Shared</span>
              <span>Actions</span>
            </div>

            <div className="table-body">
              {expenses.map((exp) => (
                <div
                  className={`table-row ${editId === exp._id ? "editing" : ""}`}
                  key={exp._id}
                >
                  {editId === exp._id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        placeholder="Expense description"
                      />
                      <input
                        type="number"
                        value={editForm.amount}
                        onChange={(e) =>
                          setEditForm({ ...editForm, amount: e.target.value })
                        }
                        placeholder="Amount"
                      />
                      <div className="edit-actions">
                        <button
                          className="save-btn"
                          onClick={() => saveEdit(exp._id)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="spinner"></span>
                          ) : (
                            "Save"
                          )}
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditId(null)}
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="category-cell">
                        <span className={`category-tag ${exp.category}`}>
                          {exp.category}
                        </span>
                      </span>
                      <span className="title-cell">{exp.title}</span>
                      <span className="amount-cell">
                        {user.currency}
                        {exp.amount}
                      </span>
                      <span className="date-cell">{formatDate(exp.date)}</span>
                      <div className="sharedWith">
                        {exp.sharedWith.length == 0 ? (
                          <span className="material-symbols-outlined">
                            person
                          </span>
                        ) : (
                          <span className="material-symbols-outlined">
                            group
                          </span>
                        )}
                      </div>
                      <span className="actions-cell">
                        <button
                          className="icon-btn edit-btn"
                          onClick={() => handleEdit(exp)}
                          title="Edit"
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                        <button
                          className="icon-btn delete-btn"
                          onClick={() => askToDelete(exp._id)}
                          title="Delete"
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={modalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this expense?"
      />
    </>
  );
};

export default ExpenseList;
