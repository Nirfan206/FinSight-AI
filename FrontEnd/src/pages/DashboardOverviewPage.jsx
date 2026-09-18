import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    totalExpense: 0,
    currentSavings: 0,
    budgetUsedPercentage: 0,
    financialHealthScore: 100,
  });

  const [aiInsight, setAiInsight] = useState(
    "Initializing workspace telemetry data..."
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardTelemetry = async () => {
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const config = {
          params: {
            month: currentMonth,
            year: currentYear,
          },
        };

        const [incomeResponse, expenseResponse] = await Promise.all([
          api.get("/incomes/monthly-total", config),
          api.get("/expenses/monthly-total", config),
        ]);

        const liveIncome =
          incomeResponse.data && incomeResponse.data.success
            ? Number(incomeResponse.data.data) || 0
            : 0;

        const liveExpense =
          expenseResponse.data && expenseResponse.data.success
            ? Number(expenseResponse.data.data) || 0
            : 0;

        const liveSavings = Math.max(0, liveIncome - liveExpense);

        const liveBudgetUsage =
          liveIncome > 0
            ? Math.round((liveExpense / liveIncome) * 100)
            : 0;

        let computedInsight =
          "Welcome to FinSight AI! Log your initial income streams or transaction matrices to generate predictive insights.";

        let computedHealthScore = 100;

        if (liveIncome > 0 || liveExpense > 0) {
          computedInsight = `Active telemetry synchronization confirmed. Income: ₹${liveIncome.toLocaleString()} | Expenses: ₹${liveExpense.toLocaleString()}. Keep tracking entries to build predictive audit metrics.`;

          computedHealthScore = Math.max(
            30,
            100 - Math.min(liveBudgetUsage, 100)
          );
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
        console.error("Dashboard overview query failed:", err);

        setAiInsight(
          "Telemetry data synchronization unavailable. Displaying local zero-state workspace."
        );
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
          <span className="visually-hidden">
            Loading Dashboard Data...
          </span>
        </div>
      </div>
    );
  }

  /*
   * REAL DATA FROM YOUR EXISTING API
   *
   * At the moment your backend gives us current-month totals.
   * Therefore we create a current-month financial comparison chart
   * instead of inventing historical data.
   */
  const financialChartData = [
    {
      name: "Current Month",
      Income: metrics.totalIncome,
      Expense: metrics.totalExpense,
      Savings: metrics.currentSavings,
    },
  ];

  /*
   * REAL DATA:
   * We currently know Income, Expense and Savings.
   *
   * Once your backend exposes expense-category data
   * (Food / Travel / Rent / etc.), this can be replaced
   * with the real category response.
   */
  const allocationData = [
    {
      name: "Expenses",
      value: metrics.totalExpense,
    },
    {
      name: "Savings",
      value: metrics.currentSavings,
    },
  ].filter((item) => item.value > 0);

  const PIE_COLORS = ["#dc3545", "#198754"];

  return (
    <div className="container-fluid p-0 animate-fade-in">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">
            📊 Workspace Overview
          </h2>

          <p className="text-muted mb-0">
            Real-time health telemetry and financial insights.
          </p>
        </div>

        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
          🗓️ Current Cycle
        </span>
      </div>

      {/* AI INSIGHT */}
      <div className="card border-0 shadow-sm bg-gradient-primary-to-secondary text-white rounded-4 mb-4 p-4">
        <div className="d-flex align-items-start gap-3">
          <div className="fs-3">🤖</div>

          <div>
            <h5 className="fw-bold mb-1">
              FinSight AI Smart Recommendation
            </h5>

            <p className="mb-0 opacity-90 fw-medium text-light">
              {aiInsight}
            </p>
          </div>
        </div>
      </div>

      {/* METRICS */}
      <div className="row g-4 mb-5">

        {/* INCOME */}
        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <span className="text-muted small fw-bold text-uppercase tracking-wider">
              Total Income
            </span>

            <h3 className="fw-bold text-success my-2">
              ₹{metrics.totalIncome.toLocaleString()}
            </h3>

            <span className="text-muted small">
              📈 Stable Streams
            </span>
          </div>
        </div>

        {/* EXPENSE */}
        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <span className="text-muted small fw-bold text-uppercase tracking-wider">
              Total Expenses
            </span>

            <h3 className="fw-bold text-danger my-2">
              ₹{metrics.totalExpense.toLocaleString()}
            </h3>

            <span className="text-muted small">
              📉 Action Required
            </span>
          </div>
        </div>

        {/* SAVINGS */}
        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <span className="text-muted small fw-bold text-uppercase tracking-wider">
              Current Savings
            </span>

            <h3 className="fw-bold text-primary my-2">
              ₹{metrics.currentSavings.toLocaleString()}
            </h3>

            <span className="text-muted small">
              🛡️ Emergency Reserve
            </span>
          </div>
        </div>

        {/* BUDGET */}
        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <span className="text-muted small fw-bold text-uppercase tracking-wider">
              Budget Utilization
            </span>

            <h3 className="fw-bold text-dark my-2">
              {metrics.budgetUsedPercentage}%
            </h3>

            <div
              className="progress rounded-pill bg-light"
              style={{ height: "6px" }}
            >
              <div
                className="progress-bar bg-warning rounded-pill"
                role="progressbar"
                style={{
                  width: `${Math.min(
                    metrics.budgetUsedPercentage,
                    100
                  )}%`,
                }}
                aria-valuenow={metrics.budgetUsedPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>

        {/* HEALTH SCORE */}
        <div className="col-12 col-md-6 col-lg-4 col-xl">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-white bg-dark">
            <span className="text-white-50 small fw-bold text-uppercase tracking-wider">
              AI Health Score
            </span>

            <div className="d-flex align-items-baseline gap-2 my-1">
              <h2 className="fw-extrabold display-6 text-warning mb-0">
                {metrics.financialHealthScore}
              </h2>

              <span className="text-white-50 small">
                /100
              </span>
            </div>

            <span className="text-success small fw-semibold">
              ✔ Optimal Configuration
            </span>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="row g-4">

        {/* INCOME VS EXPENSE */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0">
                Income vs Expense Variance
              </h5>

              <span className="badge bg-light text-dark">
                Current Month
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: "280px",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialChartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="name" />

                  <YAxis
                    tickFormatter={(value) =>
                      `₹${Number(value).toLocaleString()}`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString()}`
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="Income"
                    fill="#198754"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="Expense"
                    fill="#dc3545"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="Savings"
                    fill="#0d6efd"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

        {/* ALLOCATION */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">

            <h5 className="fw-bold text-dark mb-3">
              Financial Allocation
            </h5>

            {allocationData.length > 0 ? (
              <div
                style={{
                  width: "100%",
                  height: "280px",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_COLORS[index % PIE_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString()}`
                      }
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div
                className="bg-light rounded-4 d-flex align-items-center justify-content-center"
                style={{ minHeight: "280px" }}
              >
                <div className="text-center text-muted">
                  <div className="display-6 mb-2">
                    📊
                  </div>

                  <p className="mb-1 fw-semibold">
                    No financial data yet
                  </p>

                  <small>
                    Add income and expenses to populate
                    this chart.
                  </small>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* STYLES */}
      <style>{`
        .bg-gradient-primary-to-secondary {
          background: linear-gradient(
            135deg,
            #4f46e5 0%,
            #3b82f6 100%
          ) !important;
        }

        .fw-extrabold {
          font-weight: 800 !important;
        }

        .tracking-wider {
          letter-spacing: 0.05em;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}