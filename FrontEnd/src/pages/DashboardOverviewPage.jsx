import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    totalExpense: 0,
    currentSavings: 0,
    budgetUsedPercentage: 0,
    financialHealthScore: 100, // Starts optimal for fresh zero-state matrix initialization
  });
  const [aiInsight, setAiInsight] = useState("Initializing workspace telemetry data...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardTelemetry = async () => {
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // JS Months are 0-indexed
        const currentYear = currentDate.getFullYear();
        
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        const config = {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
          params: {
            month: currentMonth,
            year: currentYear
          },
          withCredentials: true
        };

        // FIXED: Concurrent API mesh calls fetching both income and expense real totals from backend database layers
        const [incomeResponse, expenseResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/incomes/monthly-total", config),
          axios.get("http://localhost:8080/api/expenses/monthly-total", config)
        ]);
        
        // Safely parse data streams from custom backend ApiResponse payload wrappers
        const liveIncome = incomeResponse.data && incomeResponse.data.success ? incomeResponse.data.data : 0;
        const liveExpense = expenseResponse.data && expenseResponse.data.success ? expenseResponse.data.data : 0;

        const liveSavings = Math.max(0, liveIncome - liveExpense);
        const liveBudgetUsage = liveIncome > 0 ? Math.round((liveExpense / liveIncome) * 100) : 0;
        
        // Dynamic AI Recommendation generation framework base configuration
        let computedInsight = "Welcome to FinSight AI! Log your initial income streams or transaction matrices to generate predictive insights.";
        let computedHealthScore = 100;

        if (liveIncome > 0 || liveExpense > 0) {
          computedInsight = `Active telemetry synchronization confirmed. Income: ₹${liveIncome.toLocaleString()} | Expenses: ₹${liveExpense.toLocaleString()}. Keep tracking entries to build predictive audit metrics.`;
          computedHealthScore = Math.max(30, 100 - liveBudgetUsage);
        }

        setMetrics({
          totalIncome: liveIncome,
          totalExpense: liveExpense,
          currentSavings: liveSavings,
          budgetUsedPercentage: liveBudgetUsage,
          financialHealthScore: computedHealthScore,
        });
        setAiInsight(computedInsight);

      } catch (err) {
        console.error("Dashboard overview telemetry link matrix collection failure:", err);
        // Clean absolute zero fault-tolerant fallback so app workspace UI never breaks
        setAiInsight("Telemetry data synchronization unavailable. Displaying local zero-state workspace.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardTelemetry();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">📊 Workspace Overview</h2>
          <p className="text-muted mb-0">Real-time health telemetry and financial insights.</p>
        </div>
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
          🗓️ Current Cycle
        </span>
      </div>

      {/* AI Insights Banner Section */}
      <div className="card border-0 shadow-sm bg-gradient-primary-to-secondary text-white rounded-4 mb-4 p-4">
        <div className="d-flex align-items-start gap-3">
          <div className="fs-3">🤖</div>
          <div>
            <h5 className="fw-bold mb-1">FinSight AI Smart Recommendation</h5>
            <p className="mb-0 opacity-90 fw-medium text-light">{aiInsight}</p>
          </div>
        </div>
      </div>

      {/* KPI 5-Card Analytics Grid Matrix */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <span className="text-muted small fw-bold text-uppercase tracking-wider">Total Income</span>
            <h3 className="fw-bold text-success my-2">₹{metrics.totalIncome.toLocaleString()}</h3>
            <span className="text-muted small">📈 Stable Streams</span>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <span className="text-muted small fw-bold text-uppercase tracking-wider">Total Expenses</span>
            <h3 className="fw-bold text-danger my-2">₹{metrics.totalExpense.toLocaleString()}</h3>
            <span className="text-muted small">📉 Action Required</span>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <span className="text-muted small fw-bold text-uppercase tracking-wider">Current Savings</span>
            <h3 className="fw-bold text-primary my-2">₹{metrics.currentSavings.toLocaleString()}</h3>
            <span className="text-muted small">🛡️ Emergency Reserve</span>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <span className="text-muted small fw-bold text-uppercase tracking-wider">Budget Utilization</span>
            <h3 className="fw-bold text-dark my-2">{metrics.budgetUsedPercentage}%</h3>
            <div className="progress rounded-pill bg-light" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-warning rounded-pill"
                role="progressbar"
                style={{ width: `${Math.min(metrics.budgetUsedPercentage, 100)}%` }}
                aria-valuenow={metrics.budgetUsedPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-white bg-dark">
            <span className="text-white-50 small fw-bold text-uppercase tracking-wider">AI Health Score</span>
            <div className="d-flex align-items-baseline gap-2 my-1">
              <h2 className="fw-extrabold display-6 text-warning mb-0">{metrics.financialHealthScore}</h2>
              <span className="text-white-50 small">/100</span>
            </div>
            <span className="text-success small fw-semibold">✔ Optimal Configuration</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">Income vs Expense Variance</h5>
            <div className="bg-light rounded-4 d-flex align-items-center justify-content-center border border-dashed border-light-subtle" style={{ minHeight: "280px" }}>
              <div className="text-center text-muted p-3">
                <i className="bi bi-graph-up display-6 text-secondary mb-2"></i>
                <p className="small mb-0">Monthly Trend Chart Placeholder</p>
                <span className="text-muted extra-small">To initialize, execute: <code>npm install recharts</code></span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-dark mb-3">Category Allocation</h5>
            <div className="bg-light rounded-4 d-flex align-items-center justify-content-center border border-dashed border-light-subtle" style={{ minHeight: "280px" }}>
              <div className="text-center text-muted p-3">
                <i className="bi bi-pie-chart display-6 text-secondary mb-2"></i>
                <p className="small mb-0">Pie Distribution Visualizer</p>
                <span className="text-muted extra-small">Maps allocations dynamically across Food, Travel, and Rent.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-gradient-primary-to-secondary {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%) !important;
        }
        .fw-extrabold { font-weight: 800 !important; }
        .extra-small { font-size: 0.75rem !important; }
        .border-dashed { border-style: dashed !important; }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}