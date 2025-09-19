import React from "react";

export default function NavGrid({ routes, navigate }) {
  return (
    <div className="nav-grid">
      {routes.map((route) => {
        const IconComponent = route.icon;
        return (
          <button
            key={route.path}
            onClick={() => navigate(route.path)}
            className="nav-card"
          >
            <div className="nav-content">
              <div className={`nav-icon-container ${route.color}`}>
                <IconComponent className={`nav-icon ${route.color}`} />
              </div>
              <div className="nav-text">
                <h3>{route.title}</h3>
                <p>Access {route.title.toLowerCase()} module</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
