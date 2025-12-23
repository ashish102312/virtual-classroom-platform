import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import Whiteboard from "./Whiteboard";
import Polls from "./Polls";
import Assignments from "./Assignments";
import VideoPeer from "./VideoPeer";

const socket = io("http://localhost:3000");

const LiveClass = ({ classId, user, setPage }) => {
    const [activeTab, setActiveTab] = useState("chat");
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isHandRaised, setIsHandRaised] = useState(false);

    // Video State
    const [peers, setPeers] = useState([]);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const [videoEnabled, setVideoEnabled] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        // Join Class Room
        socket.emit("joinClass", classId);

        // Get User Media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            // Set my video
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }

            // 1. Receive existing users
            socket.on("allUsers", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socket.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    });
                    peers.push({
                        peerID: userID,
                        peer,
                    });
                });
                setPeers(peers);
            });

            // 2. Handle incoming call (new user joined)
            socket.on("userJoined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                });
                setPeers(users => [...users, { peerID: payload.callerID, peer }]);
            });

            // 3. Handle answer signal
            socket.on("receivingReturnedSignal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        }).catch(err => console.error("Media Error:", err));

        // Chat Listeners
        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("allUsers");
            socket.off("userJoined");
            socket.off("receivingReturnedSignal");
            // Cleanup peers?
            peersRef.current.forEach(p => p.peer.destroy());
        };
    }, [classId]);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("sendingSignal", { userToSignal, callerID, signal });
        });

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socket.emit("returningSignal", { signal, callerID });
        });

        peer.signal(incomingSignal);

        return peer;
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const msgData = {
            classId,
            user: user.id || user._id,
            userName: user.name || user.email.split("@")[0],
            userRole: user.role,
            text: inputText,
            createdAt: new Date(),
        };

        socket.emit("sendMessage", msgData);
        setInputText("");
    };

    const toggleHand = () => {
        setIsHandRaised(!isHandRaised);
    };

    const toggleVideo = () => {
        if (userVideo.current && userVideo.current.srcObject) {
            const stream = userVideo.current.srcObject;
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoEnabled;
                setVideoEnabled(!videoEnabled);
            }
        }
    };

    return (
        <div className="h-screen bg-gray-900 text-white flex flex-col">
            {/* HEADER */}
            <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => setPage("dashboard")} className="text-gray-400 hover:text-white">
                        ← Exit
                    </button>
                    <h1 className="font-bold text-xl">Live Classroom</h1>
                    <span className="bg-red-500 text-xs px-2 py-1 rounded animate-pulse">LIVE</span>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={toggleVideo} className={`px-3 py-1 rounded text-sm font-bold ${videoEnabled ? 'bg-green-600' : 'bg-red-600'}`}>
                        {videoEnabled ? "📹 On" : "📹 Off"}
                    </button>
                    {user.role === "student" && (
                        <button
                            onClick={toggleHand}
                            className={`px-4 py-2 rounded-full font-bold transition ${isHandRaised ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}
                        >
                            {isHandRaised ? "✋ Hand Raised" : "✋ Raise Hand"}
                        </button>
                    )}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT/CENTER: WHITEBOARD & VIDEO */}
                <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
                    {/* VIDEO GRID */}
                    <div className="flex gap-4 overflow-x-auto min-h-[150px] bg-black/50 p-2 rounded-xl">
                        {/* MY VIDEO */}
                        <div className="relative w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-green-500 shrink-0">
                            <video muted ref={userVideo} autoPlay playsInline className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">You</span>
                        </div>

                        {/* PEERS */}
                        {peers.map((p, idx) => (
                            <div key={idx} className="relative w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 shrink-0">
                                <VideoPeer peer={p.peer} />
                            </div>
                        ))}
                    </div>

                    {/* WHITEBOARD */}
                    <div className="flex-1 min-h-[500px]">
                        <Whiteboard classId={classId} socket={socket} isTeacher={user.role === "teacher"} />
                    </div>
                </div>

                {/* RIGHT: SIDEBAR (CHAT, POLLS, ETC) */}
                <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                    {/* TABS */}
                    <div className="flex border-b border-gray-700">
                        {["chat", "polls", "assignments"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-sm font-semibold capitalize ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* TAB CONTENT */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {activeTab === "chat" && (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 space-y-4 mb-4 overflow-y-auto pr-2 custom-scrollbar">
                                    {messages.map((m, i) => {
                                        const isMe = m.user === user.id;
                                        const isTeacher = m.userRole === "teacher";

                                        return (
                                            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    {!isMe && <span className={`text-xs font-bold ${isTeacher ? "text-purple-400" : "text-gray-300"}`}>{m.userName}</span>}
                                                    <span className="text-[10px] text-gray-500">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className={`px-4 py-2 rounded-2xl text-sm max-w-[90%] ${isMe
                                                    ? "bg-blue-600 text-white rounded-br-none"
                                                    : isTeacher
                                                        ? "bg-purple-900/80 border border-purple-500/50 text-white rounded-bl-none"
                                                        : "bg-gray-700 text-gray-200 rounded-bl-none"
                                                    }`}>
                                                    {m.text}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {messages.length === 0 && <p className="text-gray-500 text-center text-sm mt-10">No messages yet.</p>}
                                </div>

                                <form onSubmit={sendMessage} className="mt-auto flex gap-2">
                                    <input
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <button type="submit" className="bg-blue-600 px-3 py-2 rounded-lg text-white font-bold">→</button>
                                </form>
                            </div>
                        )}

                        {activeTab === "polls" && (
                            <Polls classId={classId} isTeacher={user.role === "teacher"} token={token} socket={socket} />
                        )}

                        {activeTab === "assignments" && (
                            <Assignments classId={classId} isTeacher={user.role === "teacher"} token={token} userId={user.id || user._id} socket={socket} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveClass;
