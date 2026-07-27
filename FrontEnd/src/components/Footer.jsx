import React from "react";

export default function Footer() {
  return (
    <footer className="w-100 bg-white border-top border-light py-5 mt-auto m-0 p-0">
      <div className="container">
        <div className="row align-items-center justify-content-between g-4">
          
          {/* Left Column: Brand & Copyright */}
          <div className="col-md-4 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-1">
              <span className="fs-5 me-2">📊</span>
              <h3 className="fs-6 fw-bold text-dark mb-0 tracking-tight">FinSight AI</h3>
            </div>
            <p className="text-muted small mb-0">© 2026 Irfan, Inc. All rights reserved.</p>
          </div>

          {/* Center Column: Developer Signature Attribution */}
          <div className="col-md-4 text-center">
            <p className="small text-secondary mb-0 fw-medium">
              Designed & Engineered by <span className="text-dark fw-semibold">Irfan Nanasana</span>
            </p>
            <span className="style-divider d-none d-md-inline-block bg-light-subtle my-2 mx-auto"></span>
            <p className="style-micro-text text-muted mb-0 font-monospace">Built with React & Spring Boot</p>
          </div>

          {/* Right Column: Platform Operational Status / Security Badges */}
          <div className="col-md-4 text-center text-md-end">
            <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-2 flex-wrap">
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 style-status-badge d-inline-flex align-items-center">
                <span className="style-pulse-dot bg-success rounded-circle me-1.5"></span>
                Console Operational
              </span>
              <span className="badge bg-light text-secondary border border-light-subtle rounded-pill px-2.5 py-1 font-monospace style-status-badge">
                AES-256 Secured
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Premium UI Layout Adjustments */}
      <style>{`
        .tracking-tight { letter-spacing: -0.035em; }
        .style-micro-text { font-size: 0.7rem; letter-spacing: 0.05em; text-uppercase: uppercase; }
        .style-status-badge { font-size: 0.75rem; font-weight: 500; }
        .style-divider { width: 40px; height: 1px; display: block; }
        .bg-light-subtle { background-color: #dee2e6 !important; }
        .style-pulse-dot { width: 6px; height: 6px; animation: style-blink 2s infinite ease-in-out; }
        
        @keyframes style-blink {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </footer>
  );
}