import { useState, useEffect } from "react";
import { Button, Input, Upload, message, Card, Image as AntImage } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./App.css";

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [spriteWidth, setSpriteWidth] = useState(0);
  const [spriteHeight, setSpriteHeight] = useState(0);
  const [totalSprites, setTotalSprites] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [sprites, setSprites] = useState<HTMLCanvasElement[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false;
  };

  const splitSpriteSheet = () => {
    if (!imageFile || !spriteWidth || !spriteHeight || !totalSprites) {
      message.error("Please provide all required inputs.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = () => {
      const cols = Math.floor(img.width / spriteWidth);
      const canvasSprites: HTMLCanvasElement[] = [];

      for (let i = 0; i < totalSprites; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = spriteWidth;
        canvas.height = spriteHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const x = (i % cols) * spriteWidth;
          const y = Math.floor(i / cols) * spriteHeight;
          ctx.drawImage(
            img,
            x,
            y,
            spriteWidth,
            spriteHeight,
            0,
            0,
            spriteWidth,
            spriteHeight
          );
          canvasSprites.push(canvas);
        }
      }
      setSprites(canvasSprites);
    };
  };

  useEffect(() => {
    if (sprites.length > 0) {
      const interval = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % sprites.length);
      }, 1000 / animationSpeed);
      return () => clearInterval(interval);
    }
  }, [sprites, animationSpeed]);

  return (
    <div className="App">
      <h1>Sprite Animation Viewer</h1>

      <Card style={{ maxWidth: 600, margin: "20px auto", padding: 20 }}>
        <Upload
          beforeUpload={handleImageUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Upload Sprite Sheet</Button>
        </Upload>

        {previewUrl && (
          <AntImage
            src={previewUrl}
            alt="Uploaded Sprite Sheet"
            style={{ margin: "20px 0", maxWidth: "100%" }}
          />
        )}

        <Input
          type="number"
          placeholder="Sprite Width"
          value={spriteWidth}
          onChange={(e) => setSpriteWidth(Number(e.target.value))}
          style={{ margin: "10px 0" }}
        />
        <Input
          type="number"
          placeholder="Sprite Height"
          value={spriteHeight}
          onChange={(e) => setSpriteHeight(Number(e.target.value))}
          style={{ margin: "10px 0" }}
        />
        <Input
          type="number"
          placeholder="Total Sprites"
          value={totalSprites}
          onChange={(e) => setTotalSprites(Number(e.target.value))}
          style={{ margin: "10px 0" }}
        />
        <Input
          type="number"
          placeholder="Animation Speed (FPS)"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(Number(e.target.value))}
          style={{ margin: "10px 0" }}
        />

        <Button
          type="primary"
          onClick={splitSpriteSheet}
          style={{ marginTop: 10 }}
        >
          Generate Sprites
        </Button>
      </Card>

      <div
        className="animation-container"
        style={{ textAlign: "center", marginTop: 20 }}
      >
        {sprites.length > 0 && (
          <img
            src={sprites[currentFrame].toDataURL()}
            alt={`Frame ${currentFrame + 1}`}
            style={{ width: spriteWidth, height: spriteHeight }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
