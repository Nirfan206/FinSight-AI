import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api/axiosConfig";

export default function IncomePage() {
  const { setMetrics } = useOutletContext() || {};
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc");

  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    category: "Salary",
    description: "",
    recordDate: new Date().toISOString().split("T")[0]
  });

  const categories = ["Salary", "Freelance", "Investments", "Business", "Gifts", "Others"];

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      setErrorMessage("");
      setLoading(true);

      // FIXED: Removed duplicate "/api" segment since baseURL handles it
      const res = await api.get("/incomes");

      if (res.data && res.data.success) {
        const payload = res.data.data;
        setIncomes(payload && payload.content ? payload.content : (Array.isArray(payload) ? payload : []));
      }
    } catch (err) {
      console.warn("Could not load incomes:", err);
      const serverMsg = err?.response?.data?.message || err?.message || "An unexpected error occurred loading incomes.";
      setErrorMessage(serverMsg);
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerModalClose = () => {
    const modalEl = document.getElementById("addIncomeModal");
    if (modalEl) {
      modalEl.querySelector('[data-bs-dismiss="modal"]')?.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");
      const targetAmount = parseFloat(formData.amount);

      const payload = {
        amount: targetAmount,
        source: formData.source,
        category: formData.category,
        description: formData.description,
        recordDate: formData.recordDate
      };

      // FIXED: Removed duplicate "/api" segment
      const res = await api.post("/incomes", payload);

      if (res.data && res.data.success) {
        triggerModalClose();

        setFormData({
          amount: "",
          source: "",
          category: "Salary",
          description: "",
          recordDate: new Date().toISOString().split("T")[0]
        });

        fetchIncomes();

        if (setMetrics) {
          setMetrics((prev) => {
            const currentTotal = prev?.totalIncome || 0;
            const currentExpenses = prev?.totalExpenses || 0;
            const updatedIncome = currentTotal + targetAmount;
            return {
              ...prev,
              totalIncome: updatedIncome,
              currentSavings: Math.max(0, updatedIncome - currentExpenses)
            };
          });
        }
      }
    } catch (err) {
      console.error("Income save failed:", err);
      const serverMsg = err?.response?.data?.message || err?.message || "Could not save this income entry.";
      setErrorMessage(`Save Failed: ${serverMsg}`);
    }
  };

  const handleDelete = async (id, recordAmount) => {
    if (!window.confirm("Delete this income entry permanently?")) return;
    try {
      setErrorMessage("");
      // FIXED: Removed duplicate "/api" segment
      const res = await api.delete(`/incomes/${id}`);
      if (res.data && res.data.success) {
        setIncomes((prev) => prev.filter((item) => (item.incomeId || item.id) !== id));

        if (setMetrics) {
          setMetrics((prev) => {
            const currentTotal = prev?.totalIncome || 0;
            const currentExpenses = prev?.totalExpenses || 0;
            const updatedIncome = Math.max(0, currentTotal - recordAmount);
            return {
              ...prev,
              totalIncome: updatedIncome,
              currentSavings: Math.max(0, updatedIncome - currentExpenses)
            };
          });
        }
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.message || "Could not delete this entry.";
      setErrorMessage(serverMsg);
    }
  };

  const processedIncomes = (incomes || [])
    .filter((item) => {
      if (!item) return false;
      const sourceStr = item.source ? String(item.source) : "";
      const descStr = item.description ? String(item.description) : "";
      const matchSearch =
        sourceStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        descStr.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === "" || item.category === filterCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      const dateB = new Date(b.recordDate || 0);
      const dateA = new Date(a.recordDate || 0);
      if (sortBy === "dateDesc") return dateB - dateA;
      if (sortBy === "dateAsc") return dateA - dateB;
      if (sortBy === "amountDesc") return (b.amount || 0) - (a.amount || 0);
      if (sortBy === "amountAsc") return (a.amount || 0) - (b.amount || 0);
      return 0;
    });

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Incomes Register</h2>
          <p className="text-muted mb-0">Track cash inflows, revenue cycles, and variable streams.</p>
        </div>
        <button
          className="btn btn-primary rounded-3 fw-semibold px-4 py-2"
          data-bs-toggle="modal"
          data-bs-target="#addIncomeModal"
        >
          ➕ Register Inflow
        </button>
      </div>

      {errorMessage && <div className="alert alert-danger rounded-3 mb-4">{errorMessage}</div>}

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control border-light-subtle rounded-3"
              placeholder="🔍 Search source or note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <select
              className="form-select border-light-subtle rounded-3"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <select
              className="form-select border-light-subtle rounded-3"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dateDesc">Date: Latest First</option>
              <option value="dateAsc">Date: Oldest First</option>
              <option value="amountDesc">Amount: High to Low</option>
              <option value="amountAsc">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-5 text-center"><div className="spinner-border text-primary" /></div>
      ) : incomes.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div className="fs-1 mb-3">💰</div>
          <h4 className="fw-bold">No income entries yet</h4>
          <p className="text-muted">Log your first income record to start tracking.</p>
          <button
            className="btn btn-primary rounded-3 fw-semibold px-4 py-2 mt-2 mx-auto"
            data-bs-toggle="modal"
            data-bs-target="#addIncomeModal"
          >
            + Log New Record
          </button>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary border-bottom border-light-subtle">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="py-3">Source</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Notes</th>
                  <th className="py-3 text-end">Amount</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedIncomes.map((item) => {
                  const currentId = item.incomeId || item.id;
                  return (
                    <tr key={currentId || Math.random()} className="border-bottom border-light-subtle">
                      <td className="px-4 fw-medium text-dark">{item.recordDate || "—"}</td>
                      <td className="fw-semibold text-primary">{item.source || "—"}</td>
                      <td><span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-medium">{item.category}</span></td>
                      <td className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>{item.description || "—"}</td>
                      <td className="text-end fw-bold text-success font-monospace px-2">
                        {item.amount != null ? `₹${item.amount.toLocaleString()}` : "₹0"}
                      </td>
                      <td className="px-4 text-center">
                        <button 
                          className="btn btn-link text-danger p-1 text-decoration-none" 
                          onClick={() => handleDelete(currentId, item.amount || 0)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="modal fade" id="addIncomeModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom border-light-subtle px-4">
              <h5 className="modal-title fw-bold">Log Income Entry</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Source</label>
                  <input type="text" name="source" className="form-control rounded-3" required value={formData.source} onChange={handleInputChange} placeholder="e.g., Company Payment" />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Amount (INR)</label>
                    <input type="number" step="0.01" name="amount" className="form-control rounded-3" required value={formData.amount} onChange={handleInputChange} placeholder="0.00" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Category</label>
                    <select name="category" className="form-select rounded-3" value={formData.category} onChange={handleInputChange}>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Date</label>
                  <input type="date" name="recordDate" className="form-control rounded-3" required value={formData.recordDate} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Notes</label>
                  <textarea name="description" className="form-control rounded-3" rows="2" value={formData.description} onChange={handleInputChange} placeholder="Optional details..."></textarea>
                </div>
              </div>
              <div className="modal-footer border-top border-light-subtle px-4 py-3">
                <button type="button" className="btn btn-light rounded-3 px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary rounded-3 px-4">Save Income</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}