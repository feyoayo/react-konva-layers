import "./App.css";
import { Stage } from "react-konva";
import React, { useEffect } from "react";
import BackgroundLayer from "./components/background-layer.jsx";
import ReactLassoSelect, { getCanvas } from "react-lasso-select";
import ClippedImageLayer from "./components/clipped-image-layer.jsx";
import AvatarLayer from "./components/avatar-layer.jsx";
import image from "./assets/img.png";
import useImage from "use-image";
import { create } from "zustand";
import {
  addLayers,
  removeAvatarLayer,
  useLayersStore,
} from "./store/layers-store.js";

const usePointsStore = create((setState) => ({
  points: [],
  setPoints: (points) => setState({ points }),
}));

function App() {
  const [clippedImage, setClippedImage] = React.useState();
  const layers = useLayersStore((s) => s.layers);
  const { points, setPoints } = usePointsStore();
  const [img] = useImage(image);
  const stageRef = React.useRef();

  useEffect(() => {
    if (!img) return;
    addLayers([
      {
        isHidden: false,
        name: "Background",
        component: BackgroundLayer,
        props: {
          width: img.width,
          height: img.height,
        },
      },
    ]);
  }, [img]);

  const onDownload = async () => {
    await removeAvatarLayer();
    const dataURL = stageRef.current.toDataURL();
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "image.png";
    document.body.appendChild(a);

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    const { x, y } = calculateTopLeftCorner(points);
    const clippedImageRef = new Image();
    clippedImageRef.src = clippedImage;
    ctx.drawImage(clippedImageRef, x, y);
    const dataURL2 = canvas.toDataURL();
    const a2 = document.createElement("a");
    a2.href = dataURL2;
    a2.download = "clipped-image.png";
    document.body.appendChild(a2);
    a.click();
    a2.click();
    setPoints([]);
  };

  const onAddAvatar = () => {
    addLayers([
      {
        isHidden: false,
        name: "Avatar",
        component: AvatarLayer,
        props: {},
      },
    ]);
  };

  const calculateTopLeftCorner = (points) => {
    const minX = Math.min(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    return { x: minX, y: minY };
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div>
          {/*<LasoSelect setClippedImg={setClippedImg} />*/}

          <h4>Original image. Lasso here</h4>
          <ReactLassoSelect
            value={points}
            src={"/img.png"}
            onChange={(value) => {
              setPoints(value);
            }}
            imageStyle={{ width: "900px", height: "600px" }}
            onComplete={(value) => {
              if (!value.length) return;
              getCanvas("/img.png", value, (err, canvas) => {
                if (!err) {
                  const { x, y } = calculateTopLeftCorner(points);
                  addLayers([
                    {
                      isHidden: false,
                      name: "Clipped Image",
                      component: ClippedImageLayer,
                      props: { imgLink: canvas.toDataURL(), x, y },
                    },
                  ]);
                  setClippedImage(canvas.toDataURL());
                  // setPoints([]);
                }
              });
            }}
          />
        </div>

        <div
          style={{
            marginTop: "2rem",
          }}
        >
          <h4>Stage with layers</h4>
          <button onClick={onAddAvatar} type={"button"}>
            Add avatar
          </button>
        </div>
        <div
          style={{
            maxWidth: window.innerWidth,
            maxHeight: window.innerHeight,
            overflow: "auto",
          }}
        >
          <Stage ref={stageRef} width={img?.width} height={img?.height}>
            {layers.map(
              (layer, index) =>
                !layer.isHidden && (
                  <layer.component {...layer.props} key={index} />
                ),
            )}
          </Stage>
        </div>
      </div>
      <button onClick={onDownload} type={"button"}>
        Dowload assets
      </button>
    </>
  );
}

export default App;
