import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  // Helper function to dynamically add active styling parameters to links
  const isActive = (path) => location.pathname === path ? "text-primary fw-semibold" : "text-secondary";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-light sticky-top py-3 m-0 p-0 w-100">
      <div className="container">

        {/* Brand Logo & Identity */}
        <Link to="/" className="navbar-brand d-flex align-items-center fw-bold text-dark fs-5 tracking-tight">
          <img 
            src="/favicon.png" 
            alt="FinSight AI Symbol" 
            className="img-fluid me-2 style-nav-logo" 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          FinSight AI
        </Link>

        {/* Mobile View Toggle Action Button */}
        <button
          className="navbar-toggler border-0 focus-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle structural navigation pipeline"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Responsive Links Container */}
        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* Main Core Links Node */}
          <div className="navbar-nav mx-auto gap-1 gap-lg-4 py-3 py-lg-0 align-items-lg-center">
            <Link to="/" className={`nav-link small transition hover-text-primary px-2 ${isActive("/")}`}>
              Home
            </Link>
            <Link to="/about" className={`nav-link small transition hover-text-primary px-2 ${isActive("/about")}`}>
              About
            </Link>
            
          </div>

          {/* Right-Aligned SaaS Action Triggers Block */}
          <div className="navbar-nav ms-auto gap-2 align-items-lg-center flex-row flex-wrap">
            <Link 
              to="/login" 
              className="btn btn-link text-secondary small fw-medium text-decoration-none px-3 py-2 hover-text-dark transition"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="btn btn-primary btn-sm px-4 py-2 rounded-pill fw-semibold shadow-2xs hover-translate-y transition"
            >
              Get Started
            </Link>
          </div>

        </div>

      </div>

      {/* Embedded SaaS Micro-Action Controls */}
      <style>{`
        .tracking-tight { letter-spacing: -0.035em; }
        .style-nav-logo { width: 28px; height: 28px; object-fit: contain; }
        .transition { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-translate-y:hover { transform: translateY(-1.5px); }
        .hover-text-primary:hover { color: #0d6efd !important; }
        .hover-text-dark:hover { color: #212529 !important; }
        .focus-none:focus { box-shadow: none !important; outline: none !important; }
        .shadow-2xs { box-shadow: 0 1px 3px rgba(13,110,253,0.12) !important; }
        
        @media (max-width: 991.98px) {
          .navbar-nav { text-align: center; width: 100%; }
          .navbar-nav.ms-auto { justify-content: center; margin-top: 0.5rem; }
        }
      `}</style>
    </nav>
  );
}