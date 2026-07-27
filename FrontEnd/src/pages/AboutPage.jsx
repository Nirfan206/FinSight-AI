import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="w-100 bg-white text-dark min-vh-100 overflow-hidden m-0 p-0">
      {/* 1. Navbar */}
      <NavBar />

      {/* 2. About Hero Section */}
      <section className="w-100 py-5 bg-light border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-3 text-uppercase tracking-wider">
                Our Story
              </span>
              <h1 className="display-4 fw-bold text-dark mb-3 tracking-tight">About FinSight AI</h1>
              <h2 className="fs-4 text-secondary fw-normal mb-4">Intelligent Data Engineering for Personal Wealth Optimization</h2>
              <p className="lead text-muted fs-5 lh-lg mb-0">
                FinSight AI represents a fundamental paradigm shift in how individual developers, creators, and technology professionals interface with asset ledgers. Developed as a high-performance alternative to chaotic spreadsheets and fragmented micro-banking apps, the system unifies modern database consistency with state-of-the-art context processing. We specialize in abstracting out variable accounting friction so you can focus strictly on capital velocity.
              </p>
            </div>
            <div className="col-lg-6 text-center">
              <div className="p-4 bg-white rounded-5 shadow-lg d-inline-block border border-light style-hero-icon-card">
                <div className="display-1 mb-2 text-primary animate-pulse">🧠</div>
                <h3 className="fs-5 fw-black text-dark mb-0">FinSight System Cluster</h3>
                <span className="text-muted small">Autonomous Telemetry Console</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Mission */}
      <section className="w-100 py-5 bg-white border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8 col-xl-7">
              <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">Core Target</span>
              <h2 className="display-5 fw-bold text-dark mb-4 tracking-tight">Our Mission</h2>
              <p className="fs-5 text-secondary lh-relaxed mb-5">
                To simplify personal finance management using Artificial Intelligence, enabling every individual to attain absolute financial clarity and confidence.
              </p>
            </div>
          </div>
          <div className="row g-4 text-center">
            {[
              { title: "Smarter Decisions", desc: "Help users make smarter, objective, data-backed financial decisions every day.", icon: "🧠" },
              { title: "Better Budgeting", desc: "Promote healthy budgeting habits through dynamic adjustment metrics.", icon: "📈" },
              { title: "Secure Tools", desc: "Provide secure, reliable, and easy-to-use digital financial toolsets.", icon: "🛡️" }
            ].map((m, i) => (
              <div className="col-md-4" key={i}>
                <div className="card h-100 border-0 bg-light p-4 rounded-4 shadow-sm hover-translate-y transition">
                  <div className="fs-2 mb-3">{m.icon}</div>
                  <h3 className="fs-5 fw-bold text-dark mb-2">{m.title}</h3>
                  <p className="text-muted small mb-0">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Technology Stack Section */}
      <section className="w-100 py-5 bg-light border-top border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-3 text-uppercase tracking-wider">
                System Infrastructure
              </span>
              <h2 className="display-6 fw-bold text-dark mb-3 tracking-tight">Technologies Used</h2>
              <p className="text-secondary fs-6">A secure, enterprise-ready infrastructure stacked to handle sub-second calculations smoothly.</p>
            </div>
          </div>
          <div className="row g-4">
            {[
              { name: "React.js", tier: "Frontend Framework", desc: "Builds a fast, modern browser interface with fully reactive UI rendering components.", icon: "⚛️" },
              { name: "Spring Boot", tier: "REST API Backend", desc: "Coordinates core banking business logic controllers with highly scalable security configurations.", icon: "🍃" },
              { name: "MySQL", tier: "Relational Database", desc: "Maintains structured transactional records safely using robust, acid-compliant table schemas.", icon: "🐬" },
              { name: "AWS S3", tier: "Cloud Storage Bucket", desc: "Hosts uploaded documentation images securely using isolated distributed storage servers.", icon: "☁️" },
              { name: "Gemini AI", tier: "Generative AI Engine", desc: "Drives contextual analysis models to generate custom cash flow optimization ideas.", icon: "✨" },
              { name: "JWT Core", tier: "Secure Authentication", desc: "Signs cryptographically unique stateless session tokens to guard API routing endpoints securely.", icon: "🔐" }
            ].map((t, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="card h-100 border-0 shadow-sm rounded-4 bg-white p-4 text-center hover-translate-y transition">
                  <div className="fs-2 mb-2">{t.icon}</div>
                  <h3 className="fs-5 fw-bold text-dark mb-1">{t.name}</h3>
                  <span className="text-primary small d-block mb-3 fw-medium">{t.tier}</span>
                  <p className="text-muted small mb-0 lh-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. System Architecture Section */}
      <section className="w-100 py-5 bg-white border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold text-dark mb-3 tracking-tight">System Architecture</h2>
              <p className="text-secondary fs-6">Operational pipeline outlining unified platform data processing paths.</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 bg-light p-4 rounded-5 shadow-sm">
                <div className="row row-cols-1 row-cols-lg-5 g-4 align-items-center text-center">
                  {[
                    { label: "Frontend", name: "React.js" },
                    { label: "Backend Layer", name: "Spring Boot API" },
                    { label: "Data Warehouse", name: "MySQL Storage" },
                    { label: "Cloud Storage", name: "AWS S3 Vault" },
                    { label: "AI Integration", name: "Gemini API" }
                  ].map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="col">
                        <div className="p-3 bg-white rounded-4 shadow-sm border border-light-subtle">
                          <span className="text-muted small d-block uppercase fw-medium mb-1">{step.label}</span>
                          <h4 className="fs-6 fw-bold text-dark mb-0">{step.name}</h4>
                        </div>
                      </div>
                      {idx < 4 && (
                        <div className="col d-lg-none text-center py-1">
                          <span className="fs-4 text-muted">↓</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="row row-cols-5 text-center mt-2 d-none d-lg-flex text-muted opacity-50 fw-bold fs-4">
                  <div className="col">↓</div>
                  <div className="col">↓</div>
                  <div className="col">↓</div>
                  <div className="col">↓</div>
                  <div className="col"></div>
                </div>
                <div className="text-center mt-3 small text-secondary fw-medium">
                  Stateless communication flows systematically from user components to cloud logic structures.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Project Objectives */}
      <section className="w-100 py-5 bg-light border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold text-dark mb-3 tracking-tight">Project Objectives</h2>
              <p className="text-secondary fs-6">Target milestones built explicitly to improve our user ecosystem.</p>
            </div>
          </div>
          <div className="row g-4">
            {[
              "Provide a centralized, easy-to-use finance management platform.",
              "Track income and expenses.",
              "Manage monthly budgets.",
              "Store digital receipts securely.",
              "Generate reports.",
              "Provide AI-powered financial insights."
            ].map((obj, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="card h-100 border-0 shadow-xs bg-white p-4 rounded-4">
                  <div className="d-flex align-items-start">
                    <span className="bg-primary-subtle text-primary rounded-circle px-2.5 py-1 fw-bold me-3 small">
                      {i + 1}
                    </span>
                    <p className="text-dark mb-0 fw-medium small lh-base pt-1">{obj}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Meet the Developer Section */}
      <section className="w-100 py-5 bg-white border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-3 text-uppercase tracking-wider">
                Engineering Team
              </span>
              <h2 className="display-6 fw-bold text-dark tracking-tight">Developer Profile</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-light text-center p-4">
                <div className="mx-auto mb-3 bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-3 shadow-sm style-avatar">
                  IN
                </div>
                <h3 className="fs-4 fw-bold text-dark mb-1">Irfan Nanasana</h3>
                <span className="text-primary small fw-semibold mb-3 d-block text-uppercase tracking-wide">
                  Full Stack Java Developer 
                </span>
                
                <div className="bg-white p-3 rounded-4 shadow-xs border border-light-subtle text-start mb-4">
                  <p className="small mb-1 text-muted"><strong className="text-dark">Education:</strong> B.Tech Artificial Intelligence & Machine Learning</p>
                  <p className="small mb-0 text-muted"><strong className="text-dark">College:</strong> R.V.R. & J.C. College of Engineering</p>
                </div>

                <p className="text-secondary small lh-relaxed mb-4">
                  "I am passionate about developing intelligent web applications that combine Artificial Intelligence with modern Full Stack Development to solve real-world problems."
                </p>

                <h4 className="fs-6 fw-bold text-dark mb-3 text-start">Technical Capability Matrix:</h4>
                <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                  {["Java", "Spring Boot", "React.js", "MySQL", "AWS", "Generative AI", "Python", "Machine Learning"].map((skill, si) => (
                    <span className="badge bg-white text-dark border border-light-subtle rounded-pill px-3 py-2 shadow-2xs small font-monospace" key={si}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <a href="https://github.com/Nirfan206" target="_blank" rel="noopener noreferrer" className="btn btn-dark rounded-pill px-4 btn-sm fw-medium shadow-sm">
                    GitHub Profile
                  </a>
                  <a href="https://www.linkedin.com/in/nanasana-irfan-807b1a287/" target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-pill px-4 btn-sm fw-medium shadow-sm">
                    LinkedIn Connection
                  </a>
                  <a href="mailto:irfan90593@gmail.com" className="btn btn-outline-secondary rounded-pill px-4 btn-sm fw-medium">
                    Email Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Future Enhancements */}
      <section className="w-100 py-5 bg-light border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold text-dark mb-3 tracking-tight">Future Enhancements</h2>
              <p className="text-secondary fs-6">Upcoming strategic iterations currently in our production roadmaps pipeline.</p>
            </div>
          </div>
          <div className="row g-3">
            {[
              { title: "Mobile Application", desc: "Native iOS and Android tracking app environments built for seamless field ingestion." },
              { title: "Bank API Integration", desc: "Live institutional connections running automated account statement reconciliation feeds." },
              { title: "Investment Tracking", desc: "Aggregated layout grids monitoring equities, bonds, crypto indexes, and fractional real estate balances." },
              { title: "Multi-language Support", desc: "Localizing international conversion metrics, dashboard languages, and custom regional fields." },
              { title: "Voice Assistant UI", desc: "Contextual speech processing allowing instant voice command expense logging logs." },
              { title: "Predictive Analytics", desc: "Advanced algorithmic models forecasting upcoming seasonal cash runways out to 365 days." }
            ].map((f, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="card h-100 border-0 shadow-xs rounded-4 bg-white p-4 hover-translate-y transition">
                  <h3 className="fs-6 fw-bold text-dark mb-2">🚀 {f.title}</h3>
                  <p className="text-muted small mb-0 lh-base">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Frequently Asked Questions (Accordion) */}
      <section className="w-100 py-5 bg-white m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-7">
              <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">Help Center</span>
              <h2 className="display-6 fw-bold text-dark mb-3 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-secondary fs-6">Clear answers outlining functionality parameters and platform logic settings.</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-9 col-xl-8">
              <div className="accordion accordion-flush shadow-sm rounded-4 border border-light overflow-hidden bg-white" id="aboutFaqAccordion">
                {[
                  { q: "What is FinSight AI?", a: "FinSight AI is a comprehensive modern web workspace built using React and Spring Boot designed to track personal accounts, monitor daily expenses, create dynamic budgets, and view high-resolution analytics seamlessly." },
                  { q: "How does AI help users?", a: "The platform integrates Gemini AI frameworks to continuously analyze personal spending trends, calculate surplus capital velocity, and output customized cash flow recommendations tailored explicitly to you." },
                  { q: "Is my data secure?", a: "Yes. Your transactional information rests safely behind cryptographic JWT identity authorization parameters, uses AES-256 standard files encapsulation at rest, and passes through secure transit pipelines." },
                  { q: "Can I upload receipts?", a: "Absolutely. The digital vault handles rapid image uploads directly inside your browser view, allowing files to attach cleanly alongside specific account line listings." },
                  { q: "Can I download reports?", a: "Yes. The system processes ledger records over custom time intervals to generate pixel-perfect document PDF exports ready for download, distribution, or personal filing timelines." },
                  { q: "Which technologies are used?", a: "The platform core stack uses a fast React.js front-end interface, a resilient Spring Boot backend REST layer, a secure MySQL relational database infrastructure, and AWS S3 cloud arrays." }
                ].map((faq, idx) => (
                  <div className="accordion-item border-bottom border-light" key={idx}>
                    <h3 className="accordion-header" id={`aboutHeading${idx}`}>
                      <button
                        className="accordion-button collapsed fw-bold text-dark py-3.5 px-4 fs-6"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#aboutCollapse${idx}`}
                        aria-expanded="false"
                        aria-controls={`aboutCollapse${idx}`}
                      >
                        {faq.q}
                      </button>
                    </h3>
                    <div
                      id={`aboutCollapse${idx}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`aboutHeading${idx}`}
                      data-bs-parent="#aboutFaqAccordion"
                    >
                      <div className="accordion-body text-secondary lh-relaxed px-4 pb-4 pt-1 small">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Call To Action Section */}
      <section className="w-100 py-5 bg-white mb-4 m-0">
        <div className="container">
          <div className="bg-dark text-white rounded-5 p-5 shadow-lg text-center position-relative overflow-hidden border border-secondary">
            <div className="row justify-content-center position-relative z-1 py-5">
              <div className="col-lg-9 col-xl-8">
                <h2 className="display-4 fw-bold text-white mb-4 tracking-tight">Start Your Smart Financial Journey Today</h2>
                <p className="lead text-secondary mb-5 fs-5 mx-auto max-w-600 lh-base">
                  Manage your finances with confidence using AI-powered insights and modern financial management tools.
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <Link to="/" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-semibold shadow-sm hover-translate-y transition">
                    Explore Features
                  </Link>
                  <a href="mailto:developer@example.com" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-semibold hover-bg-light transition">
                    Contact Developer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded CSS configurations for advanced SaaS UI micro-actions */}
      <style>{`
        .fw-black { font-weight: 900; }
        .tracking-tight { letter-spacing: -0.035em; }
        .tracking-wider { letter-spacing: 0.12em; }
        .transition { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-translate-y:hover { transform: translateY(-3px); }
        .style-zoom-wrapper { overflow: hidden; border-radius: 20px !important; }
        .style-zoom-img { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); object-fit: cover; }
        .style-zoom-wrapper:hover .style-zoom-img { transform: scale(1.025); }
        .style-avatar { width: 80px; height: 80px; border: 3px solid #fff; }
        .style-hero-icon-card { width: 100%; max-width: 360px; }
        .accordion-button:not(.collapsed) { background-color: #f8f9fa; color: #0d6efd; box-shadow: none; }
        .accordion-button:focus { box-shadow: none; }
        .py-3.5 { padding-top: 1.2rem; padding-bottom: 1.2rem; }
        .max-w-600 { max-width: 600px; }
        .hover-bg-light:hover { background-color: #fff !important; color: #212529 !important; }
        .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important; }
        .shadow-2xs { box-shadow: 0 1px 2px rgba(0,0,0,0.01) !important; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse { animation: pulse 3s infinite ease-in-out; }
      `}</style>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}