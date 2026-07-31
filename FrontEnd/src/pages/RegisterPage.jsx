import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      alert(response.message || "Registration Successful!");
      console.log(response);
      navigate("/login"); 

    } catch (error) {
      console.error(error);
      
      // FIXED: Safely parsing complex Spring Boot validation objects, maps, or message strings
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'object' && errorData.message) {
          alert(errorData.message);
        } else if (typeof errorData === 'string') {
          alert(errorData);
        } else {
          // Fallback to display field validation errors (e.g., password criteria failures) cleanly
          alert(JSON.stringify(errorData));
        }
      } else {
        alert("Server not reachable");
      }
    }
  };

  return (
    <div className="w-100 bg-white text-dark min-vh-100 overflow-hidden m-0 p-0 d-flex flex-column justify-content-between">
      <NavBar />

      <main className="w-100 flex-grow-1 d-flex align-items-center py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center align-items-center g-5">
            
            <div className="col-lg-6 d-none d-lg-block">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-3 text-uppercase tracking-wider">
                Sovereign Workspace
              </span>
              <h1 className="display-5 fw-bold text-dark mb-4 tracking-tight">
                Join the Next Generation of Wealth Intelligence.
              </h1>
              <p className="text-secondary fs-6 lh-relaxed mb-4">
                Create your global access credential to immediately initialize high-fidelity tracking matrices across your income vectors, dynamic budgets, and digital financial analytics.
              </p>
              
              <div className="p-4 bg-white rounded-4 shadow-sm border border-light-subtle mb-3">
                <h3 className="fs-6 fw-bold text-dark mb-2">🔒 Secure Isolation Layers</h3>
                <p className="small text-muted mb-0">
                  Every asset dataset is securely encrypted, keeping your accounting balances perfectly guarded.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              <div className="card border-0 shadow-lg rounded-5 p-4 p-sm-5 bg-white">
                <div className="text-center mb-4">
                  <h2 className="fs-3 fw-bold text-dark mb-1 tracking-tight">Create Your Account</h2>
                  <p className="text-muted small">Get started with FinSight AI completely free</p>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label small fw-semibold text-secondary mb-1">Full Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg fs-6 rounded-3 bg-light border-light shadow-2xs focus-input"
                      id="fullName"
                      name="fullName"
                      placeholder="Irfan Nanasana"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label small fw-semibold text-secondary mb-1">Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg fs-6 rounded-3 bg-light border-light shadow-2xs focus-input"
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label small fw-semibold text-secondary mb-1">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg fs-6 rounded-3 bg-light border-light shadow-2xs focus-input"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label small fw-semibold text-secondary mb-1">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg fs-6 rounded-3 bg-light border-light shadow-2xs focus-input"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-pill fw-semibold shadow-sm py-2.5 fs-6 hover-translate-y transition mb-3"
                  >
                    Register Terminal Access
                  </button>
                </form>

                <div className="text-center mt-2">
                  <p className="small text-muted mb-0">
                    Already holding operational access keys?{" "}
                    <Link to="/login" className="text-primary fw-semibold text-decoration-none hover-underline">
                      Login 
                    </Link>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        .tracking-tight { letter-spacing: -0.035em; }
        .tracking-wider { letter-spacing: 0.12em; }
        .transition { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-translate-y:hover { transform: translateY(-2px); }
        .shadow-2xs { box-shadow: inset 0 1px 2px rgba(0,0,0,0.02); }
        .focus-input:focus { background-color: #fff !important; border-color: #0d6efd !important; box-shadow: 0 0 0 0.25rem rgba(13,110,253,0.15) !important; color: #212529; }
        .hover-underline:hover { text-decoration: underline !important; }
      `}</style>

      <Footer />
    </div>
  );
}