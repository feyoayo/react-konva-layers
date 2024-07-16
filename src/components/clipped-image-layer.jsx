import React, { useRef } from "react";
import useImage from "use-image";
import { Image, Layer } from "react-konva";
import { selectLayer } from "../store/layers-store.js";

const ClippedImageLayer = ({ imgLink, x, y }) => {
  const imageRef = useRef();
  const [avatar] = useImage(imgLink);

  // const [avatarMoving, setAvatarMoving] = useState({
  //   isDragging: false,
  //   x: 50,
  //   y: 50,
  // });
  return (
    <Layer x={x} y={y} onClick={() => selectLayer("clipped")}>
      <Image
        // draggable
        // width={150}
        // height={200}
        image={avatar}
        ref={imageRef}
        // opacity={avatarMoving.isDragging ? 0.5 : 1}
        // onDragStart={() =>
        //   setAvatarMoving((prev) => ({ ...prev, isDragging: true }))
        // }
        // onDragEnd={(e) => {
        //   setAvatarMoving({
        //     isDragging: false,
        //     x: e.target.x(),
        //     y: e.target.y(),
        //   });
        // }}
      />
    </Layer>
  );
};

export default ClippedImageLayer;
