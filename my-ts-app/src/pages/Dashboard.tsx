import React, { useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import "./Dashboard.css";
import Footer from "../components/footer";
import Header from "../components/header";

interface Entry {
  action: string;
  amount: string;
  date: string;
}

export default function Dashboard() {
  const [entriesByDate, setEntriesByDate] = React.useState<Record<string, Entry[]>>({});
  const [selectedDate, setSelectedDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const greenShades = ["#82ca9d", "#66bb6a", "#43a047", "#2e7d32", "#1b5e20"];

  const currentEntries = entriesByDate[selectedDate] || [];

  const addDays = (dateStr: string, days: number) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const handlePrevDay = () => setSelectedDate(prev => addDays(prev, -1));

  const handleChangeAction = (index: number, value: string) => {
    const copy = [...currentEntries];
    copy[index].action = value;
    setEntriesByDate({ ...entriesByDate, [selectedDate]: copy });
  };

  const handleChangeAmount = (index: number, value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const copy = [...currentEntries];
      copy[index].amount = value;
      setEntriesByDate({ ...entriesByDate, [selectedDate]: copy });
    }
  };

  const handleAddEntry = () => {
    const copy = [...currentEntries, { action: "", amount: "", date: selectedDate }];
    setEntriesByDate({ ...entriesByDate, [selectedDate]: copy });
    setTimeout(() => {
      const lastIndex = copy.length - 1;
      inputRefs.current[lastIndex]?.focus();
    }, 0);
  };

  const handleRemoveEntry = (index: number) => {
    const copy = currentEntries.filter((_, i) => i !== index);
    setEntriesByDate({ ...entriesByDate, [selectedDate]: copy });
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
        </h2>

        <div className="day-navigation">
          <button onClick={handlePrevDay}>Prev</button>
          <span>{selectedDate}</span>
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
              ref={el => {
                inputRefs.current[index] = el;
              }}
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

        <h3>Total Spent on {selectedDate}: ${total.toFixed(2)}</h3>

        <h3>Transactions Bar Chart</h3>
        {chartData.length > 0 ? (
          <div className="bar-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />

                {/* ← UPDATED: horizontal labels */}
                <XAxis 
                  dataKey="name" 
                  stroke="#145214"
                />

                <YAxis stroke="#145214" />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />

                <Bar dataKey="amount">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={greenShades[index % greenShades.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="no-transactions">No transactions for this day</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
