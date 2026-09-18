import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api/axiosConfig";

export default function BudgetPage() {
  const { setMetrics } = useOutletContext() || {}; // FIXED: Injected context to stream real-time allocation state
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [formData, setFormData] = useState({
    category: "Food",
    monthlyLimit: ""
  });

  const categories = ["Food", "Shopping", "Travel", "Entertainment", "Bills"];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const enrichWithSpend = async (budgetList) => {
    const enriched = await Promise.all(
      budgetList.map(async (b) => {
        try {
          const res = await api.get(
            `/expenses/category-total?category=${encodeURIComponent(b.category)}&month=${b.budgetMonth}&year=${b.budgetYear}`
          );
          return { ...b, actualSpent: res.data?.data ?? 0 };
        } catch {
          return { ...b, actualSpent: 0 };
        }
      })
    );
    return enriched;
  };

  const fetchBudgets = async () => {
    try {
      setErrorMessage("");
      setLoading(true);
      const res = await api.get(`/budgets/period?month=${currentMonth}&year=${currentYear}`);
      if (res.data && res.data.success) {
        const enriched = await enrichWithSpend(res.data.data || []);
        setBudgets(enriched);
        
        // Dynamic state sync computation for parent layouts context
        if (setMetrics && enriched.length > 0) {
          const totalLimits = enriched.reduce((acc, curr) => acc + (curr.monthlyLimit || 0), 0);
          const totalSpent = enriched.reduce((acc, curr) => acc + (curr.actualSpent || 0), 0);
          const computedUtilization = totalLimits > 0 ? Math.round((totalSpent / totalLimits) * 100) : 0;
          
          setMetrics((prev) => ({
            ...prev,
            budgetUtilization: computedUtilization
          }));
        }
      }
    } catch (err) {
      console.warn("Could not load budgets:", err);
      const serverMessage = err?.response?.data?.message || err?.message || "Could not load budgets.";
      setErrorMessage(serverMessage);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");
      const payload = {
        category: formData.category,
        monthlyLimit: parseFloat(formData.monthlyLimit),
        budgetMonth: currentMonth,
        budgetYear: currentYear
      };

      const res = await api.post("/budgets", payload);

      if (res.data && res.data.success) {
        await fetchBudgets();
        setFormData({ category: "Food", monthlyLimit: "" });

        const modalEl = document.getElementById("configureBudgetModal");
        modalEl?.querySelector('[data-bs-dismiss="modal"]')?.click();
      }
    } catch (err) {
      const serverMessage = err?.response?.data?.message || err?.message || "Could not save this budget.";
      setErrorMessage(serverMessage);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Remove this budget category?")) return;
    try {
      setErrorMessage("");
      const res = await api.delete(`/budgets/${id}`);
      if (res.data && res.data.success) {
        const updatedBudgets = budgets.filter((item) => item.budgetId !== id);
        setBudgets(updatedBudgets);
        
        if (setMetrics) {
          const totalLimits = updatedBudgets.reduce((acc, curr) => acc + (curr.monthlyLimit || 0), 0);
          const totalSpent = updatedBudgets.reduce((acc, curr) => acc + (curr.actualSpent || 0), 0);
          const computedUtilization = totalLimits > 0 ? Math.round((totalSpent / totalLimits) * 100) : 0;
          
          setMetrics((prev) => ({
            ...prev,
            budgetUtilization: computedUtilization
          }));
        }
      }
    } catch (err) {
      const serverMessage = err?.response?.data?.message || err?.message || "Could not delete this budget.";
      setErrorMessage(serverMessage);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Budget Controls</h2>
          <p className="text-muted mb-0">Set spending limits per category for the current month.</p>
        </div>
        <button className="btn btn-primary rounded-3 fw-semibold px-4 py-2" data-bs-toggle="modal" data-bs-target="#configureBudgetModal">
          ⚙️ New Budget
        </button>
      </div>

      {errorMessage && <div className="alert alert-danger rounded-3 mb-4">{errorMessage}</div>}

      {loading ? (
        <div className="p-5 text-center"><div className="spinner-border text-primary" /></div>
      ) : budgets.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div className="fs-1 mb-3">🛡️</div>
          <h4 className="fw-bold">No budgets set for this month</h4>
          <p className="text-muted">Add a category limit to start tracking utilization.</p>
          <button className="btn btn-primary rounded-3 fw-semibold px-4 py-2 mt-2 mx-auto" data-bs-toggle="modal" data-bs-target="#configureBudgetModal">
            + Add First Budget Limit
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {budgets.map((budget) => {
            const actual = budget.actualSpent || 0;
            const limit = budget.monthlyLimit || 0;
            const utilizationRate = limit > 0 ? Math.round((actual / limit) * 100) : 0;
            const remaining = limit - actual;
            const isOverBudget = remaining < 0;

            let progressColorClass = "bg-primary";
            if (utilizationRate >= 100) progressColorClass = "bg-danger";
            else if (utilizationRate >= 85) progressColorClass = "bg-warning";

            return (
              <div key={budget.budgetId} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">{budget.category}</h5>
                    <button
                      className="btn btn-sm btn-link text-muted p-0 text-decoration-none position-absolute"
                      style={{ top: "15px", right: "15px" }}
                      onClick={() => handleDeleteBudget(budget.budgetId)}
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="d-flex justify-content-between text-muted small mb-2 mt-2">
                    <span>Usage</span>
                    <span className="fw-bold text-dark">{utilizationRate}%</span>
                  </div>

                  <div className="progress rounded-pill bg-light mb-3" style={{ height: "10px" }}>
                    <div className={`progress-bar rounded-pill ${progressColorClass}`} role="progressbar" style={{ width: `${Math.min(utilizationRate, 100)}%` }}></div>
                  </div>

                  <div className="row g-2 text-center pt-2 border-top border-light-subtle">
                    <div className="col-6 border-end border-light-subtle">
                      <span className="text-muted small d-block">Limit</span>
                      <strong className="text-dark font-monospace">₹{limit.toLocaleString()}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted small d-block">{isOverBudget ? "Over by" : "Remaining"}</span>
                      <strong className={`font-monospace ${isOverBudget ? "text-danger" : "text-success"}`}>
                        ₹{Math.abs(remaining).toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="modal fade" id="configureBudgetModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom border-light-subtle px-4">
              <h5 className="modal-title fw-bold">Set Category Budget</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Category</label>
                  <select name="category" className="form-select rounded-3" value={formData.category} onChange={handleInputChange}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Monthly Limit (INR)</label>
                  <input type="number" step="1" name="monthlyLimit" className="form-control rounded-3" required value={formData.monthlyLimit} onChange={handleInputChange} placeholder="e.g., 5000" />
                </div>
              </div>
              <div className="modal-footer border-top border-light-subtle px-4 py-3">
                <button type="button" className="btn btn-light rounded-3 px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary rounded-3 px-4">Save Budget</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}