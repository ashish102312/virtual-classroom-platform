import React, { useState, useEffect } from "react";

const Polls = ({ classId, isTeacher, token, socket }) => {
    const [polls, setPolls] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });

    useEffect(() => {
        fetchPolls();

        if (socket) {
            socket.on("newPoll", (poll) => {
                if (poll.class === classId) {
                    setPolls((prev) => [poll, ...prev]);
                }
            });

            socket.on("pollUpdated", (updatedPoll) => {
                setPolls((prev) => prev.map((p) => (p._id === updatedPoll._id ? updatedPoll : p)));
            });
        }

        return () => {
            if (socket) {
                socket.off("newPoll");
                socket.off("pollUpdated");
            }
        };
    }, [classId, socket]);

    const fetchPolls = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/polls/class/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setPolls(data);
        } catch (err) {
            console.error("Fetch polls error:", err);
        }
    };

    const createPoll = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/polls", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    classId,
                    question: newPoll.question,
                    options: newPoll.options.filter(o => o.trim())
                })
            });

            if (res.ok) {
                setShowCreate(false);
                setNewPoll({ question: "", options: ["", ""] });
                fetchPolls();
            }
        } catch (err) {
            console.error("Create poll error:", err);
        }
    };

    const votePoll = async (pollId, optionIndex) => {
        try {
            const res = await fetch(`http://localhost:3000/api/polls/${pollId}/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ optionIndex })
            });

            if (res.ok) {
                fetchPolls();
            } else {
                const d = await res.json();
                alert(d.message);
            }
        } catch (err) {
            console.error("Vote error:", err);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow-xl text-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">📊 Live Polls</h3>
                {isTeacher && (
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="text-sm bg-cyan-600 px-3 py-1 rounded"
                    >
                        {showCreate ? "Cancel" : "+ New Poll"}
                    </button>
                )}
            </div>

            {showCreate && (
                <div className="bg-black/20 p-4 rounded-lg mb-4">
                    <input
                        placeholder="Question?"
                        value={newPoll.question}
                        onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                        className="w-full mb-2 p-2 rounded bg-black/30"
                    />
                    {newPoll.options.map((opt, i) => (
                        <input
                            key={i}
                            placeholder={`Option ${i + 1}`}
                            value={opt}
                            onChange={(e) => {
                                const newOpts = [...newPoll.options];
                                newOpts[i] = e.target.value;
                                setNewPoll({ ...newPoll, options: newOpts });
                            }}
                            className="w-full mb-2 p-2 rounded bg-black/30 text-sm"
                        />
                    ))}
                    <button onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ""] })} className="text-xs text-cyan-300 mr-2">+ Add Option</button>
                    <button onClick={createPoll} className="bg-green-600 px-4 py-1 rounded text-sm">Launch</button>
                </div>
            )}

            <div className="space-y-4 max-h-60 overflow-y-auto">
                {polls.map(poll => (
                    <div key={poll._id} className="bg-white/5 p-3 rounded-lg">
                        <p className="font-semibold mb-2">{poll.question}</p>
                        {poll.options.map((opt, i) => {
                            const totalVotes = poll.options.reduce((acc, o) => acc + o.votes, 0);
                            const percentage = totalVotes ? Math.round((opt.votes / totalVotes) * 100) : 0;

                            return (
                                <div key={i} className="mb-2 relative">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>{opt.text}</span>
                                        <span>{percentage}% ({opt.votes})</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden cursor-pointer" onClick={() => votePoll(poll._id, i)}>
                                        <div
                                            className="bg-cyan-500 h-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Polls;
