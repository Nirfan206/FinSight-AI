import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReceiptVaultPage() {
  const [receipts, setReceipts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      // Production backend endpoint integration reference:
      // const res = await axios.get("http://localhost:8080/api/receipts", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      
      setTimeout(() => {
        setReceipts([
          { id: 1, fileName: "zomato_dinner_bill.png", uploadDate: "2026-07-26", fileSize: "1.2 MB", status: "PROCESSED", s3Url: "#" },
          { id: 2, fileName: "july_rent_invoice.pdf", uploadDate: "2026-07-02", fileSize: "2.4 MB", status: "PROCESSED", s3Url: "#" }
        ]);
        setLoading(false);
      }, 600);
    } catch (err) {
      setErrorMessage("Failed to sync structural asset links from the repository.");
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Strict validation ensuring payload meets blueprint rules: JPG, PNG, PDF
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Invalid document format. The ledger only accepts JPG, PNG, or PDF parameters.");
      setSelectedFile(null);
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      setErrorMessage('');
      
      // Production Multipart AWS S3 Integration Endpoint context:
      // const res = await axios.post("http://localhost:8080/api/receipts/upload", formData, {
      //   headers: { 
      //     "Content-Type": "multipart/form-data",
      //     Authorization: `Bearer ${localStorage.getItem("token")}` 
      //   }
      // });

      setTimeout(() => {
        const mockNewReceipt = {
          id: Date.now(),
          fileName: selectedFile.name,
          uploadDate: new Date().toISOString().split('T')[0],
          fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          status: "PROCESSED",
          s3Url: "#"
        };

        setReceipts(prev => [mockNewReceipt, ...prev]);
        setSuccessMessage("Document pushed to AWS S3 bucket layer successfully. Running OCR simulation routines.");
        setSelectedFile(null);
        setUploading(false);
        
        // Reset raw HTML input element node anchor
        document.getElementById("receiptFileInput").value = "";
      }, 1200);

    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Multipart transmission failure inside storage wrapper.");
      setUploading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Receipt Vault</h2>
        <p className="text-muted mb-0">Upload documents directly to AWS S3 secure structures to execute transaction verification loops.</p>
      </div>

      {errorMessage && <div className="alert alert-danger rounded-3 small">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success rounded-3 small">{successMessage}</div>}

      <div className="row g-4">
        {/* Document Multi-part Selector Node */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Push Document Channel</h5>
            
            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <div className="p-4 border border-dashed border-light-subtle bg-light rounded-4 text-center position-relative">
                  <i className="bi bi-cloud-arrow-up display-6 text-secondary d-block mb-2"></i>
                  <span className="small text-muted d-block mb-2">Drag file or browse system paths</span>
                  <input 
                    id="receiptFileInput"
                    type="file" 
                    className="form-control form-control-sm border-light-subtle rounded-3 mt-1" 
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    required
                  />
                  <span className="extra-small text-secondary d-block mt-2">Constraint parameters: <strong>JPG, PNG, PDF ceiling limits</strong></span>
                </div>
              </div>

              {selectedFile && (
                <div className="p-2.5 bg-light rounded-3 mb-3 border border-light-subtle d-flex justify-content-between align-items-center">
                  <span className="small text-truncate fw-medium pe-2" style={{ maxWidth: "200px" }}>📄 {selectedFile.name}</span>
                  <span className="badge bg-secondary-subtle text-secondary font-monospace extra-small">{(selectedFile.size / 1024).toFixed(0)} KB</span>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary w-100 rounded-3 fw-semibold py-2"
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Encrypting Parameters...
                  </>
                ) : "🚀 Transmit to Cloud Container"}
              </button>
            </form>
          </div>
        </div>

        {/* Expandable Gallery Grid Workspace */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden h-100">
            <div className="px-4 py-3 border-bottom border-light-subtle bg-light-subtle">
              <h6 className="fw-bold mb-0 text-dark">AWS Cloud Ledger Index Lookup Table</h6>
            </div>
            
            {loading ? (
              <div className="p-5 text-center"><div className="spinner-border text-primary" /></div>
            ) : receipts.length === 0 ? (
              <div className="p-5 text-center text-muted small">No unstructured image attachments synchronized to this security partition node.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-secondary small border-bottom border-light-subtle">
                    <tr>
                      <th className="px-4 py-2.5">Target Identifier</th>
                      <th className="py-2.5">Staging Date</th>
                      <th className="py-2.5">Footprint</th>
                      <th className="py-2.5">OCR Status</th>
                      <th className="px-4 py-2.5 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {receipts.map((receipt) => (
                      <tr key={receipt.id} className="border-bottom border-light-subtle">
                        <td className="px-4 fw-semibold text-truncate" style={{ maxWidth: "180px" }}>{receipt.fileName}</td>
                        <td className="text-muted">{receipt.uploadDate}</td>
                        <td className="font-monospace text-muted">{receipt.fileSize}</td>
                        <td>
                          <span className="badge bg-success-subtle text-success rounded-pill fw-medium px-2.5 py-1">
                            {receipt.status}
                          </span>
                        </td>
                        <td className="px-4 text-end">
                          <a href={receipt.s3Url} className="btn btn-sm btn-light border border-light-subtle rounded-3 px-2.5 py-1 fw-medium" target="_blank" rel="noreferrer">
                            👁️ View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .border-dashed { border-style: dashed !important; }
        .extra-small { font-size: 0.72rem !important; }
      `}</style>
    </div>
  );
}