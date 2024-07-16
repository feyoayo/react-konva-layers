import React, { useState } from "react";
import { Circle, Image, Layer, Line } from "react-konva";
import useImage from "use-image";
import { selectLayer } from "../store/layers-store.js";

// eslint-disable-next-line react/prop-types
const BackgroundLayer = ({ width, height }) => {
  const layerRef = React.useRef();
  const [points, setPoints] = useState([]);
  const [bgImage] = useImage("/img.png");

  const handleMouseDown = (e, isDot) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    // setIsDrawing(true);
    setPoints((prevPoints) => [...prevPoints, point.x, point.y]);
    console.log("Point 1");
    console.log(point);

    if (isDot) {
      const startDot = { x: points[0], y: points[1] };
      console.log("clicked on dot");
      saveSelection();
    }
  };

  const saveSelection = () => {
    // if (points.length < 6) return;

    console.log(points);
    const imageElement = bgImage;

    // Create a canvas for the selected area
    const selectedCanvas = document.createElement("canvas");

    // selectedCanvas.width = 600;
    // selectedCanvas.height = 400;
    const selectedContext = selectedCanvas.getContext("2d");

    // Draw the image on the new canvas
    selectedContext.drawImage(imageElement, 0, 0);

    // Create a clipping path using the points
    selectedContext.save();
    selectedContext.beginPath();
    points.forEach((point, index) => {
      // if (index % 2 === 0) {
      selectedContext.lineTo(point, points[index + 1]);
      // }
    });
    selectedContext.closePath();
    selectedContext.clip();

    // Create a new canvas to fit the selected area
    const bounds = points.reduce(
      (acc, point, index) => {
        if (index % 2 === 0) {
          acc.minX = Math.min(acc.minX, point);
          acc.maxX = Math.max(acc.maxX, point);
          acc.minY = Math.min(acc.minY, points[index + 1]);
          acc.maxY = Math.max(acc.maxY, points[index + 1]);
        }
        return acc;
      },
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
    );

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = bounds.maxX - bounds.minX;
    finalCanvas.height = bounds.maxY - bounds.minY;
    const finalContext = finalCanvas.getContext("2d");

    // Draw the clipped image to the final canvas
    finalContext.drawImage(
      selectedCanvas,
      bounds.minX,
      bounds.minY,
      finalCanvas.width,
      finalCanvas.height,
      0,
      0,
      finalCanvas.width,
      finalCanvas.height,
    );

    // Convert the new canvas to an image URL
    // const selectedImageURL = finalCanvas.toDataURL();
    // const link = document.createElement("a");
    // link.href = selectedImageURL;
    // link.download = "selected-image.png";
    // link.click();
  };

  return (
    <Layer ref={layerRef} onClick={() => selectLayer("background")}>
      <Image
        width={width}
        height={height}
        // width={window.innerWidth}
        // height={window.innerHeight}
        image={bgImage}
        // onDblClick={handleDblClick}
        // onMouseDown={handleMouseDown}
        // onMouseMove={handleMouseMove}
        // onMouseUp={handleMouseUp}
      />
      <Line
        points={points}
        stroke="blue"
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
        closed={
          points.length >= 6 &&
          points[0] === points[points.length - 2] &&
          points[1] === points[points.length - 1]
        }
      />
      {points.map(
        (point, index) =>
          index % 2 === 0 && (
            <Circle
              onClick={(e) => handleMouseDown(e, true)}
              key={index}
              x={point}
              y={points[index + 1]}
              radius={4}
              fill="red"
            />
          ),
      )}
    </Layer>
  );
};

export default BackgroundLayer;
