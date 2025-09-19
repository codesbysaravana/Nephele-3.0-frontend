import React, { useState, useRef } from "react";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio("/luvvoice.com-20250919-irP23K.mp3")); // file inside public/

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false); // reset state when audio ends
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={togglePlay} style={styles.button}>
        {isPlaying ? "Pause Audio" : "Play Audio"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
};

export default AudioPlayer;
