import React, { useState, useRef, useCallback } from 'react';
import { Stage, Layer, Image, Rect, Transformer } from 'react-konva';
import useImage from 'use-image';

const URLImage = ({ image, onSelect, onChange, shapeProps, isSelected }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    React.useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            <Image
                image={image}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(5, node.height() * scaleY)
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

const ImageEditor = ({ src }) => {
    const [image] = useImage(src);
    const [rectangles, setRectangles] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const stageRef = useRef();

    const handleMouseDown = (event) => {
        if (event.target === stageRef.current) {
            setSelectedId(null);
        }
    };

    const addRectangle = () => {
        const newRect = {
            x: 20,
            y: 20,
            width: 100,
            height: 100,
            id: `rect${rectangles.length + 1}`
        };
        setRectangles([...rectangles, newRect]);
    };

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const handleChange = (newAttrs, id) => {
        const rects = rectangles.slice();
        const index = rects.findIndex((rect) => rect.id === id);
        rects[index] = newAttrs;
        setRectangles(rects);
    };

    return (
        <div>
            <button onClick={addRectangle}>Add Rectangle</button>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                ref={stageRef}
            >
                <Layer>
                    <URLImage
                        image={image}
                        shapeProps={{ x: 0, y: 0, width: image ? image.width : 0, height: image ? image.height : 0 }}
                    />
                    {rectangles.map((rect, i) => (
                        <Rect
                            key={i}
                            {...rect}
                            onClick={() => handleSelect(rect.id)}
                            onTap={() => handleSelect(rect.id)}
                            draggable
                            onDragEnd={(e) => {
                                const newRects = rectangles.slice();
                                newRects[i] = {
                                    ...newRects[i],
                                    x: e.target.x(),
                                    y: e.target.y()
                                };
                                setRectangles(newRects);
                            }}
                            onTransformEnd={(e) => {
                                const node = e.target;
                                const scaleX = node.scaleX();
                                const scaleY = node.scaleY();

                                node.scaleX(1);
                                node.scaleY(1);
                                const newRects = rectangles.slice();
                                newRects[i] = {
                                    ...newRects[i],
                                    x: node.x(),
                                    y: node.y(),
                                    width: Math.max(5, node.width() * scaleX),
                                    height: Math.max(5, node.height() * scaleY)
                                };
                                setRectangles(newRects);
                            }}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};

export default ImageEditor;