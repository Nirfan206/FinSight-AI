import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Search, Filter and Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc");

  // Form Field States
  const [formData, setFormData] = useState({
    amount: "",
    title: "",
    category: "Food",
    description: "",
    expenseDate: new Date().toISOString().split("T")[0]
  });

  // Explicit Blueprint Categories
  const categories = [
    "Food", "Shopping", "Travel", "Education", "Bills", 
    "Entertainment", "Medical", "Rent", "Fuel", "Others"
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Helper method to look up tokens from local storage safely
  const getAuthConfig = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  };

  const fetchExpenses = async () => {
    try {
      setErrorMessage("");
      setLoading(true);
      
      const res = await axios.get("http://localhost:8080/api/expenses", getAuthConfig());
      
      if (res.data && res.data.success) {
        const payload = res.data.data;
        if (payload && payload.content) {
          setExpenses(payload.content);
        } else {
          setExpenses(payload || []);
        }
      }
    } catch (err) {
      console.warn("Initializing fresh ledger array configuration parameters:", err);
      setExpenses([]);
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
      
      // Explicit payload tracking alignment matching backend expectations
      const payload = {
        amount: parseFloat(formData.amount),
        title: formData.title,
        vendor: formData.title,       // Dual-bind mappings to satisfy custom DTO layouts safely
        category: formData.category,
        description: formData.description,
        expenseDate: formData.expenseDate
      };

      const res = await axios.post("http://localhost:8080/api/expenses", payload, getAuthConfig());
      
      if (res.data && res.data.success) {
        fetchExpenses();
        setFormData({ amount: "", title: "", category: "Food", description: "", expenseDate: new Date().toISOString().split("T")[0] });
        
        // Close Bootstrap modular programmatically via target context anchors
        const modalEl = document.getElementById("addExpenseModal");
        if (modalEl) {
          const dismissBtn = modalEl.querySelector('[data-bs-dismiss="modal"]');
          dismissBtn?.click();
        }
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Validation failure: Request payload contains invalid property arguments.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you certain you want to remove this ledger allocation entry?")) return;
    try {
      setErrorMessage("");
      const res = await axios.delete(`http://localhost:8080/api/expenses/${id}`, getAuthConfig());
      if (res.data && res.data.success) {
        setExpenses((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      setErrorMessage("Could not terminate selected entry layout structural reference.");
    }
  };

  // Filter and Sort Processing Logic Pipeline
  const processedExpenses = expenses
    .filter((item) => {
      const vendorStr = item.vendor || item.title || "";
      const descStr = item.description || "";
      const matchSearch = String(vendorStr).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(descStr).toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === "" || item.category === filterCategory;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "dateDesc") return new Date(b.expenseDate) - new Date(a.expenseDate);
      if (sortBy === "dateAsc") return new Date(a.expenseDate) - new Date(b.expenseDate);
      if (sortBy === "amountDesc") return b.amount - a.amount;
      if (sortBy === "amountAsc") return a.amount - b.amount;
      return 0;
    });

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Expenses Matrix</h2>
          <p className="text-muted mb-0">Monitor cash outflows, categorize structural leaks, and control capital usage.</p>
        </div>
        <button 
          className="btn btn-danger rounded-3 fw-semibold px-4 py-2" 
          data-bs-toggle="modal" 
          data-bs-target="#addExpenseModal"
        >
          ➖ Log Outflow
        </button>
      </div>

      {errorMessage && <div className="alert alert-danger rounded-3 mb-4">{errorMessage}</div>}

      {/* Query Matrix Control Panel */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control border-light-subtle rounded-3"
              placeholder="🔍 Search vendor or memo..."
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

      {/* Main Ledger Presentation Grid */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {loading ? (
          <div className="p-5 text-center"><div className="spinner-border text-danger" /></div>
        ) : processedExpenses.length === 0 ? (
          <div className="p-5 text-center text-muted">No matching outbound records found in this frame matrix.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary border-bottom border-light-subtle">
                <tr>
                  <th className="px-4 py-3">Calendar Date</th>
                  <th className="py-3">Vendor/Destination</th>
                  <th className="py-3">Classification</th>
                  <th className="py-3">Annotations</th>
                  <th className="py-3 text-end">Net Position</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedExpenses.map((item) => (
                  <tr key={item.id} className="border-bottom border-light-subtle">
                    <td className="px-4 fw-medium text-dark">{item.expenseDate}</td>
                    <td className="fw-semibold text-danger">{item.vendor || item.title}</td>
                    <td><span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-medium">{item.category}</span></td>
                    <td className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>{item.description || "—"}</td>
                    <td className="text-end fw-bold text-danger font-monospace px-2">
                      {item.amount != null ? `₹${item.amount.toLocaleString()}` : "₹0"}
                    </td>
                    <td className="px-4 text-center">
                      <button className="btn btn-link text-danger p-1" onClick={() => handleDelete(item.id)}>
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

      {/* Bootstrap Programmatic Outflow Creation Backdrop Shell */}
      <div className="modal fade" id="addExpenseModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom border-light-subtle px-4">
              <h5 className="modal-title fw-bold">Log Expense Allocation</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Vendor / Destination</label>
                  <input type="text" name="title" className="form-control rounded-3" required value={formData.title} onChange={handleInputChange} placeholder="e.g., Amazon, Cred Utility, D-Mart" />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Outflow Amount (INR)</label>
                    <input type="number" step="0.01" name="amount" className="form-control rounded-3" required value={formData.amount} onChange={handleInputChange} placeholder="0.00" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Category Segment</label>
                    {/* FIXED: Added name="category" attribute */}
                    <select name="category" className="form-select rounded-3" value={formData.category} onChange={handleInputChange}>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Transaction Execution Date</label>
                  <input type="date" name="expenseDate" className="form-control rounded-3" required value={formData.expenseDate} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Memo/Details</label>
                  {/* FIXED: Added name="description" attribute */}
                  <textarea name="description" className="form-control rounded-3" rows="2" value={formData.description} onChange={handleInputChange} placeholder="Optional contextual annotations..."></textarea>
                </div>
              </div>
              <div className="modal-footer border-top border-light-subtle px-4 py-3">
                <button type="button" className="btn btn-light rounded-3 px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-danger rounded-3 px-4">Commit Transaction</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}