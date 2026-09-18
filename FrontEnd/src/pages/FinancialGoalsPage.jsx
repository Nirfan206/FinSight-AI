import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";

export default function FinancialGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState("");

  const [formData, setFormData] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "0",
    targetDate: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const res = await api.get("/goals");
      if (res.data && res.data.success) {
        setGoals(res.data.data || []);
      }
    } catch (err) {
      console.warn("Could not load goals, starting from an empty list:", err);
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

      const res = await api.post("/goals", payload);

      if (res.data && res.data.success) {
        await fetchGoals();
        setFormData({ goalName: "", targetAmount: "", currentAmount: "0", targetDate: new Date().toISOString().split("T")[0] });

        const modalEl = document.getElementById("createGoalModal");
        modalEl?.querySelector('[data-bs-dismiss="modal"]')?.click();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Could not create this goal.");
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    const currentId = selectedGoal?.goalId;
    if (!currentId || !contributionAmount) return;

    try {
      setErrorMessage("");
      const targetVal = parseFloat(contributionAmount);

      const res = await api.patch(`/goals/${currentId}/contribution?amount=${targetVal}`, {});

      if (res.data && res.data.success) {
        await fetchGoals();
        setContributionAmount("");
        setSelectedGoal(null);

        const modalEl = document.getElementById("contributionModal");
        modalEl?.querySelector('[data-bs-dismiss="modal"]')?.click();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Could not add this contribution.");
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      setErrorMessage("");
      const res = await api.delete(`/goals/${id}`);
      if (res.data && res.data.success) {
        setGoals((prev) => prev.filter((item) => item.goalId !== id));
      }
    } catch (err) {
      setErrorMessage("Could not delete this goal.");
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark">Wealth Goals</h2>
          <p className="text-muted mb-0">Set targets, monitor progress, and log contributions.</p>
        </div>
        <button className="btn btn-primary rounded-3 fw-semibold px-4 py-2" data-bs-toggle="modal" data-bs-target="#createGoalModal">
          🎯 Create Goal
        </button>
      </div>

      {errorMessage && <div className="alert alert-danger rounded-3 mb-4">{errorMessage}</div>}

      {loading ? (
        <div className="p-5 text-center"><div className="spinner-border text-primary" /></div>
      ) : goals.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <div className="fs-1 mb-3">🎯</div>
          <h4 className="fw-bold">No goals set yet</h4>
          <p className="text-muted">Create a target to start tracking progress.</p>
        </div>
      ) : (
        <div className="row g-4">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(0) : 0;
            const isCompleted = goal.status === "ACHIEVED" || parseFloat(progress) >= 100;
            const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div key={goal.goalId} className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 d-flex flex-column justify-content-between position-relative">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-dark mb-0">{goal.goalName}</h5>
                      <button
                        className="btn btn-sm btn-link text-muted p-0 text-decoration-none position-absolute"
                        style={{ top: "15px", right: "15px" }}
                        onClick={() => handleDeleteGoal(goal.goalId)}
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="small text-muted mb-3">Target Date: <strong>{goal.targetDate}</strong></p>

                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>Progress</span>
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
                        <span className="text-muted small d-block">Remaining</span>
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
                      💰 Add Contribution
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="modal fade" id="createGoalModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom border-light-subtle px-4">
              <h5 className="modal-title fw-bold">Create Goal</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleCreateGoal}>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Goal Name</label>
                  <input type="text" name="goalName" className="form-control rounded-3" required value={formData.goalName} onChange={handleInputChange} placeholder="e.g., Emergency Fund" />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Target Amount (INR)</label>
                    <input type="number" name="targetAmount" className="form-control rounded-3" required value={formData.targetAmount} onChange={handleInputChange} placeholder="0" />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">Starting Amount</label>
                    <input type="number" name="currentAmount" className="form-control rounded-3" value={formData.currentAmount} onChange={handleInputChange} placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Target Date</label>
                  <input type="date" name="targetDate" className="form-control rounded-3" required value={formData.targetDate} onChange={handleInputChange} />
                </div>
              </div>
              <div className="modal-footer border-top border-light-subtle px-4 py-3">
                <button type="button" className="btn btn-light rounded-3 px-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary rounded-3 px-4">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal fade" id="contributionModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 rounded-4 shadow-lg">
            <div className="modal-header border-bottom border-light-subtle px-4">
              <h6 className="modal-title fw-bold text-truncate">Funding: {selectedGoal?.goalName}</h6>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleContribute}>
              <div className="modal-body p-4">
                <label className="form-label small fw-bold text-secondary">Amount (INR)</label>
                <input type="number" step="0.01" className="form-control rounded-3" required value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} placeholder="₹0" />
              </div>
              <div className="modal-footer border-top border-light-subtle px-4 py-3">
                <button type="submit" className="btn btn-primary rounded-3 w-100 fw-semibold">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}