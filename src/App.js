import React, { useState, useRef } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const img = URL.createObjectURL(file);
    setImage(img);
    analyzeColor(file);
  };

  const analyzeColor = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        const hydrationLevel = classifyColor(r, g, b);
        setResult(hydrationLevel);
        setHistory(prev => [...prev, { r, g, b, hydrationLevel, timestamp: new Date().toLocaleString() }]);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const classifyColor = (r, g, b) => {
    const brightness = (r + g + b) / 3;
    if (brightness > 220) return 'Doskonałe nawodnienie';
    if (brightness > 180) return 'Dobre nawodnienie';
    if (brightness > 140) return 'Odwodnienie – wypij wodę';
    return 'Silne odwodnienie – skonsultuj się z lekarzem';
  };

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      setImage(URL.createObjectURL(file));
      analyzeColor(file);
    });
  };

  return (
    <div className="min-h-screen p-8 bg-yellow-50 text-center">
      <h1 className="text-3xl font-bold mb-4">Analizator Nawodnienia</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />

      <div className="my-4">
        <button onClick={startCamera} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Włącz kamerę</button>
        <button onClick={captureImage} className="bg-green-500 text-white px-4 py-2 rounded">Zrób zdjęcie</button>
      </div>

      <video ref={videoRef} autoPlay className="mx-auto mb-4" width="320" height="240" />
      <canvas ref={canvasRef} width="320" height="240" className="hidden" />

      {image && <img src={image} alt="Uploaded" className="mx-auto my-4 max-h-64" />}
      {result && (
        <div className="mt-4 p-4 bg-white rounded shadow-md text-lg">
          <strong>Wynik:</strong> {result}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8 text-left max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Historia pomiarów:</h2>
          <ul className="bg-white rounded p-4 shadow">
            {history.map((item, index) => (
              <li key={index} className="border-b py-2">
                <span className="font-medium">{item.timestamp}:</span> {item.hydrationLevel} (RGB: {item.r}, {item.g}, {item.b})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
