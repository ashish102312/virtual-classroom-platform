import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

const Whiteboard = ({ classId, socket, isTeacher }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set initial canvas size
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = 500;

        // Handle window resize
        const handleResize = () => {
            // logic to resize could go here, but might clear canvas
        };
        window.addEventListener("resize", handleResize);

        // Socket listeners for incoming drawings
        socket.on("draw", (data) => {
            draw(data.x, data.y, data.color, data.width, data.type);
        });

        socket.on("clearBoard", () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        return () => {
            window.removeEventListener("resize", handleResize);
            socket.off("draw");
            socket.off("clearBoard");
        };
    }, [socket]);

    const startDrawing = (e) => {
        if (!isTeacher) return; // Only teacher can draw for now (or make it collaborative)

        const { offsetX, offsetY } = e.nativeEvent;
        setIsDrawing(true);
        draw(offsetX, offsetY, color, lineWidth, "start");

        socket.emit("draw", { classId, x: offsetX, y: offsetY, color, width: lineWidth, type: "start" });
    };

    const finishDrawing = () => {
        setIsDrawing(false);
        socket.emit("draw", { classId, type: "end" });
    };

    const draw = (x, y, drawColor, width, type) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.strokeStyle = drawColor;

        if (type === "start") {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else if (type === "move") {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (type === "end") {
            ctx.closePath();
        }
    };

    const drawing = (e) => {
        if (!isDrawing || !isTeacher) return;

        const { offsetX, offsetY } = e.nativeEvent;
        draw(offsetX, offsetY, color, lineWidth, "move");

        socket.emit("draw", { classId, x: offsetX, y: offsetY, color, width: lineWidth, type: "move" });
    };

    const clearBoard = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit("clearBoard", { classId });
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">Interactive Whiteboard</h3>
                {isTeacher && (
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-10 h-10 cursor-pointer rounded"
                        />
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(e.target.value)}
                            className="cursor-pointer"
                        />
                        <button
                            onClick={clearBoard}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Clear
                        </button>
                    </div>
                )}
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-white cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={drawing}
                    onMouseLeave={finishDrawing}
                    className="w-full h-[500px]"
                />
            </div>
            {!isTeacher && <p className="text-gray-500 text-sm mt-2">Only the teacher can draw on the whiteboard.</p>}
        </div>
    );
};

export default Whiteboard;
