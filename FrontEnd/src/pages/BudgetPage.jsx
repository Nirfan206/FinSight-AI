import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Dynamic temporal boundary properties matching backend expectations
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JS months are 0-11, backend needs 1-12
  const currentYear = currentDate.getFullYear();

  // Form Field States
  const [formData, setFormData] = useState({
    category: "Food",
    limitAmount: ""
  });

  const blueprintCategories = ["Food", "Shopping", "Travel", "Entertainment", "Bills"];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchBudgets = async () => {
    try {
      setErrorMessage("");
      setLoading(true);
      // FIXED ENDPOINT: Now targeting the period mapping constraint properly
      const res = await axios.get(
        `http://localhost:8080/api/budgets/period?month=${currentMonth}&year=${currentYear}`, 
        getAuthConfig()
      );
      if (res.data && res.data.success) {
        setBudgets(res.data.data || []);
      }
    } catch (err) {
      console.warn("Initializing fresh fallback structure mapping array context:", err);
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
      
      // Constructing complete properties payload targeting backend fields
      const payload = {
        category: formData.category,
        limitAmount: parseFloat(formData.limitAmount),
        month: currentMonth,
        year: currentYear
      };

      const res = await axios.post("http://localhost:8080/api/budgets", payload, getAuthConfig());
      
      if (res.data && res.data.success) {
        fetchBudgets();
        setFormData({ category: "Food", limitAmount: "" });
        
        const modalEl = document.getElementById("configureBudgetModal");
        const dismissBtn = modalEl?.querySelector('[data-bs-dismiss="modal"]');
        dismissBtn?.click();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Could not register selected structural allocation boundaries.");
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Are you certain you want to remove this ledger rule parameter?")) return;
    try {
      setErrorMessage("");
      const res = await axios.delete(`http://localhost:8080/api/budgets/${id}`, getAuthConfig());
      if (res.data && res.data.success) {
        setBudgets((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      setErrorMessage("Could not terminate structural entry references.");
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Budget Controls</h2>
          <p className="text-muted mb-0">Establish spending limits, detect overages, and maintain structural discipline.</p>
        </div>
        <button 
          className="btn btn-primary rounded-3 fw-semibold px-4 py-2" 
          data-bs-toggle="modal" 
          data-bs-target="#configureBudgetModal"
        >
          ⚙️ Setup Cap
        </button>
      </div>

      {errorMessage && <div className="alert alert-danger rounded-3 mb-4">{errorMessage}</div>}

      {loading ? (
        <div className="p-5 text-center"><div className="spinner-border text-primary" /></div>
      ) : budgets.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div className="fs-1 mb-3">🛡️</div>
          <h4 className="fw-bold">No Active Category Envelopes Found</h4>
          <p className="text-muted max-w-md mx-auto">Establish targeted ceilings across your expenditure routes to activate matrix calculations.</p>
        </div>
      ) : (
        <div className="row g-4">
          {budgets.map((budget) => {
            const actual = budget.actualSpent || 0;
            const limit = budget.limitAmount || 0;
            const utilizationRate = limit > 0 ? ((actual / limit) * 100).toFixed(0) : 0;
            const remaining = limit - actual;
            const isOverBudget = remaining < 0;

            let progressColorClass = "bg-primary";
            if (utilizationRate >= 100) progressColorClass = "bg-danger";
            else if (utilizationRate >= 85) progressColorClass = "bg-warning";

            return (
              <div key={budget.id} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">{budget.category}</h5>
                    <button 
                      className="btn btn-sm btn-link text-muted p-0 text-decoration-none position-absolute" 
                      style={{ top: "15px", right: "15px" }} 
                      onClick={() => handleDeleteBudget(budget.id)}
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="d-flex justify-content-between text-muted small mb-2 mt-2">
                    <span>Usage Matrix</span>
                    <span className="fw-bold text-dark">{utilizationRate}%</span>
                  </div>

                  <div className="progress rounded-pill bg-light mb-3" style={{ height: "10px" }}>
                    <div
                      className={`progress-bar rounded-pill ${progressColorClass} transition-all`}
                      role="progressbar"
                      style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                    ></div>
                  </div>

                  <div className="row g-2 text-center pt-2 border-top border-light-subtle">
                    <div className="col-6 border-end border-light-subtle">
                      <span className="text-muted small d-block">Configured Cap</span>
                      <strong className="text-dark font-monospace">₹{limit.toLocaleString()}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted small d-block">{isOverBudget ? "Overage" : "Available"}</span>
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

      {/* Configuration Backdrop Modal Window */}
      <div className="modal fade" id="configureBudgetModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom border-light-subtle px-4">
              <h5 className="modal-title fw-bold">Configure Category Boundary</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Target Category Classification</label>
                  <select name="category" className="form-select rounded-3" value={formData.category} onChange={handleInputChange}>
                    {blueprintCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Ceiling Limit (INR)</label>
                  <input type="number" step="1" name="limitAmount" className="form-control rounded-3" required value={formData.limitAmount} onChange={handleInputChange} placeholder="e.g., 5000" />
                </div>
              </div>
              <div className="modal-footer border-top border-light-subtle px-4 py-3">
                <button type="button" id="closeBudgetModalBtn" className="btn btn-light rounded-3 px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary rounded-3 px-4">Enforce Envelope</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}