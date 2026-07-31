import { Routes, Route } from "react-router-dom";

// Public Access Landing Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import RegisterPage from "./pages/RegisterPage";

// Security & Layout Wrappers
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Production Dashboard Pages
import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import IncomePage from "./pages/IncomePage";
import ExpensePage from "./pages/ExpensePage";
import BudgetPage from "./pages/BudgetPage";
import FinancialGoalsPage from "./pages/FinancialGoalsPage";
import ReceiptVaultPage from "./pages/ReceiptVaultPage";
import AIChatPage from "./pages/AIChatPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
    return (
        <Routes>
            {/* Public Access Paths */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Secure Protected Workspace Ecosystem shifted to /dashboard */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                {/* Nested Dashboard Sub-routes mapping perfectly with Sidebar links */}
                <Route index element={<DashboardOverviewPage />} />
                <Route path="income" element={<IncomePage />} />
                <Route path="expenses" element={<ExpensePage />} />
                <Route path="budgets" element={<BudgetPage />} />
                <Route path="goals" element={<FinancialGoalsPage />} />
                <Route path="receipts" element={<ReceiptVaultPage />} />
                <Route path="ai-chat" element={<AIChatPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>
        </Routes>
    );
}

export default App;