import React from "react";

export default function ModuleContent({ title, icon, colorClass }) {
  return (
    <main className="main-content">
      <div className="module-content">
        <div className="module-center">
          <div className={`module-main-icon nav-icon-container ${colorClass}`}>
            {React.createElement(icon, { className: `nav-icon ${colorClass}` })}
          </div>
          <h2>{title} Module</h2>
          <p>Configure and manage {title.toLowerCase()} functionality for Nephele 3.0</p>

          <div className="module-features">
            <div className="feature-card">
              <h3>Settings</h3>
              <p>Configure module parameters</p>
            </div>
            <div className="feature-card">
              <h3>Analytics</h3>
              <p>View usage statistics</p>
            </div>
            <div className="feature-card">
              <h3>Logs</h3>
              <p>Monitor system activity</p>
            </div>
            <div className="feature-card">
              <h3>History</h3>
              <p>Review past sessions</p>
            </div>
          </div>

          <button className={`action-button ${colorClass}`}>
            Start {title} Session
          </button>
        </div>
      </div>
    </main>
  );
}
