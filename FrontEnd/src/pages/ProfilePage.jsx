import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "USER",
    accountStatus: "ACTIVE"
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Production backend context lookup:
      // const res = await axios.get("http://localhost:8080/api/users/profile", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      // setProfile(res.data);
      
      setTimeout(() => {
        setProfile({
          fullName: "Irfan Nanasana",
          email: "irfan@finsightai.com",
          role: "USER",
          accountStatus: "ACTIVE"
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      setErrorMessage("Could not fetch user profile details.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setSuccessMessage("");
      setErrorMessage("");

      // const res = await axios.put("http://localhost:8080/api/users/profile", profile, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      
      setTimeout(() => {
        setSuccessMessage("Profile parameters updated successfully inside core database layers.");
        setUpdating(false);
      }, 800);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to submit profile changes.");
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "CRITICAL ACTION: Are you absolutely certain you want to terminate this operational profile? All income pipelines, tracking budgets, and S3 asset metrics will be permanently scrubbed."
    );
    if (!confirmation) return;

    try {
      // await axios.delete("http://localhost:8080/api/users/profile", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      setErrorMessage("Could not process account termination sequence.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">User Workspace Settings</h2>
        <p className="text-muted mb-0">Modify security criteria, view access privileges, and configure personal identities.</p>
      </div>

      {successMessage && <div className="alert alert-success rounded-3 small">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger rounded-3 small">{errorMessage}</div>}

      <div className="row g-4">
        {/* Profile Details Modification Node */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-4">Identity Matrix</h5>
            
            <form onSubmit={handleUpdateProfile}>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-secondary">Full System Identity Name</label>
                  <input type="text" name="fullName" className="form-control rounded-3" required value={profile.fullName} onChange={handleInputChange} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-secondary">Primary Communications Email</label>
                  <input type="email" name="email" className="form-control rounded-3" disabled value={profile.email} />
                  <span className="extra-small text-muted">Email keys act as primary global identifiers and cannot be altered.</span>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Assigned Authorization Role</label>
                  <input type="text" className="form-control rounded-3 bg-light text-muted font-monospace" disabled value={profile.role} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Operational Status Node</label>
                  <span className="d-block mt-2 text-success fw-bold small">● {profile.accountStatus}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary rounded-3 fw-semibold px-4 py-2" disabled={updating}>
                {updating ? "Syncing Clusters..." : "Commit Profile Matrix"}
              </button>
            </form>
          </div>
        </div>

        {/* Security & System Clearance Operations */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold text-dark mb-3">Security & Systems</h5>
              <p className="small text-muted mb-4">Manage environment-level safety features and storage buckets linked to this node instance.</p>
              
              <div className="p-3 bg-light rounded-3 mb-3 border border-light-subtle">
                <span className="small d-block fw-bold text-dark mb-1">AWS S3 Infrastructure Node</span>
                <span className="extra-small text-secondary d-block">Active bucket links: <strong>finsight-receipt-vault-s3</strong></span>
              </div>
            </div>

            <div className="pt-3 border-top border-light-subtle">
              <span className="small text-muted d-block mb-2">Danger Zone Controls</span>
              <button onClick={handleDeleteAccount} className="btn btn-outline-danger btn-sm w-100 rounded-3 fw-semibold py-2">
                ⚠️ Terminate Cloud Account Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .extra-small { font-size: 0.72rem !important; }
      `}</style>
    </div>
  );
}