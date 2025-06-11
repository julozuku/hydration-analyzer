import React, { useRef, useEffect, useState } from "react";

const CameraCapture = ({ onColorDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // tylna kamera
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Nie można uzyskać dostępu do kamery.");
      }
    };

    getCameraStream();
  }, []);

  const analyzeColor = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let r = 0, g = 0, b = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    r = Math.floor(r / pixelCount);
    g = Math.floor(g / pixelCount);
    b = Math.floor(b / pixelCount);

    onColorDetected({ r, g, b });
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: "400px" }}
      />
      <canvas
        ref={canvasRef}
        width={100}
        height={100}
        style={{ display: "none" }}
      />
      <button onClick={analyzeColor}>Sprawdź nawodnienie</button>
    </div>
  );
};

export default CameraCapture;
