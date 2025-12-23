import React, { useEffect, useRef } from "react";

const VideoPeer = ({ peer }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;
        });
    }, [peer]);

    return (
        <div className="relative bg-black rounded-lg overflow-hidden w-full h-full">
            <video playsInline autoPlay ref={ref} className="w-full h-full object-cover" />
        </div>
    );
};

export default VideoPeer;
