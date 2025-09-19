import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MockInterview from "./pages/MockInterview";
import Teaching from "./pages/Teaching";
import Conversation from "./pages/Conversation";
import Attendance from "./pages/Attendance";
import QrScanner from "./pages/QrScanner";
import AudioPlayer from "./pages/Compere";
import "./styles/dashboard.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page first */}
        <Route path="/" element={<Landing />} />

        {/* Main app pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/class/teaching" element={<Teaching />} />
        <Route path="/compere" element={<AudioPlayer />} />
        <Route path="/conversation" element={<Conversation />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/qr-scanner" element={<QrScanner />} />

        {/* Optional: 404 page */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
