import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

function LoginPage() {
  const navigate = useNavigate();

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

        alert(response.message || "Login Successful");
        console.log(response);

        if (response.token) {
          localStorage.setItem("token", response.token);
        }

        navigate("/");
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          alert("Server not reachable");
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

      <Footer />
    </>
  );
}

export default LoginPage;