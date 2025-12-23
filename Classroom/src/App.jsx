import React, { useState, useEffect } from "react";
import Welcome from "./components/Welcome";
import Auth from "./components/Auth";
import LiveClass from "./components/LiveClass"; // Renamed/New Component
import Dashboard from "./components/Dashboard";

function App() {
  const [page, setPage] = useState("welcome");
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeClassId, setActiveClassId] = useState(null);

  // ✅ AUTO LOGIN + DARK MODE RESTORE
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedTheme = localStorage.getItem("theme");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage("dashboard");
    }

    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  // ✅ LOGIN
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setPage("dashboard");
  };

  // ✅ LOGOUT (FULL RESET)
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setPage("welcome");
    setActiveClassId(null);
  };

  // ✅ ENTER CLASS
  const enterClass = (classId) => {
    setActiveClassId(classId);
    setPage("live-class");
  };

  // ✅ DARK MODE HANDLER
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black transition-all">

        {page === "welcome" && <Welcome setPage={setPage} />}

        {page === "auth" && (
          <Auth setPage={setPage} handleLogin={handleLogin} />
        )}

        {/* ✅ PROTECTED DASHBOARD */}
        {page === "dashboard" && user ? (
          <Dashboard
            user={user}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            handleLogout={handleLogout}
            enterClass={enterClass}
          />
        ) : (
          page === "dashboard" && setPage("welcome")
        )}

        {page === "live-class" && user && activeClassId ? (
          <LiveClass classId={activeClassId} user={user} setPage={setPage} />
        ) : (
          page === "live-class" && setPage("dashboard")
        )}
      </div>
    </div>
  );
}

export default App;
