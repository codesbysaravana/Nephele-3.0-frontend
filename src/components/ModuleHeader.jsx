import React from "react";
import { ArrowLeft } from "lucide-react";

export default function ModuleHeader({ title, icon, colorClass, navigate }) {
  return (
    <header className="module-header">
      <div className="header-container">
        <div className="module-header-content">
          <button onClick={() => navigate("/")} className="back-button">
            <ArrowLeft className="back-icon" />
          </button>
          <div className="module-brand">
            <div className={`module-icon-container nav-icon-container ${colorClass}`}>
              {React.createElement(icon, { className: `module-icon nav-icon ${colorClass}` })}
            </div>
            <div className="module-title">
              <h1>{title}</h1>
              <p>Nephele 3.0 • {title} Module</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
