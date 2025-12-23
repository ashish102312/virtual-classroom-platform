import { useEffect, useState } from "react";
import io from "socket.io-client";

// ✅ SOCKET CONNECTS TO BACKEND
const socket = io("http://localhost:3000");

function Dashboard({ user, handleLogout, enterClass, darkMode, toggleDarkMode }) {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("token");

  /* ================= FETCH CLASSES ================= */
  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error("Fetch classes error:", err);
    }
  };

  /* ================= SOCKET ================= */
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      // Only show global lobby messages here if they don't have a classId
      if (!msg.classId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receiveMessage");
  }, []);

  /* ================= INIT ================= */
  useEffect(() => {
    fetchClasses();
  }, []);

  /* ================= GLOBAL CHAT ================= */
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      user: user.id || user._id, // Robust ID check
      userName: user.name || "User",
      userRole: user.role, // Added role
      text: message,
      createdAt: new Date().toISOString(),
    }); // No classId = global

    setMessage("");
  };

  /* ================= CREATE CLASS ================= */
  // ... (keep existing createClass if needed, but replace only targeted block)
  const createClass = async (e) => {
    e.preventDefault();

    const className = e.target.name.value;
    const subject = e.target.subject.value;
    const startTime = e.target.startTime.value;
    const endTime = e.target.endTime.value;

    try {
      const res = await fetch("http://localhost:3000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: className,
          subject,
          startTime,
          endTime,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Class created successfully!");
        fetchClasses();
        e.target.reset();
      } else {
        alert(data.message || "Failed to create class");
      }
    } catch (err) {
      console.error("Create class error:", err);
    }
  };

  /* ================= JOIN CLASS ================= */
  const joinClass = async (id) => {
    try {
      const res = await fetch("http://localhost:3000/api/classes/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Joined class successfully! The list will refresh.");
        fetchClasses();
      } else {
        console.warn("Join failed:", data);
        alert(data.message || "Failed to join class");
        // Refresh list just in case
        fetchClasses();
      }
    } catch (err) {
      console.error("Join class error:", err);
      alert("Error joining class. Check console.");
    }
  };

  const displayName = user.name || user.email?.split("@")[0] || "User";

  return (
    <div className={`min-h-screen px-6 py-10 transition-colors duration-500 ${darkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-2 ring-blue-400">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Welcome, {displayName}!
              </h1>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {user.role === "teacher" ? "👨‍🏫 Teacher Access" : "🎓 Student Portal"}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleDarkMode}
              className="px-6 py-2 rounded-full bg-gray-800 text-white font-semibold hover:bg-gray-700 transition"
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-red-500/30 shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ================= MAIN CONTENT (CLASSES) ================= */}
          <div className="lg:col-span-2 space-y-8">

            {/* TEACHER CREATION FORM */}
            {user.role === "teacher" && (
              <div className={`p-8 rounded-2xl shadow-xl border border-white/10 ${darkMode ? "bg-gray-900/50" : "bg-white"}`}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="text-2xl">➕</span> Create New Class
                </h3>
                <form onSubmit={createClass} className="grid md:grid-cols-2 gap-4">
                  {["name", "subject", "startTime", "endTime"].map((f) => (
                    <input
                      key={f}
                      name={f}
                      type={f.includes("Time") ? "time" : "text"}
                      placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                      required
                      className={`px-4 py-3 rounded-xl border-2 focus:border-blue-500 outline-none transition ${darkMode ? "bg-black border-gray-700 text-white" : "bg-gray-50 border-gray-200"}`}
                    />
                  ))}
                  <button className="md:col-span-2 bg-gradient-to-r from-cyan-500 to-blue-600 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-cyan-500/25 transition-transform active:scale-95">
                    Create Class
                  </button>
                </form>
              </div>
            )}

            {/* CLASS LIST */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-blue-500">📚</span> Your Classes
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {classes.length === 0 ? (
                  <p className="text-gray-500">No classes found.</p>
                ) : classes.map((cls) => {
                  const myID = String(user.id || user._id);
                  const isMember =
                    cls.students?.some(s => String(s._id || s) === myID) ||
                    String(cls.teacher?._id || cls.teacher) === myID;

                  return (
                    <div
                      key={cls._id}
                      className={`p-6 rounded-2xl shadow-lg border hover:border-blue-500/50 transition duration-300 relative overflow-hidden ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-10 text-6xl">🎓</div>
                      <h3 className="font-bold text-xl mb-1">{cls.name}</h3>
                      <p className="text-blue-400 text-sm font-medium mb-4 uppercase tracking-wider">{cls.subject}</p>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <span>⏰ {cls.startTime} - {cls.endTime}</span>
                      </div>

                      <div className="mt-auto">
                        {isMember ? (
                          <button
                            onClick={() => enterClass(cls._id)}
                            className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/20 transition-all active:scale-95"
                          >
                            ➜ Enter Classroom
                          </button>
                        ) : (
                          <button
                            onClick={() => joinClass(cls._id)}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                          >
                            Join Class
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= SIDEBAR (GLOBAL CHAT) ================= */}
          <div className={`p-6 rounded-2xl shadow-xl border border-white/10 flex flex-col h-[600px] ${darkMode ? "bg-gray-900/80" : "bg-white"}`}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-green-500">●</span> Global Lobby Chat
            </h3>

            <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar flex flex-col gap-3">
              {messages.map((m, i) => {
                const myID = user.id || user._id;
                const isMe = m.user === myID;
                const isTeacher = m.userRole === "teacher";
                const time = new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className={`flex items-baseline gap-1 mb-1 text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <span className={`font-bold ${isTeacher ? "text-purple-500" : ""}`}>
                        {isMe ? "You" : m.userName} {isTeacher ? "(Teacher)" : ""}
                      </span>
                      <span>•</span>
                      <span>{time}</span>
                    </div>
                    <div className={`px-4 py-2 max-w-[85%] rounded-2xl text-sm shadow-sm ${isMe
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : isTeacher
                        ? "bg-purple-600 text-white rounded-tl-none border border-purple-400"
                        : (darkMode ? "bg-gray-800 text-gray-200 rounded-tl-none" : "bg-gray-200 text-gray-900 rounded-tl-none")
                      }`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
              {messages.length === 0 && <p className="text-center text-gray-500 text-sm mt-10">Say hello to everyone!</p>}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className={`flex-1 px-4 py-2 rounded-xl border focus:border-blue-500 outline-none text-sm ${darkMode ? "bg-black border-gray-700" : "bg-gray-50 border-gray-200"}`}
              />
              <button className="bg-blue-600 text-white px-4 rounded-xl font-bold hover:bg-blue-700 transition">
                ➤
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
