import React, { useState } from 'react';
import CameraCapture from './CameraCapture';

function App() {
  const [result, setResult] = useState("");

  const handleColorDetected = ({ r, g, b }) => {
    console.log("Kolor RGB:", r, g, b);

    // Prosta analiza nawodnienia na podstawie jasności koloru
    const brightness = (r + g + b) / 3;

    if (brightness > 180) {
      setResult("Dobrze nawodniony 💧");
    } else if (brightness > 120) {
      setResult("Umiarkowane nawodnienie ⚠️");
    } else {
      setResult("Silne odwodnienie ❗ skontaktuj się z lekarzem lu z farmaceutom bo to zagraża twojemu życiu lub zdrowiu");
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>Sprawdź nawodnienie</h1>
      <CameraCapture onColorDetected={handleColorDetected} />
      {result && <p style={{ fontSize: "1.5rem", marginTop: "1rem" }}>{result}</p>}
    </div>
  );
}

export default App;
