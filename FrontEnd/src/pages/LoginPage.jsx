import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        console.log("Raw Auth Response:", response);

        // Smart extractor looks for token directly, or nested within standard response blocks
        const targetToken = response.token || response.data?.token;
        const targetUser = response.user || response.data?.user || { fullName: "Irfan Nanasana", email: formData.email };

        if (targetToken) {
          alert(response.message || "Login Successful!");
          login(targetToken, targetUser);
        } else {
          // Fallback mechanism if the backend sends a plain token string directly
          if (typeof response === "string" && response.length > 20) {
            alert("Login Successful!");
            login(response, targetUser);
          } else {
            alert("Auth system configuration failure. Token tracking context missing.");
          }
        }

      } catch (error) {
        console.error(error);
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (typeof errorData === 'object' && errorData.message) {
            alert(`Login Failed: ${errorData.message}`);
          } else if (typeof errorData === 'string') {
            alert(errorData);
          } else {
            alert(`Server Error: ${JSON.stringify(errorData)}`);
          }
        } else {
          alert("Server not reachable. Please check your network connection.");
        }
      }
    }
  };

  return (
    <>
      <div>
        <NavBar />
      </div>

      <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="card shadow-lg border-0 rounded-4" style={{ width: "420px" }}>
          <div className="card-body p-5">
            <h2 className="text-center fw-bold mb-2">FinSight AI</h2>
            <p className="text-center text-muted mb-4">Login to your account</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.password}</div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Remember Me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                Login
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100 mt-3"
                onClick={() => navigate("/")}
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .is-invalid { border-color: #dc3545 !important; }
      `}</style>

      <Footer />
    </>
  );
}

export default LoginPage;