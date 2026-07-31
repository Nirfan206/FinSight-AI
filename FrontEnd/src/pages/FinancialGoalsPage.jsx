import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FinancialGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Contribution field hooks configuration parameters
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState("");

  // New Goal Form Field States
  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "0",
    targetDate: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await axios.get("http://localhost:8080/api/goals", getAuthConfig());
      if (res.data && res.data.success) {
        setGoals(res.data.data || []);
      }
    } catch (err) {
      console.warn("Initializing fresh array layout boundaries:", err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      setErrorMessage("");
      const payload = {
        goalName: formData.goalName,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || 0),
        targetDate: formData.targetDate
      };

      const res = await axios.post("http://localhost:8080/api/goals", payload, getAuthConfig());
      
      if (res.data && res.data.success) {
        fetchGoals();
        setFormData({ goalName: "", targetAmount: "", currentAmount: "0", targetDate: new Date().toISOString().split("T")[0] });
        
        const modalEl = document.getElementById("createGoalModal");
        const dismissBtn = modalEl?.querySelector('[data-bs-dismiss="modal"]');
        dismissBtn?.click();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Could not append goal data framework.");
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    const currentId = selectedGoal?.goalId || selectedGoal?.id;
    if (!currentId || !contributionAmount) return;
    
    try {
      setErrorMessage("");
      const targetVal = parseFloat(contributionAmount);
      
      // Target patch request using matching RequestParam query string coordinates
      const res = await axios.patch(
        `http://localhost:8080/api/goals/${currentId}/contribution?amount=${targetVal}`,
        {},
        getAuthConfig()
      );

      if (res.data && res.data.success) {
        fetchGoals();
        setContributionAmount("");
        setSelectedGoal(null);

        const modalEl = document.getElementById("contributionModal");
        const dismissBtn = modalEl?.querySelector('[data-bs-dismiss="modal"]');
        dismissBtn?.click();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Contribution mapping adjustment process rejected.");
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you certain you want to delete this track target parameter structure?")) return;
    try {
      setErrorMessage("");
      const res = await axios.delete(`http://localhost:8080/api/goals/${id}`, getAuthConfig());
      if (res.data && res.data.success) {
        setGoals((prev) => prev.filter((item) => (item.goalId || item.id) !== id));
      }
    } catch (err) {
      setErrorMessage("Could not delete structural target node track reference.");
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Wealth Goals</h2>
          <p className="text-muted mb-0">Establish structural target funds, monitor metrics, and log contributions.</p>
        </div>
        <button 
          className="btn btn-primary rounded-3 fw-semibold px-4 py-2" 
          data-bs-toggle="modal" 
          data-bs-target="#createGoalModal"
        >
          🎯 Create Target Track
        </button>
      </div>

      {errorMessage && <div className="alert alert-danger rounded-3 mb-4">{errorMessage}</div>}

      {loading ? (
        <div className="p-5 text-center"><div className="spinner-border text-primary" /></div>
      ) : goals.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div className="fs-1 mb-3">🎯</div>
          <h4 className="fw-bold">No Wealth Targets Configured</h4>
          <p className="text-muted max-w-md mx-auto">Deploy milestone trackers inside your matrix framework portfolio to see entries update.</p>
        </div>
      ) : (
        <div className="row g-4">
          {goals.map((goal) => {
            const currentId = goal.goalId || goal.id;
            const progress = goal.targetAmount > 0 ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(0) : 0;
            const isCompleted = goal.status === "ACHIEVED" || parseFloat(progress) >= 100;
            const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div key={currentId} className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 d-flex flex-column justify-content-between position-relative">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-dark mb-0">{goal.goalName}</h5>
                      <button 
                        className="btn btn-sm btn-link text-muted p-0 text-decoration-none position-absolute" 
                        style={{ top: "15px", right: "15px" }} 
                        onClick={() => handleDeleteGoal(currentId)}
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="small text-muted mb-3">Target Horizon Timeline: <strong>{goal.targetDate || goal.endDate}</strong></p>
                    
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>Funding Progress</span>
                      <span className="fw-bold text-dark">{progress}%</span>
                    </div>
                    <div className="progress rounded-pill bg-light mb-3" style={{ height: "10px" }}>
                      <div className={`progress-bar rounded-pill ${isCompleted ? "bg-success" : "bg-primary"}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>

                    <div className="row g-2 text-center py-2 px-1 bg-light rounded-3 mb-3">
                      <div className="col-4 border-end border-light-subtle">
                        <span className="text-muted small d-block">Saved</span>
                        <strong className="text-dark small">₹{goal.currentAmount?.toLocaleString()}</strong>
                      </div>
                      <div className="col-4 border-end border-light-subtle">
                        <span className="text-muted small d-block">Target</span>
                        <strong className="text-dark small">₹{goal.targetAmount?.toLocaleString()}</strong>
                      </div>
                      <div className="col-4">
                        <span className="text-muted small d-block">Deficit</span>
                        <strong className="text-primary small">₹{remainingAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {!isCompleted && (
                    <button 
                      className="btn btn-outline-primary btn-sm w-100 rounded-3 fw-semibold py-2 mt-2" 
                      data-bs-toggle="modal" 
                      data-bs-target="#contributionModal" 
                      onClick={() => setSelectedGoal(goal)}
                    >
                      💰 Add Contribution Allocation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Target Fund Creation Backdrop Scaffold Modal Layout */}
      <div className="modal fade" id="createGoalModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom border-light-subtle px-4">
              <h5 className="modal-title fw-bold">Initiate Wealth Track</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleCreateGoal}>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Asset Identifier</label>
                  <input type="text" name="goalName" className="form-control rounded-3" required value={formData.goalName} onChange={handleInputChange} placeholder="e.g., Target Fund Asset Track" />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Target Cap (INR)</label>
                    <input type="number" name="targetAmount" className="form-control rounded-3" required value={formData.targetAmount} onChange={handleInputChange} placeholder="0" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Starting Base Balance</label>
                    <input type="number" name="currentAmount" className="form-control rounded-3" value={formData.currentAmount} onChange={handleInputChange} placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Timeline Horizon Target Date</label>
                  <input type="date" name="targetDate" className="form-control rounded-3" required value={formData.targetDate} onChange={handleInputChange} />
                </div>
              </div>
              <div className="modal-footer border-top border-light-subtle px-4 py-3">
                <button type="button" id="closeGoalModalBtn" className="btn btn-light rounded-3 px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary rounded-3 px-4">Deploy Track</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Contribution Allocation Insertion Modal Backdrop Context Window Container Layout */}
      <div className="modal fade" id="contributionModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom border-light-subtle px-4">
              <h6 className="modal-title fw-bold text-truncate">Funding: {selectedGoal?.goalName}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleContribute}>
              <div className="modal-body p-4">
                <label className="form-label small fw-bold text-secondary">Inject Capital (INR)</label>
                <input type="number" step="0.01" className="form-control rounded-3" required value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} placeholder="₹0" />
              </div>
              <div className="modal-footer border-top border-light-subtle px-4 py-3">
                <button type="submit" className="btn btn-primary rounded-3 w-100 fw-semibold">Confirm Push</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}