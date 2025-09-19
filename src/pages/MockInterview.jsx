import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/teaching.css";

export default function MockInterview() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="module-header">
        <div className="header-container">
          <div className="module-header-content">
            <button onClick={() => navigate("/")} className="back-button">
              <ArrowLeft className="back-icon" />
            </button>
            <div className="module-brand">
              <div className="module-icon-container nav-icon-container blue">
                <MessageCircle className="module-icon nav-icon blue" />
              </div>
              <div className="module-title">
                <h1>Mock Interview</h1>
                <p>Nephele 3.0 • Mock Interview Module</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="module-content">
          <div className="module-center">
            <div className="module-main-icon nav-icon-container blue">
              <MessageCircle className="nav-icon blue" />
            </div>
            <h2>Mock Interview Module</h2>
            <p>Configure and manage mock interview functionality for Nephele 3.0</p>

            <div className="module-features">
              <div className="feature-card"><h3>Settings</h3><p>Configure module parameters</p></div>
              <div className="feature-card"><h3>Analytics</h3><p>View usage statistics</p></div>
              <div className="feature-card"><h3>Logs</h3><p>Monitor system activity</p></div>
              <div className="feature-card"><h3>History</h3><p>Review past sessions</p></div>
            </div>

            <button className="action-button blue">Start Mock Interview Session</button>
          </div>
        </div>
      </main>
    </div>
  );
}
