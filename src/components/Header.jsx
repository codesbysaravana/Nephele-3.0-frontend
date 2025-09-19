import { Bot, Power } from "lucide-react";

export default function Header({ isOnline, toggleOnline }) {
  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-brand">
            <Bot className="brand-icon" />
            <div className="brand-text">
              <h1>Nephele 3.0</h1>
              <p>Robot Control System</p>
            </div>
          </div>
          <div className="header-controls">
            <div className="status-indicator">
              <div className={`status-dot ${isOnline ? "online" : "offline"}`}></div>
              <span className="status-text">{isOnline ? "Online" : "Offline"}</span>
            </div>
            <button onClick={toggleOnline} className="power-button">
              <Power size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
