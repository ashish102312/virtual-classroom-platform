import React, { useState, useEffect } from "react";

const Assignments = ({ classId, isTeacher, token, userId, socket }) => {
    const [assignments, setAssignments] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: "", description: "", dueDate: "" });

    useEffect(() => {
        fetchAssignments();

        if (socket) {
            socket.on("newAssignment", (ass) => {
                if (ass.class === classId) setAssignments(prev => [ass, ...prev]);
            });
            socket.on("assignmentUpdated", () => {
                fetchAssignments();
            });
        }
        return () => {
            if (socket) {
                socket.off("newAssignment");
                socket.off("assignmentUpdated");
            }
        }
    }, [classId, socket]);

    const fetchAssignments = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/assignments/class/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setAssignments(data);
        } catch (err) {
            console.error("Fetch assignments error:", err);
        }
    };

    const createAssignment = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    classId,
                    ...newAssignment
                })
            });

            if (res.ok) {
                setShowCreate(false);
                setNewAssignment({ title: "", description: "", dueDate: "" });
                fetchAssignments();
            }
        } catch (err) {
            console.error("Create assignment error:", err);
        }
    };

    const submitAssignment = async (id, content) => {
        try {
            const res = await fetch(`http://localhost:3000/api/assignments/${id}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });
            if (res.ok) {
                alert("Submitted!");
                fetchAssignments(); // refresh to show submitted status
            }
        } catch (err) {
            console.error("Submit error", err);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow-xl text-white mt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">📝 Assignments</h3>
                {isTeacher && (
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="text-sm bg-purple-600 px-3 py-1 rounded"
                    >
                        {showCreate ? "Cancel" : "+ New"}
                    </button>
                )}
            </div>

            {showCreate && (
                <div className="bg-black/20 p-4 rounded-lg mb-4 space-y-2">
                    <input
                        placeholder="Title"
                        value={newAssignment.title}
                        onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                        className="w-full p-2 rounded bg-black/30"
                    />
                    <textarea
                        placeholder="Description"
                        value={newAssignment.description}
                        onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                        className="w-full p-2 rounded bg-black/30 h-20"
                    />
                    <input
                        type="date"
                        value={newAssignment.dueDate}
                        onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                        className="w-full p-2 rounded bg-black/30"
                    />
                    <button onClick={createAssignment} className="bg-purple-600 px-4 py-1 rounded text-sm w-full">Create Assignment</button>
                </div>
            )}

            <div className="space-y-4 max-h-60 overflow-y-auto">
                {assignments.map(ass => {
                    const mySubmission = ass.submissions?.find(s => s.student._id === userId || s.student === userId);
                    const isSubmitted = !!mySubmission;

                    return (
                        <div key={ass._id} className="bg-white/5 p-3 rounded-lg border-l-4 border-purple-500">
                            <div className="flex justify-between">
                                <h4 className="font-bold">{ass.title}</h4>
                                <span className="text-xs text-gray-400">Due: {new Date(ass.dueDate).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">{ass.description}</p>

                            {!isTeacher && (
                                <div className="mt-3">
                                    {isSubmitted ? (
                                        <p className="text-green-400 text-sm">✓ Submitted on {new Date(mySubmission.submittedAt).toLocaleDateString()}</p>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                id={`sub-${ass._id}`}
                                                placeholder="Paste link or text answer..."
                                                className="flex-1 text-sm bg-black/20 p-1 rounded"
                                            />
                                            <button
                                                onClick={() => submitAssignment(ass._id, document.getElementById(`sub-${ass._id}`).value)}
                                                className="bg-purple-600 px-3 py-1 rounded text-xs"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isTeacher && (
                                <p className="text-xs text-gray-400 mt-2">{ass.submissions.length} submissions</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Assignments;
