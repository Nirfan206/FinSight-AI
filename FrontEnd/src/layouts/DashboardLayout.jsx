import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fallback initial metrics context layout anchor definitions 
  const [metrics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    currentSavings: 0,
    budgetUtilization: 0,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", label: "📊 Overview" },
    { path: "/dashboard/income", label: "💰 Income Streams" },
    { path: "/dashboard/expenses", label: "💸 Expense Matrix" },
    { path: "/dashboard/budgets", label: "🛡️ Budget Controls" },
    { path: "/dashboard/goals", label: "🎯 Wealth Goals" },
    { path: "/dashboard/receipts", label: "📂 Receipt Vault" },
    { path: "/dashboard/ai-chat", label: "🤖 Gemini Assistant" },
    { path: "/dashboard/profile", label: "⚙️ User Settings" },
  ];

  return (
    <div className="d-flex min-vh-100 w-100 bg-light text-dark overflow-x-hidden">
      {/* Sidebar Navigation Panel */}
      <nav 
        className="bg-white border-end border-light-subtle d-flex flex-column h-100 position-sticky top-0"
        style={{ 
          width: isSidebarOpen ? "260px" : "0px",
          minWidth: isSidebarOpen ? "260px" : "0px",
          opacity: isSidebarOpen ? 1 : 0,
          visibility: isSidebarOpen ? "visible" : "hidden",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 1030
        }}
      >
        <div className="p-4 border-bottom border-light-subtle d-flex align-items-center justify-content-between">
          <span className="fs-5 fw-bold tracking-tight text-primary">FinSight AI</span>
        </div>
        
        <div className="flex-grow-1 py-3 px-2 overflow-y-auto style-scroll">
          <ul className="nav nav-pills flex-column gap-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/dashboard/");
              return (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link border-0 d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium transition-all ${
                      isActive 
                        ? "bg-primary text-white shadow-sm" 
                        : "text-secondary hover-bg-light"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-3 border-top border-light-subtle">
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 fw-semibold py-2"
          >
            🔒 Terminate Session
          </button>
        </div>
      </nav>

      {/* Main Content Viewport */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100 min-w-0 w-100 style-scroll">
        <header className="navbar navbar-expand bg-white border-bottom border-light-subtle px-4 py-3 sticky-top w-100">
          <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
            <button 
              className="btn btn-light border border-light-subtle rounded-3 p-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            
            <div className="d-flex align-items-center gap-3">
              <span className="small text-muted fw-medium d-none d-sm-inline">
                Operational Status: <span className="text-success fw-bold">● Active</span>
              </span>
              <div className="fw-semibold text-secondary small">Welcome back, User!</div>
            </div>
          </div>
        </header>

        {/* COMPREHENSIVE VIEW CONTAINER PORT */}
        <main className="flex-grow-1 p-4 p-md-5 bg-light w-100">
          <Outlet context={{ metrics }} />
        </main>
      </div>

      <style>{`
        .hover-bg-light:hover { background-color: #f8f9fa !important; color: #212529 !important; }
        .style-scroll::-webkit-scrollbar { width: 6px; }
        .style-scroll::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 4px; }
      `}</style>
    </div>
  );
}