import React, { useState } from "react";
import ReactLassoSelect, { getCanvas } from "react-lasso-select";

const LasoSelect = ({ setClippedImg }) => {
  const [points, setPoints] = useState([]);
  const [uploadedImg, setUploadedImg] = useState();
  return (
    <div>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const src = URL.createObjectURL(file);
              setUploadedImg(src);
            }
          }}
        />
      </div>

      <ReactLassoSelect
        value={points}
        src={uploadedImg}
        onChange={(value) => {
          setPoints(value);
        }}
        imageStyle={{ width: "600px", height: "300px" }}
        onComplete={(value) => {
          if (!value.length) return;
          getCanvas(uploadedImg, value, (err, canvas) => {
            if (!err) {
              setClippedImg(canvas.toDataURL());
            }
          });
        }}
      />
      <div>Points: {points.map(({ x, y }) => `${x},${y}`).join(" ")}</div>
    </div>
  );
};

export default LasoSelect;
