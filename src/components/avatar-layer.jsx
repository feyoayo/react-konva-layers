import React, { useRef, useState } from "react";
import useImage from "use-image";
import { Image, Layer, Transformer } from "react-konva";
import { selectLayer, useLayersStore } from "../store/layers-store.js";

const AvatarLayer = () => {
  const selectedLayer = useLayersStore((s) => s.selectedLayer);
  const imageRef = useRef();
  const transformerRef = useRef();
  const [avatar] = useImage("/avatar_medium.webp");

  const [avatarMoving, setAvatarMoving] = useState({
    isDragging: false,
    x: 50,
    y: 50,
  });

  const onLayerClick = () => {
    selectLayer("avatar");
  };
  return (
    <Layer onClick={onLayerClick}>
      <Image
        draggable
        image={avatar}
        ref={imageRef}
        opacity={avatarMoving.isDragging ? 0.5 : 1}
        onClick={() => {
          transformerRef.current.nodes([imageRef.current]);
          transformerRef.current.getLayer().batchDraw();
        }}
        onDragStart={() =>
          setAvatarMoving((prev) => ({ ...prev, isDragging: true }))
        }
        onDragEnd={(e) => {
          setAvatarMoving({
            isDragging: false,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
      />
      <Transformer
        visible={selectedLayer === "avatar"}
        ref={transformerRef}
        rotateEnabled={false}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 20 || newBox.height < 20) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </Layer>
  );
};

export default AvatarLayer;
