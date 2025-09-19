import React from "react";
import { Activity, Users, Settings } from "lucide-react";

export default function StatsGrid() {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-content">
          <Activity className="stat-icon green" />
          <div className="stat-text">
            <p>System Status</p>
            <p>Active</p>
          </div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-content">
          <Users className="stat-icon blue" />
          <div className="stat-text">
            <p>Active Sessions</p>
            <p>1</p>
          </div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-content">
          <Settings className="stat-icon gray" />
          <div className="stat-text">
            <p>Uptime</p>
            <p>99.8%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
