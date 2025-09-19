import { useState } from "react";
import { MessageCircle, Users, BookOpen, Eye, QrCode, UserCheck, Activity, Settings } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const navigate = useNavigate();

  const mainRoutes = [
    { path: "/mock-interview", icon: MessageCircle, title: "Mock Interview", color: "blue" },
    { path: "/class/teaching", icon: BookOpen, title: "Teaching", color: "green" },
    { path: "/compere", icon: Eye, title: "Compere", color: "purple" },
    { path: "/conversation", icon: MessageCircle, title: "Conversation", color: "orange" },
    { path: "/attendance", icon: UserCheck, title: "Attendance", color: "red" },
    { path: "/qr-scanner", icon: QrCode, title: "QR Scanner", color: "indigo" }
  ];

  return (
    <div className="dashboard-container">
      <Header isOnline={isOnline} toggleOnline={() => setIsOnline(!isOnline)} />

      <main className="main-content">
        {/* Stats */}
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
                <p>12</p>
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

        {/* Navigation Grid */}
        <div className="nav-grid">
          {mainRoutes.map(({ path, icon: Icon, title, color }) => (
            <button key={path} onClick={() => navigate(path)} className="nav-card">
              <div className="nav-content">
                <div className={`nav-icon-container ${color}`}>
                  <Icon className={`nav-icon ${color}`} />
                </div>
                <div className="nav-text">
                  <h3>{title}</h3>
                  <p>Access {title.toLowerCase()} module</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
