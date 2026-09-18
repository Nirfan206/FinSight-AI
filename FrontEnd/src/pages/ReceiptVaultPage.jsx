import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import axios from 'axios'; // FIXED: Standard un-intercepted axios for absolute cloud URLs

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
      setErrorMessage('');
      const res = await api.get("/receipts");
      if (res.data && res.data.success) {
        setReceipts(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch vault records:", err);
      setErrorMessage("Failed to sync structural asset links from the repository partition.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Invalid document format. The ledger only accepts JPG, PNG, or PDF parameters.");
      setSelectedFile(null);
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
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
      setSuccessMessage('');
      
      const res = await api.post("/receipts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data && res.data.success) {
        setSuccessMessage("Document pushed to cloud storage bucket layer successfully.");
        setSelectedFile(null);
        document.getElementById("receiptFileInput").value = "";
        fetchReceipts();
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage(err.response?.data?.message || "Multipart transmission failure inside storage wrapper.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (receiptId) => {
    if (!window.confirm("Evict this tracking document permanently?")) return;
    try {
      setErrorMessage('');
      setSuccessMessage('');
      const res = await api.delete(`/receipts/${receiptId}`);
      if (res.data && res.data.success) {
        setSuccessMessage("Document vector cleared from file system arrays successfully.");
        setReceipts(prev => prev.filter(item => item.receiptId !== receiptId));
      }
    } catch (err) {
      setErrorMessage("Failed to complete the deletion request.");
    }
  };

  // FIXED: Bypasses local custom api interceptor contexts by executing via standard un-configured axios
  const handleViewDocument = async (fileUrl) => {
    try {
      setErrorMessage('');
      
      // Request file as binary blob payload securely using raw axios targeting absolute S3 end paths
      const response = await axios.get(fileUrl, {
        responseType: 'blob'
      });

      // Construct a localized internal browser DOM tracking URL allocation reference
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const localizedBlobUrl = window.URL.createObjectURL(blob);

      // Trigger standard clean window context breakout cleanly
      window.open(localizedBlobUrl, '_blank');

      // Clear memory buffers natively once browser render engine yields control threads
      setTimeout(() => window.URL.revokeObjectURL(localizedBlobUrl), 100);

    } catch (err) {
      console.error("Failed to parse resource stream inline view layout context: ", err);
      setErrorMessage("Authorization refused or asset file missing: Unable to secure viewer stream.");
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
                {uploading ? "Encrypting Parameters..." : "🚀 Transmit to Cloud Container"}
              </button>
            </form>
          </div>
        </div>

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
                      <th className="px-4 py-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {receipts.map((receipt) => (
                      <tr key={receipt.receiptId} className="border-bottom border-light-subtle">
                        <td className="px-4 fw-semibold text-truncate" style={{ maxWidth: "250px" }}>{receipt.fileName}</td>
                        <td className="text-muted">{receipt.uploadDate ? new Date(receipt.uploadDate).toLocaleDateString() : "—"}</td>
                        <td className="px-4 text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button 
                              type="button"
                              className="btn btn-sm btn-light border border-light-subtle rounded-3 px-2.5 py-1 fw-medium"
                              onClick={() => handleViewDocument(receipt.fileUrl)}
                            >
                              👁️ View
                            </button>
                            <button 
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-3 px-2.5 py-1"
                              onClick={() => handleDelete(receipt.receiptId)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
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