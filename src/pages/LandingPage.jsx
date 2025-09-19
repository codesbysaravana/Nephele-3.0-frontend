import { useNavigate } from "react-router-dom";
import "../styles/Landing.css" 

export default function Landing() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };

  return (
    <div
      className="landing-container"
      onClick={handleClick}
      style={{
        cursor: "pointer",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background Video */}
      <video
        src="/roboeyes.mp4" 
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      />

      {/* Overlay content */}
      <div
        style={{
          position: "relative",
          color: "white",
          textAlign: "center",
          top: "50%",
          transform: "translateY(-50%)",
          width: "100%",
        }}
      >
      </div>
    </div>
  );
}
