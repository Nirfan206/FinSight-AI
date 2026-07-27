import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

// Premium SVG Component replacing basic bullet points
const CustomCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check-circle-fill text-primary me-3 mt-1 flex-shrink-0" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
  </svg>
);

export default function HomePage() {
  return (
    <div className="w-100 bg-white text-dark min-vh-100 overflow-hidden m-0 p-0 selection-bg-primary">
      {/* 1. Navbar */}
      <NavBar />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. About FinSight AI Section */}
      <section className="w-100 py-5 bg-light border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10 col-xl-8">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-3 text-uppercase tracking-wider">
                System Overview
              </span>
              <h2 className="display-5 fw-bold text-dark mb-4 tracking-tight">
                A Smarter Approach to Managing Your Personal Finances
              </h2>
              <p className="lead text-secondary fs-5 lh-lg mb-0">
                FinSight AI simplifies the way you track, manage, and optimize your money. By combining clean data visualization, automated record keeping, and personalized artificial intelligence, our platform empowers you to see the big picture of your wealth. We bring your income, daily expenses, long-term budgets, and financial reports together under a secure desktop layout built to eliminate spreadsheets and financial guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3b. Core Features Grid Section */}
      <section className="w-100 py-5 bg-white border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold text-dark mb-3 tracking-tight">Everything You Need to Manage Your Money</h2>
              <p className="text-secondary fs-6">Explore the robust toolset built directly into your FinSight AI account workspace.</p>
            </div>
          </div>
          <div className="row g-4">
            {[
              { title: "Transactions", desc: "View an organized ledger of all your recent bank account adjustments and manual transactions.", icon: "💳" },
              { title: "Budget Management", desc: "Create flexible envelopes and dynamic category targets to align your monthly spending goals.", icon: "📅" },
              { title: "Expense Tracking", desc: "Keep tabs on where your cash goes with automated visual category distributions.", icon: "📊" },
              { title: "Upload Receipts", desc: "Snap a quick photo or drop receipt files to extract receipt details directly into your ledger.", icon: "📄" },
              { title: "AI Financial Insights", desc: "Receive continuous recommendations and custom savings alerts parsed by advanced intelligence models.", icon: "🧠" },
              { title: "Reports & Analytics", desc: "Generate pixel-perfect PDF data summaries and interactive timeline graphs over arbitrary periods.", icon: "📈" }
            ].map((feature, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 bg-light hover-translate-y transition">
                  <div className="fs-1 mb-3">{feature.icon}</div>
                  <h3 className="fs-5 fw-bold text-dark mb-2">{feature.title}</h3>
                  <p className="text-secondary small mb-0 lh-base">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dashboard Preview Section (Image Left, Text Right Layout Block) */}
      <section className="w-100 py-5 bg-light border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center">
              <div className="position-relative p-2 bg-white rounded-4 shadow-lg overflow-hidden style-zoom-wrapper">
                <img
                  src="/screenshots/dashboard.png"
                  alt="FinSight AI Central Dashboard Overview"
                  className="img-fluid rounded-4 w-100 style-zoom-img bg-light"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">Central Management</span>
              <h2 className="display-6 fw-bold text-dark mb-4 tracking-tight">Your Financial Overview in One Clean Interface</h2>
              <p className="text-secondary lh-relaxed mb-4">
                Say goodbye to jumping between multiple mobile banking interfaces and fragmented personal finance files. FinSight AI arranges your net worth data cleanly within a single central hub that presents totals instantly. The interface reads your aggregated accounts, traces net worth shifts across monthly intervals, and flags recent transaction balances automatically. By reviewing all metrics inside one secure, modern platform, you can evaluate your cash position clearly and make smarter daily calls. Keep continuous tabs on multi-tier accounts, active budgets, and savings reserves without the friction of tracking down disjointed entries.
              </p>
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-start"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Unified account balances tracking</p></div>
                  <div className="d-flex align-items-start mt-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Monthly income totals tracking</p></div>
                  <div className="d-flex align-items-start mt-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Complete expense tracking overview</p></div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Active savings progress monitors</p></div>
                  <div className="d-flex align-items-start mt-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Recent transactions ledger view</p></div>
                  <div className="d-flex align-items-start mt-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">High-resolution interactive charts</p></div>
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-lg px-4 py-2.5 rounded-pill fw-semibold shadow-sm hover-translate-y transition">
                Explore Dashboard Terminal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Income Management Section (Text Left, Image Right Layout Block) */}
      <section className="w-100 py-5 bg-white border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <span className="text-success fw-bold text-uppercase tracking-wider small d-block mb-2">Income Ingestion</span>
              <h2 className="display-6 fw-bold text-dark mb-4 tracking-tight">Track Multiple Income Streams Easily</h2>
              <p className="text-secondary lh-relaxed mb-4">
                Managing money gets complicated when cash arrives from diverse channels like full-time salary payrolls, freelance clients, investment payouts, and side projects. The FinSight AI income ledger structures independent deposits clearly, giving you an honest baseline of what you take in each month. The application displays your current monthly growth rates, compares seasonal shifts, and helps you earmark incoming funds before they dissolve into unmonitored accounts. By recognizing how your aggregate incoming streams behave, you gain better confidence over how to plan next months goals. Let the ledger catalog multi-stream payouts cleanly so you stay entirely organized.
              </p>
              <div className="row g-2 mb-4">
                <div className="col-md-12">
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Multi-source income streams tracking lists</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Automated multi-currency spot rate conversions</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Predictive incoming dividend distribution tracking</p></div>
                  <div className="d-flex align-items-start"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Direct routing splits into pre-set savings buckets</p></div>
                </div>
              </div>
              <button type="button" className="btn btn-success btn-lg px-4 py-2.5 rounded-pill fw-semibold shadow-sm hover-translate-y transition">
                Track Income Stream
              </button>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 text-center">
              <div className="position-relative p-2 bg-light rounded-4 shadow-lg overflow-hidden style-zoom-wrapper">
                <img
                  src="/screenshots/income.png"
                  alt="FinSight AI Income Tracking View"
                  className="img-fluid rounded-4 w-100 style-zoom-img bg-light"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Expense Tracking Section (Image Left, Text Right Layout Block) */}
      <section className="w-100 py-5 bg-light border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center">
              <div className="position-relative p-2 bg-white rounded-4 shadow-lg overflow-hidden style-zoom-wrapper">
                <img
                  src="/screenshots/expense.png"
                  alt="FinSight AI Expense Breakdown View"
                  className="img-fluid rounded-4 w-100 style-zoom-img bg-light"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <span className="text-danger fw-bold text-uppercase tracking-wider small d-block mb-2">Cost Analysis</span>
              <h2 className="display-6 fw-bold text-dark mb-4 tracking-tight">Monitor Your Daily Spending Habits Automatically</h2>
              <p className="text-secondary lh-relaxed mb-4">
                Discretionary costs and minor shopping bills have a sneaky habit of eroding long-term investments when left unchecked. FinSight AI breaks down where every dollar travels by parsing individual transaction histories into clear, color-coded distributions. The utility sorts luxury categories, isolates mandatory utilities, and automatically surfaces recurring app subscriptions you might have abandoned months ago. Instead of staring at messy, unclassified card statements, you see immediate, high-contrast summaries of outlays. This granular visibility helps you make fast changes, protect cash reserves, and stop overspending before the monthly window closes out completely.
              </p>
              <div className="row g-2 mb-4">
                <div className="col-md-12">
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Automated expense category sorting arrays</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Recurring app subscription identification warnings</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Interactive graphs comparing luxury vs essential outlays</p></div>
                  <div className="d-flex align-items-start"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">One-click historical vendor transaction filtering logs</p></div>
                </div>
              </div>
              <button type="button" className="btn btn-danger btn-lg px-4 py-2.5 rounded-pill fw-semibold shadow-sm hover-translate-y transition">
                Analyse System Expenses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Budget Planning Section (Text Left, Image Right Layout Block) */}
      <section className="w-100 py-5 bg-white border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <span className="text-info fw-bold text-uppercase tracking-wider small d-block mb-2">Budget Goals</span>
              <h2 className="display-6 fw-bold text-dark mb-4 tracking-tight">Build Dynamic Budgets That Move with Your Life</h2>
              <p className="text-secondary lh-relaxed mb-4">
                Most personal budget trackers fail because life is full of unexpected spikes and irregular seasonal bills. FinSight AI relies on fluid category envelopes that recalculate allowance parameters based on historic 90-day spend habits. The system protects core wealth pools while dynamically shifting category allocations whenever unexpected emergencies arrive. Whether you are funding an upcoming holiday or saving for real estate down payments, our platform keeps your targets in sync. You stay completely informed without feeling burdened by traditional systems that break during irregular weeks.
              </p>
              <div className="row g-2 mb-4">
                <div className="col-md-12">
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Adaptive budgeting models that automatically adjust limits</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Support for zero-based budgeting allocations</p></div>
                  <div className="d-flex align-items-start"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Instant balance warning alerts before categories max out</p></div>
                </div>
              </div>
              <button type="button" className="btn btn-info text-white btn-lg px-4 py-2.5 rounded-pill fw-semibold shadow-sm hover-translate-y transition">
                Create Dynamic Budget
              </button>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 text-center">
              <div className="position-relative p-2 bg-light rounded-4 shadow-lg overflow-hidden style-zoom-wrapper">
                <img
                  src="/screenshots/budget.png"
                  alt="FinSight AI Budget Planning Panel"
                  className="img-fluid rounded-4 w-100 style-zoom-img bg-light"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AI Financial Advisor Section (Image Left, Text Right Layout Block) */}
      <section className="w-100 py-5 bg-light border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center">
              <div className="position-relative p-2 bg-white rounded-4 shadow-lg overflow-hidden style-zoom-wrapper">
                <img
                  src="/screenshots/ai.png"
                  alt="FinSight AI Insights Advisor interface"
                  className="img-fluid rounded-4 w-100 style-zoom-img bg-light"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <span className="text-warning fw-bold text-uppercase tracking-wider small d-block mb-2">Artificial Intelligence</span>
              <h2 className="display-6 fw-bold text-dark mb-4 tracking-tight">Personalized Financial Insights Available Any Time</h2>
              <p className="text-secondary lh-relaxed mb-4">
                Generic articles provide very little value when dealing with your explicit personal budget parameters. FinSight AI resolves this by deploying a specialized analytical data layer designed to spot systemic wealth inefficiencies inside your history. The module evaluates your recurring cost habits, contrasts performance with historical targets, and isolates optimal ways to reallocate funds. Get specific alerts outlining ideal moments to fund high-yield reserves or clean up inefficient category spend streaks. It serves as your permanent dashboard advisor working tirelessly to optimize savings metrics.
              </p>
              <div className="row g-2 mb-4">
                <div className="col-md-12">
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Customized AI budget suggestions tailored to daily spending habits</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Predictive expense trendlines anticipating upcoming monthly utility bills</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Smart automated savings recommendations maximizing leftover capital</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Instant abnormal transaction alerts isolating unexpected outlays</p></div>
                  <div className="d-flex align-items-start"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">A single aggregated Financial Health Score tracking net stability</p></div>
                </div>
              </div>
              <button type="button" className="btn btn-warning text-dark btn-lg px-4 py-2.5 rounded-pill fw-bold shadow-sm hover-translate-y transition">
                Get AI Financial Insights
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Reports & Analytics Section (Text Left, Image Right Layout Block) */}
      <section className="w-100 py-5 bg-white border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">Reports Hub</span>
              <h2 className="display-6 fw-bold text-dark mb-4 tracking-tight">Generate Detailed Financial Reports in Seconds</h2>
              <p className="text-secondary lh-relaxed mb-4">
                Reviewing long-range transactional data is incredibly useful when organized into clean visual summaries. Our generation panel aggregates heavy transaction sheets into clear vector graphs ideal for quarterly planning, tax submission organization, or routine monthly self-audits. FinSight AI processes interactive timeline histories, maps your net growth curves, and enables instant downloads. Save time compiling paper trails or sorting chaotic transaction dates at the end of every fiscal term.
              </p>
              <div className="row g-2 mb-4">
                <div className="col-md-12">
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Granular Monthly Reports tracking categorical outflows</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Comprehensive Yearly Reports mapping macro wealth shifts</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Instant vector layout PDF Exports ready for filing</p></div>
                  <div className="d-flex align-items-start"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">High-resolution interactive charts and line graphs</p></div>
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-lg px-4 py-2.5 rounded-pill fw-semibold shadow-sm hover-translate-y transition">
                Generate Reports Console
              </button>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 text-center">
              <div className="position-relative p-2 bg-light rounded-4 shadow-lg overflow-hidden style-zoom-wrapper">
                <img
                  src="/screenshots/reports.png"
                  alt="FinSight AI Reports Dashboard View"
                  className="img-fluid rounded-4 w-100 style-zoom-img bg-light"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Receipt Scanner Section (Image Left, Text Right Layout Block) */}
      <section className="w-100 py-5 bg-light border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-center">
              <div className="position-relative p-2 bg-white rounded-4 shadow-lg overflow-hidden style-zoom-wrapper">
                <img
                  src="/screenshots/receipt.png"
                  alt="FinSight AI Digital Receipt Scanning Tool"
                  className="img-fluid rounded-4 w-100 style-zoom-img bg-light"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <span className="text-secondary fw-bold text-uppercase tracking-wider small d-block mb-2">Receipt Upload</span>
              <h2 className="display-6 fw-bold text-dark mb-4 tracking-tight">Scan and Store Your Physical Receipts Electronically</h2>
              <p className="text-secondary lh-relaxed mb-4">
                Manually logging detailed purchase slips into tracking applications takes an excessive amount of effort and opens the door to transcription mistakes. FinSight AI addresses this bottleneck with built-in digital upload scanners that read invoices instantly. Simply upload a picture or drop a digital slip file to isolate totals, map sales tax percentages, and assign vendors effortlessly. The scanner links your invoice image directly to its corresponding card line item, removing duplicate paperwork completely. Keep tax records clean, tidy, and completely audit-ready without filing physical folders.
              </p>
              <div className="row g-2 mb-4">
                <div className="col-md-12">
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Instant file drop integration system for rapid image ingestion</p></div>
                  <div className="d-flex align-items-start mb-2"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Automated split calculation for invoice totals and merchant data</p></div>
                  <div className="d-flex align-items-start"><CustomCheckIcon /> <p className="small mb-0 text-dark fw-medium">Direct secure cloud file attachments tied to individual ledger records</p></div>
                </div>
              </div>
              <button type="button" className="btn btn-dark btn-lg px-4 py-2.5 rounded-pill fw-semibold shadow-sm hover-translate-y transition">
                Upload New Receipts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Application Workflow Journey Section */}
      <section className="w-100 py-5 bg-white border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-3 text-uppercase">
                User Journey
              </span>
              <h2 className="display-6 fw-bold text-dark mb-3 tracking-tight">Your Path to Better Financial Control</h2>
              <p className="text-secondary fs-6">See how easily FinSight AI fits into your routine in nine simple steps.</p>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-9 g-3 text-center position-relative justify-content-center">
            {[
              { step: "1", name: "Register", desc: "Create your secure profile." },
              { step: "2", name: "Login", desc: "Access your dashboard console." },
              { step: "3", name: "Dashboard", desc: "Review your initial net metrics." },
              { step: "4", name: "Add Income", desc: "Log active cash inflows." },
              { step: "5", name: "Track Expenses", desc: "Sort outbound daily transactions." },
              { step: "6", name: "Create Budget", desc: "Set adaptive spending limits." },
              { step: "7", name: "Upload Receipts", desc: "Snapshot paper records instantly." },
              { step: "8", name: "Generate Reports", desc: "Compile detailed PDF analytics." },
              { step: "9", name: "Get AI Insights", desc: "Optimize wealth with smart advisory." }
            ].map((wf, idx) => (
              <div className="col" key={idx}>
                <div className="p-3 bg-light rounded-4 h-100 border border-light-subtle shadow-xs">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-2 style-badge-size">
                    {wf.step}
                  </div>
                  <h4 className="fs-6 fw-bold text-dark mb-1">{wf.name}</h4>
                  <p className="text-muted small mb-0 style-desc-size">{wf.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Technology Stack Infrastructure Section */}
      <section className="w-100 py-5 bg-light border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold mb-3 text-uppercase">
                System Infrastructure
              </span>
              <h2 className="display-6 fw-bold text-dark mb-3 tracking-tight">Built on Modern, Secure Technology</h2>
              <p className="text-secondary fs-6">
                FinSight AI relies on proven enterprise application structures to guarantee exceptional reliability and sub-second calculation speeds.
              </p>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              { name: "React.js", tier: "Frontend Interface", desc: "Powers a lightning-fast, reactive single-page user platform with fluid interactive visual updates.", icon: "⚛️" },
              { name: "Spring Boot", tier: "Backend Core", desc: "Manages our robust rest API controller layers with enterprise failover resilience under high requests load.", icon: "🍃" },
              { name: "MySQL", tier: "Database Layer", desc: "Maintains relational transaction integrity using strict ACID parameters to secure asset tracking records.", icon: "🐬" },
              { name: "AWS S3", tier: "Cloud Storage", desc: "Hosts encrypted receipt slip images inside highly distributed, redundant cloud storage nodes securely.", icon: "☁️" },
              { name: "Gemini AI", tier: "Financial Insights", desc: "Drives our deep contextual advisory routines to deliver dynamic, personalized money management suggestions.", icon: "✨" },
              { name: "JWT Tokens", tier: "Secure Authentication", desc: "Validates secure identity communication parameters across micro-services to guard accounts data securely.", icon: "🔐" }
            ].map((tech, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="card h-100 border-0 shadow-sm rounded-4 bg-white hover-translate-y transition">
                  <div className="card-body p-4 text-center">
                    <div className="fs-2 mb-2">{tech.icon}</div>
                    <h3 className="fs-5 fw-bold text-dark mb-1">{tech.name}</h3>
                    <span className="text-muted small d-block mb-3 fw-medium">{tech.tier}</span>
                    <p className="card-text text-secondary small lh-relaxed mb-0">{tech.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FAQ Accordion Section */}
      <section className="w-100 py-5 bg-white border-bottom border-light m-0">
        <div className="container py-5">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-7">
              <span className="text-primary fw-bold text-uppercase tracking-wider small d-block mb-2">Common Questions</span>
              <h2 className="display-6 fw-bold text-dark mb-3 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-secondary fs-6">
                Clear details regarding security, accounting methods, and file import functionalities.
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-9 col-xl-8">
              <div className="accordion accordion-flush shadow-sm rounded-4 border border-light overflow-hidden bg-white" id="faqAccordion">
                {[
                  { q: "Is my personal budget information securely protected?", a: "Yes. All personal transaction layers rest entirely isolated using advanced AES-256 standards at rest and travel over TLS 1.3 pathways during transit." },
                  { q: "Can I connect my traditional bank card accounts automatically?", a: "We sync balance parameters via secure, tokenized API providers operating under read-only access blocks. Your secret passwords never pass our environment." },
                  { q: "Does the budget tool handle different global currencies?", a: "Yes. The application runs automated real-time conversions against active market spot values, formatting foreign outlays directly to your local dashboard currency." },
                  { q: "How accurate is the receipt upload scanner data extraction?", a: "Our integrated intelligence system isolates total amounts, local sales taxes, and merchant names with high precision, pairing images right to ledger lines." },
                  { q: "Can I build multiple separate custom budget envelopes?", a: "Absolutely. The software architecture lets you establish independent sub-budgets for vacation plans, business splits, or domestic utility bills freely." },
                  { q: "Is it easy to export my monthly transaction ledger data?", a: "Yes. You can output comprehensive monthly analytical summaries or complete tabular records to perfect vector PDF formats in one simple step." }
                ].map((faq, idx) => (
                  <div className="accordion-item border-bottom border-light" key={idx}>
                    <h3 className="accordion-header" id={`heading${idx}`}>
                      <button
                        className="accordion-button collapsed fw-bold text-dark py-3.5 px-4 fs-6"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${idx}`}
                        aria-expanded="false"
                        aria-controls={`collapse${idx}`}
                      >
                        {faq.q}
                      </button>
                    </h3>
                    <div
                      id={`collapse${idx}`}
                      className="accordion-collapse collapse"
                      aria-labelledby={`heading${idx}`}
                      data-bs-parent="#faqAccordion"
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

      {/* 14. Terminal Call To Action Section */}
      <section className="w-100 py-5 bg-white m-0 mb-4">
        <div className="container">
          <div className="bg-dark text-white rounded-5 p-5 shadow-lg text-center position-relative overflow-hidden border border-secondary">
            <div className="row justify-content-center position-relative z-1 py-5">
              <div className="col-lg-9 col-xl-8">
                <h2 className="display-4 fw-bold text-white mb-4 tracking-tight">Take Control of Your Personal Finances with FinSight AI</h2>
                <p className="lead text-secondary mb-5 fs-5 mx-auto max-w-600 lh-base">
                  Join thousands of proactive everyday users tracking income, logging daily expenses, and generating clear wealth forecasts cleanly.
                </p>
                
                <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
                  <Link
                    to="/login"
                    className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-semibold shadow hover-translate-y transition"
                  >
                    Login to Console
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-semibold hover-bg-light transition"
                  >
                    Register Terminal Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded CSS configurations for advanced Premium UI layout adjustments */}
      <style>{`
        .tracking-tight { letter-spacing: -0.035em; }
        .tracking-wider { letter-spacing: 0.12em; }
        .transition { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-translate-y:hover { transform: translateY(-3px); }
        .style-zoom-wrapper { overflow: hidden; border-radius: 20px !important; }
        .style-zoom-img { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); object-fit: cover; }
        .style-zoom-wrapper:hover .style-zoom-img { transform: scale(1.025); }
        .style-badge-size { width: 32px; height: 32px; font-size: 0.9rem; }
        .style-desc-size { font-size: 0.75rem; line-height: 1.3; }
        .accordion-button:not(.collapsed) { background-color: #f8f9fa; color: #0d6efd; box-shadow: none; }
        .accordion-button:focus { box-shadow: none; }
        .py-3.5 { padding-top: 1.2rem; padding-bottom: 1.2rem; }
        .max-w-600 { max-width: 600px; }
        .hover-bg-light:hover { background-color: #fff !important; color: #212529 !important; }
        .selection-bg-primary ::selection { background: #0d6efd; color: white; }
      `}</style>

      {/* 15. Footer */}
      <Footer />
    </div>
  );
}