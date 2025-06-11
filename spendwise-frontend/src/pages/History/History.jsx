import { useEffect, useState } from "react";
import "./history.css";
import useExpense from "../../store/useExpense";
import BackHeader from "../../component/BackHeader/BackHeader";
import useStore from "../../store/zustand";

const History = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(null)
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
    date: "",
    minAmount: "",
    maxAmount: "",
    groupByCategory: false,
    sortBy: "",
    order: "desc",
    dateFilterType: "single",
  });
  const [total, setTotal] = useState(0);
  const [grouped, setGrouped] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { filterExpense } = useExpense();
  const { user } = useStore();

  const fetchExpenses = async () => {
    setIsLoading(true);
    const query = new URLSearchParams();

    const dateParams =
      filters.dateFilterType === "single"
        ? { date: filters.date }
        : { startDate: filters.startDate, endDate: filters.endDate };

    Object.entries({ ...filters, ...dateParams }).forEach(([key, value]) => {
      if (value !== "" && value !== false && key !== "dateFilterType") {
        if (
          (filters.dateFilterType === "single" &&
            (key === "startDate" || key === "endDate")) ||
          (filters.dateFilterType === "range" && key === "date")
        ) {
          return;
        }
        query.append(key, value);
      }
    });

    await filterExpense(query, setExpenses, setTotal, setGrouped, setIsLoading, setCategories);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleDateFilterType = () => {
    setFilters((prev) => ({
      ...prev,
      dateFilterType: prev.dateFilterType === "range" ? "single" : "range",
      date: "",
      startDate: "",
      endDate: "",
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
    <BackHeader title="Expense History" to="/" />
      <div className="history-dashboard">
        <div className="dashboard-header-h">
          {/* <h2>Expense History</h2> */}
          <div className="summary-card">
            <span>
              Total Expenses: <b>{user.currency}{total}</b>
            </span>
            <span>{expenses?.length} records</span>
          </div>
        </div>

        <div className="filter-card">
          <h3>Filter Expenses</h3>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Category</label>
              <select
                name="category"
                onChange={handleChange}
                value={filters.category}
              >
                <option value="">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <div className="date-filter-toggle">
                <label>Date Filter:</label>
                <button
                  type="button"
                  className={`toggle-btn ${
                    filters.dateFilterType === "range" ? "active" : ""
                  }`}
                  onClick={toggleDateFilterType}
                >
                  Range
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${
                    filters.dateFilterType === "single" ? "active" : ""
                  }`}
                  onClick={toggleDateFilterType}
                >
                  Single Date
                </button>
              </div>

              {filters.dateFilterType === "range" ? (
                <div className="date-range">
                  <input
                    type="date"
                    name="startDate"
                    onChange={handleChange}
                    value={filters.startDate}
                  />
                  <span>to</span>
                  <input
                    type="date"
                    name="endDate"
                    onChange={handleChange}
                    value={filters.endDate}
                  />
                </div>
              ) : (
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  value={filters.date}
                />
              )}
            </div>

            <div className="filter-group">
              <label>Amount Range</label>
              <div className="amount-range">
                <input
                  type="number"
                  name="minAmount"
                  placeholder="Min"
                  onChange={handleChange}
                  value={filters.minAmount}
                />
                <span>to</span>
                <input
                  type="number"
                  name="maxAmount"
                  placeholder="Max"
                  onChange={handleChange}
                  value={filters.maxAmount}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <div className="sort-options">
                <select
                  name="sortBy"
                  onChange={handleChange}
                  value={filters.sortBy}
                >
                  <option value="">Default</option>
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
                <select
                  name="order"
                  onChange={handleChange}
                  value={filters.order}
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>

            <div className="filter-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="groupByCategory"
                  onChange={handleChange}
                  checked={filters.groupByCategory}
                />
                Group by Category
              </label>
            </div>

            <button
              className="apply-btn"
              onClick={fetchExpenses}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  Apply Filters
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <span className="spinner"></span>
            <p>Loading expenses...</p>
          </div>
        ) : grouped ? (
          <div className="category-grid">
            <div className="section-header">
              <h3>All Expenses</h3>
            </div>
            {grouped?.map((g) => (
              <div key={g._id} className="category-card">
                <div className="category-header">
                  <span className={`category-tag ${g._id.toLowerCase()}`}>
                    {g._id}
                  </span>
                  <span className="category-total">{user.currency}{g.totalAmount}</span>
                </div>
                <div className="category-details">
                  <span>
                    {g.count} {g.count === 1 ? "entry" : "entries"}
                  </span>
                  <span>Avg: {user.currency}{(g.totalAmount / g.count).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="expense-results">
            <div className="section-header">
              <h3>All Expenses</h3>
            </div>

            {expenses?.length === 0 ? (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3h18v18H3zM8 8v8m8-8v8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <p>No expenses found</p>
                <small>Try adjusting your filters</small>
              </div>
            ) : (
              <div className="expense-table">
                <div className="table-row-h">
                  <span>Description</span>
                  <span>Amount</span>
                  <span>Category</span>
                  <span>Date</span>
                </div>
                <div className="table-body">
                  {expenses?.map((exp) => (
                    <div key={exp._id} className="table-row-h">
                      <span className="description">{exp.title}</span>
                      <span className="amount">{user.currency}{exp.amount}</span>
                      <span className="category">
                        <span
                          className={`category-tag ${exp.category.toLowerCase()}`}
                        >
                          {exp.category}
                        </span>
                      </span>
                      <span className="date">{formatDate(exp.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
