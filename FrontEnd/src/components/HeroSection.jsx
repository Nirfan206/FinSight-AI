import React from "react";
import { Link } from "react-router-dom";
import mainImage from "../assets/main_img_home_page.png";

export default function HeroSection() {
  return (
    <section className="w-100 py-5 bg-white m-0 border-bottom border-light overflow-hidden">
      <div className="container py-5">
        <div className="row align-items-center g-5">
          
          {/* Left Side: Brand Value Proposition Column */}
          <div className="col-lg-6">
            <div className="d-flex align-items-center mb-3">
              <img 
                src="/favicon.png" 
                alt="FinSight AI Symbol" 
                className="img-fluid me-3 rotate-subtle style-hero-logo animate-pulse" 
              />
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold text-uppercase tracking-wider small">
                v1.0 Active Console
              </span>
            </div>
            
            <h1 className="display-3 fw-bold text-dark mb-3 tracking-tight">
              FinSight AI
            </h1>
            
            <p className="lead text-secondary fs-4 fw-normal mb-4 lh-relaxed">
              AI-Powered Personal Finance &amp; Accounting Management System.
            </p>
            
            <p className="text-muted small mb-5 max-w-500">
              Simplify the way you monitor active cash flow, track outbound daily metrics, analyze receipt data structures, and optimize long-range capital velocity automatically.
            </p>
            
            {/* Quick Action Matrix Triggers */}
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Link 
                to="/register" 
                className="btn btn-primary btn-lg px-4 py-2.5 rounded-pill fw-semibold shadow-sm hover-translate-y transition text-center"
              >
                Initialize Console
              </Link>
              <Link 
                to="/about" 
                className="btn btn-outline-dark btn-lg px-4 py-2.5 rounded-pill fw-semibold hover-bg-dark transition text-center"
              >
                Read Documentation
              </Link>
            </div>
          </div>

          {/* Right Side: High-Resolution Graphic Vector Frame */}
          <div className="col-lg-6 text-center">
            <div className="position-relative p-2 bg-light rounded-5 shadow-lg overflow-hidden style-hero-frame">
              <img
                src={mainImage}
                className="img-fluid rounded-5 w-100 style-hero-img bg-white"
                alt="FinSight AI Asset Telemetry Stream Matrix Preview"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Embedded SaaS Layout Adjustments */}
      <style>{`
        .tracking-tight { letter-spacing: -0.04em; }
        .tracking-wider { letter-spacing: 0.1em; }
        .max-w-500 { max-width: 500px; }
        .style-hero-logo { width: 56px; height: 56px; object-fit: contain; }
        .transition { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-translate-y:hover { transform: translateY(-3px); }
        .hover-bg-dark:hover { background-color: #212529 !important; color: #fff !important; }
        .style-hero-frame { border: 1px solid rgba(0,0,0,0.05); }
        .style-hero-img { transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); object-fit: cover; }
        .style-hero-frame:hover .style-hero-img { transform: scale(1.015); }
        .rotate-subtle { transform: rotate(-3deg); }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .animate-pulse { animation: pulse 3s infinite ease-in-out; }
      `}</style>
    </section>
  );
}