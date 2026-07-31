import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

export default function IncomePage() {
  const { setMetrics } = useOutletContext() || {};
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc");

  // Form Field States
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

  // Helper method to look up tokens from local storage safely
  const getAuthConfig = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchIncomes = async () => {
    try {
      setErrorMessage("");
      setLoading(true);
      
      const res = await axios.get("http://localhost:8080/api/incomes", getAuthConfig());
      
      if (res.data && res.data.success) {
        const payload = res.data.data;
        if (payload && payload.content) {
          setIncomes(payload.content); 
        } else {
          setIncomes(payload || []);
        }
      }
    } catch (err) {
      console.warn("Initializing fresh income matrix stream baseline tracking:", err);
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
      const dismissBtn = modalEl.querySelector('[data-bs-dismiss="modal"]');
      dismissBtn?.click();
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

      const res = await axios.post("http://localhost:8080/api/incomes", payload, getAuthConfig());
      
      if (res.data && res.data.success) {
        const nextRecord = res.data.data;
        
        // 1. Close the modal view cleanly BEFORE modifying state tree references
        triggerModalClose();
        
        // 2. Clear out local input parameters
        setFormData({ 
          amount: "", 
          source: "", 
          category: "Salary", 
          description: "", 
          recordDate: new Date().toISOString().split("T")[0] 
        });

        // 3. Commit records locally to the tabular view list
        setIncomes((prev) => [nextRecord, ...prev]);

        // 4. Update parent analytics workspace counters dynamically without triggering full loop re-renders
        if (setMetrics) {
          setMetrics((prev) => {
            const updatedIncome = prev.totalIncome + targetAmount;
            return {
              ...prev,
              totalIncome: updatedIncome,
              currentSavings: Math.max(0, updatedIncome - prev.totalExpenses)
            };
          });
        }
      }
    } catch (err) {
      console.error("Income persist mapping error stream caught:", err);
      setErrorMessage(err.response?.data?.message || "Validation failure occurred while posting records.");
    }
  };

  const handleDelete = async (id, recordAmount) => {
    if (!window.confirm("Are you certain you want to remove this ledger allocation entry?")) return;
    try {
      setErrorMessage("");
      const res = await axios.delete(`http://localhost:8080/api/incomes/${id}`, getAuthConfig());
      if (res.data && res.data.success) {
        setIncomes((prev) => prev.filter((item) => item.id !== id));
        
        if (setMetrics) {
          setMetrics((prev) => {
            const updatedIncome = Math.max(0, prev.totalIncome - recordAmount);
            return {
              ...prev,
              totalIncome: updatedIncome,
              currentSavings: Math.max(0, updatedIncome - prev.totalExpenses)
            };
          });
        }
      }
    } catch (err) {
      setErrorMessage("Could not terminate selected entry layout structural reference.");
    }
  };

  const processedIncomes = incomes
    .filter((item) => {
      const sourceStr = item.source ? String(item.source) : "";
      const descStr = item.description ? String(item.description) : "";
      const matchSearch = sourceStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          descStr.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === "" || item.category === filterCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      const dateB = new Date(b.recordDate || b.incomeDate);
      const dateA = new Date(a.recordDate || a.incomeDate);
      
      if (sortBy === "dateDesc") return dateB - dateA;
      if (sortBy === "dateAsc") return dateA - dateB;
      if (sortBy === "amountDesc") return b.amount - a.amount;
      if (sortBy === "amountAsc") return a.amount - b.amount;
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

      {loading ? (
        <div className="p-5 text-center"><div className="spinner-border text-primary" /></div>
      ) : incomes.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div className="fs-1 mb-3">💰</div>
          <h4 className="fw-bold">No active Income Streams data documented</h4>
          <p className="text-muted max-w-md mx-auto">It looks like your ledger account matrix is brand new. Complete dynamic accounting profiles will populate here as entries are logged.</p>
          <button 
            className="btn btn-primary rounded-3 fw-semibold px-4 py-2 mt-2 mx-auto"
            data-bs-toggle="modal" 
            data-bs-target="#addIncomeModal"
          >
            + Log New Record
          </button>
        </div>
      ) : (
        <>
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <input
                  type="text"
                  className="form-control border-light-subtle rounded-3"
                  placeholder="🔍 Search source or memo..."
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

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            {processedIncomes.length === 0 ? (
              <div className="p-5 text-center text-muted">No matching incoming allocations logged in this window search view.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-secondary border-bottom border-light-subtle">
                    <tr>
                      <th className="px-4 py-3">Calendar Date</th>
                      <th className="py-3">Origin Channel</th>
                      <th className="py-3">Classification</th>
                      <th className="py-3">Annotations</th>
                      <th className="py-3 text-end">Net Position</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedIncomes.map((item) => (
                      <tr key={item.id} className="border-bottom border-light-subtle">
                        <td className="px-4 fw-medium text-dark">{item.recordDate || item.incomeDate}</td>
                        <td className="fw-semibold text-primary">{item.source}</td>
                        <td><span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-medium">{item.category}</span></td>
                        <td className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>{item.description || "—"}</td>
                        <td className="text-end fw-bold text-success font-monospace px-2">
                          {item.amount != null ? `₹${item.amount.toLocaleString()}` : "₹0"}
                        </td>
                        <td className="px-4 text-center">
                          <button className="btn btn-link text-danger p-1 text-decoration-none" onClick={() => handleDelete(item.id, item.amount)}>
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bootstrap Form Modal Shell Container Layout */}
      <div className="modal fade" id="addIncomeModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom border-light-subtle px-4">
              <h5 className="modal-title fw-bold">Log Financial Entry</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Source Channel</label>
                  <input type="text" name="source" className="form-control rounded-3" required value={formData.source} onChange={handleInputChange} placeholder="e.g., Company Corp Payment" />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Inflow Amount (INR)</label>
                    <input type="number" step="0.01" name="amount" className="form-control rounded-3" required value={formData.amount} onChange={handleInputChange} placeholder="0.00" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Category Group</label>
                    <select name="category" className="form-select rounded-3" value={formData.category} onChange={handleInputChange}>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Transaction Execution Date</label>
                  <input type="date" name="recordDate" className="form-control rounded-3" required value={formData.recordDate} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Memo/Details</label>
                  <textarea name="description" className="form-control rounded-3" rows="2" value={formData.description} onChange={handleInputChange} placeholder="Optional contextual annotations..."></textarea>
                </div>
              </div>
              <div className="modal-footer border-top border-light-subtle px-4 py-3">
                <button type="button" className="btn btn-light rounded-3 px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary rounded-3 px-4">Persist Matrix</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}