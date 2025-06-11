import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import API from "../../config/axios";
import BackHeader from "../../component/BackHeader/BackHeader";
import "./analyticsPage.css";
import useStore from "../../store/zustand";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a2d5f2",
  "#ffb6b9",
];

const AnalyticsPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [grouped, setGrouped] = useState([]);
  const { user } = useStore();

  const DAILY_LIMIT = user.dailyLimit;

  const [weeklyData, setWeeklyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const getWeeklyTrend = (expenses) => {
    const weekMap = {};
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday as start

    expenses.forEach((exp) => {
      const date = new Date(exp.date);

      if (date >= startOfWeek && date <= now) {
        const day = date.toLocaleDateString("en-IN", { weekday: "short" });

        if (!weekMap[day]) {
          weekMap[day] = 0;
        }
        weekMap[day] += exp.amount;
      }
    });

    const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return orderedDays.map((day) => ({
      day,
      amount: weekMap[day] || 0,
    }));
  };

  const transformGrouped = (grouped) => {
    return grouped.map((group) => ({
      name: group._id,
      value: group.totalAmount,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      await API.get("/expenses/filter?groupByCategory=true&order=desc").then(
        (res) => {
          setExpenses(res.data.expenses);
          setGrouped(res.data.grouped);

          setWeeklyData(getWeeklyTrend(res.data.expenses));
          setCategoryData(transformGrouped(res.data.grouped));
        }
      );
    };

    fetchData();
  }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const mostUsedCategory = grouped.reduce(
    (a, b) => (a.count > b.count ? a : b),
    {}
  );

  return (
    <>
      <BackHeader to="/" title="Expense Analytics" />
      <div className="analytics-container">
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3 className="analytics-subtitle">Weekly Expense Trend</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="var(--primary-color)"
                    strokeWidth={2}
                    name="Spent"
                  />

                  <ReferenceLine
                    y={DAILY_LIMIT}
                    label={{
                      value: `Limit (₹${DAILY_LIMIT})`,
                      position: "insideTopRight",
                      fill: "red",
                    }}
                    stroke="red"
                    strokeDasharray="3 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {categoryData.length !== 0 && (
            <div className="analytics-card">
              <h3 className="analytics-subtitle">Spending by Category</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                      dataKey="value"
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="analytics-summary">
          <p className="summary-text">
            <strong>Total Spent:</strong> ₹{totalSpent}
          </p>
          <p className="summary-text">
            <strong>Most Used Category:</strong> {mostUsedCategory._id || "N/A"}{" "}
            ({mostUsedCategory.count || 0} times)
          </p>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
