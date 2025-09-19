import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Conversation() {
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
              <div className="module-icon-container nav-icon-container orange">
                <MessageCircle className="module-icon nav-icon orange" />
              </div>
              <div className="module-title">
                <h1>Conversation</h1>
                <p>Nephele 3.0 • Conversation Module</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="module-content">
          <div className="module-center">
            <div className="module-main-icon nav-icon-container orange">
              <MessageCircle className="nav-icon orange" />
            </div>
            <h2>Conversation Module</h2>
            <p>Configure and manage conversation functionality for Nephele 3.0</p>

            <div className="module-features">
              <div className="feature-card"><h3>Settings</h3><p>Configure module parameters</p></div>
              <div className="feature-card"><h3>Analytics</h3><p>View usage statistics</p></div>
              <div className="feature-card"><h3>Logs</h3><p>Monitor system activity</p></div>
              <div className="feature-card"><h3>History</h3><p>Review past sessions</p></div>
            </div>

            <button className="action-button orange">Start Conversation Session</button>
          </div>
        </div>
      </main>
    </div>
  );
}
