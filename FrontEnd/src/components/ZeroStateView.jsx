import React from "react";

export default function ZeroStateView({ title, icon, onAction }) {
  return (
    <div className="container-fluid py-5">
      <div 
        className="card border border-dashed border-light-subtle bg-white rounded-4 p-5 text-center shadow-sm mx-auto" 
        style={{ maxWidth: '600px', borderStyle: 'dashed !important' }}
      >
        <div className="fs-1 mb-3">{icon}</div>
        <h4 className="fw-bold text-dark mb-2">No active {title} data documented</h4>
        <p className="text-muted small mb-4">
          It looks like your ledger account matrix is brand new. Complete dynamic accounting profiles will populate here as entries are logged.
        </p>
        <div>
          <button 
            onClick={onAction} 
            className="btn btn-primary rounded-3 px-4 py-2 fw-semibold shadow-sm"
          >
            + Log New Record
          </button>
        </div>
      </div>
    </div>
  );
}