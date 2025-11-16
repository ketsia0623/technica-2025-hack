import React, { useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from "recharts";
import { motion } from "framer-motion";
import "./Dashboard.css";
import Footer from "../components/footer";
import Header from "../components/header";

interface Entry {
  action: string;
  amount: string;
  date: string;
}

export default function Dashboard() {
  const [entriesByDate, setEntriesByDate] = React.useState<Record<string, Entry[]>>(() => {
    const saved = localStorage.getItem("entriesByDate");
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const greenShades = ["#82ca9d", "#66bb6a", "#43a047", "#2e7d32", "#1b5e20"];
  const currentEntries = entriesByDate[selectedDate] || [];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const addDays = (dateStr: string, days: number) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const handlePrevDay = () => setSelectedDate(prev => addDays(prev, -1));

  const saveEntries = (newEntries: Record<string, Entry[]>) => {
    setEntriesByDate(newEntries);
    localStorage.setItem("entriesByDate", JSON.stringify(newEntries));
  };

  const handleChangeAction = (index: number, value: string) => {
    const copy = [...currentEntries];
    copy[index].action = value;
    saveEntries({ ...entriesByDate, [selectedDate]: copy });
  };

  const handleChangeAmount = (index: number, value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const copy = [...currentEntries];
      copy[index].amount = value;
      saveEntries({ ...entriesByDate, [selectedDate]: copy });
    }
  };

  const handleAddEntry = () => {
    const copy = [...currentEntries, { action: "", amount: "", date: selectedDate }];
    saveEntries({ ...entriesByDate, [selectedDate]: copy });
    setTimeout(() => {
      const lastIndex = copy.length - 1;
      inputRefs.current[lastIndex]?.focus();
    }, 0);
  };

  const handleRemoveEntry = (index: number) => {
    const copy = currentEntries.filter((_, i) => i !== index);
    saveEntries({ ...entriesByDate, [selectedDate]: copy });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      const current = currentEntries[index];
      if (current.action.trim() !== "" || current.amount.trim() !== "") {
        handleAddEntry();
      }
    }
  };

  const chartData = currentEntries
    .filter(e => e.action.trim() !== "" || e.amount.trim() !== "")
    .map((e, index) => ({
      name: e.action || `Transaction ${index + 1}`,
      amount: parseFloat(e.amount || "0")
    }));

  const total = currentEntries.reduce(
    (sum, e) => sum + parseFloat(e.amount || "0"),
    0
  );

  const getMonthlyData = () => {
    const totals: { date: string; total: number }[] = [];
    const today = new Date(selectedDate);
    const year = today.getFullYear();
    const month = today.getMonth();

    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      if (date.getMonth() !== month) break;
      const dateStr = date.toISOString().split("T")[0];
      const dailyEntries = entriesByDate[dateStr] || [];
      const dailyTotal = dailyEntries.reduce((sum, e) => sum + parseFloat(e.amount || "0"), 0);
      totals.push({ date: day.toString(), total: dailyTotal });
    }

    return totals;
  };

  // ✅ Fake Nessie data import
  const importFromNessie = async () => {
    try {
      const mapped: Entry[] = [
        { action: "Coffee", amount: "3.5", date: selectedDate },
        { action: "Groceries", amount: "45.2", date: selectedDate },
        { action: "Uber", amount: "12.3", date: selectedDate },
      ];

      const newEntries = { ...entriesByDate };
      mapped.forEach(entry => {
        if (!newEntries[entry.date]) newEntries[entry.date] = [];
        newEntries[entry.date].push(entry);
      });

      saveEntries(newEntries);
      alert("Imported fake transactions!");
    } catch (err) {
      console.error(err);
      alert("Failed to import transactions");
    }
  };

  const generateFakeMonth = () => {
    const newEntries = { ...entriesByDate };
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(i);
      const dateStr = date.toISOString().split("T")[0];

      newEntries[dateStr] = [
        { action: "Coffee", amount: (Math.random()*5).toFixed(2), date: dateStr },
        { action: "Lunch", amount: (Math.random()*15).toFixed(2), date: dateStr },
      ];
    }
    saveEntries(newEntries);
    alert("Generated fake month of transactions!");
  };

  const getProgressColor = (amount: number) => {
    if (amount < 50) return "#2ecc71"; // green
    if (amount < 150) return "#f1c40f"; // yellow
    return "#e74c3c"; // red
  };

  return (
    <div className="login-page">
      <Header />
      <div className="dashboard-container">
        <h2>
          Daily Spending Dashboard &nbsp;
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="header-date-picker"
          />
     
          <div className="dashboard-buttons">
          <button className="import-btn" onClick={importFromNessie}>
            Import Nessie Bank Data
          </button>
          <button className="import-btn" onClick={generateFakeMonth}>
            Generate Fake Month
          </button>
          </div>

        </h2>

        <div className="day-navigation">
          <button onClick={handlePrevDay}>Prev</button>
          <span>{formatDate(selectedDate)}</span>
          <button onClick={handleNextDay}>Next</button>
        </div>

        {currentEntries.map((entry, index) => (
          <div key={index} className="entry-row">
            <input
              type="text"
              placeholder="Enter your transaction"
              value={entry.action}
              onChange={e => handleChangeAction(index, e.target.value)}
              onKeyDown={e => handleKeyDown(e, index)}
              ref={el => { inputRefs.current[index] = el; }}
              className="entry-action"
            />
            <input
              type="text"
              placeholder="$"
              value={entry.amount}
              onChange={e => handleChangeAmount(index, e.target.value)}
              onKeyDown={e => handleKeyDown(e, index)}
              className="entry-amount"
            />
            <button className="remove-btn" onClick={() => handleRemoveEntry(index)}>
              Remove
            </button>
          </div>
        ))}

        <button className="add-entry-btn" onClick={handleAddEntry}>Add Entry</button>

        <hr />

        <motion.h3
          key={total}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Total Spent on {formatDate(selectedDate)}: ${total.toFixed(2)}
        </motion.h3>

        <div className="progress-bar-wrapper">
          <div
            className="progress-bar"
            style={{
              width: `${Math.min((total / 200) * 100, 100)}%`,
              background: getProgressColor(total),
              height: "10px",
              borderRadius: "5px",
              transition: "width 0.5s ease"
            }}
          ></div>
        </div>

        <div className="charts-wrapper">
          <div className="bar-chart-container">
            <h3>Daily Transactions</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#145214" />
                  <YAxis stroke="#145214" />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="amount" isAnimationActive={true}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={greenShades[index % greenShades.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-transactions">No transactions for this day</p>
            )}
          </div>

          <div className="line-chart-container">
            <h3>Monthly Spending Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getMonthlyData()} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#145214" />
                <YAxis stroke="#145214" />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Line type="monotone" dataKey="total" stroke="#82ca9d" strokeWidth={3} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
