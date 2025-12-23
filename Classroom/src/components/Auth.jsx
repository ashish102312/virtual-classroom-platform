import { useState } from "react";
import axios from "axios";

const API = "http://localhost:3000"; // ✅ BACKEND PORT

const Auth = ({ setPage, handleLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= LOGIN ================= */
  const submitLogin = async () => {
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email: formData.email.trim(),
        password: formData.password,
      });

      // ✅ SAVE AUTH DATA
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ UPDATE APP STATE
      handleLogin(res.data.user);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  /* ================= REGISTER ================= */
  const submitRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(`${API}/api/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      alert("Registration successful! Please login.");
      setIsLogin(true);
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#050B2E] to-black text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

        <h1 className="text-center text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          VR Classroom
        </h1>

        <p className="text-center text-gray-300 mb-8 text-sm">
          Enter the future of immersive learning
        </p>

        {/* TABS */}
        <div className="flex mb-8 bg-black/40 rounded-full p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-full font-semibold ${
              isLogin
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                : "text-gray-300"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-full font-semibold ${
              !isLogin
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                : "text-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        {isLogin ? (
          <>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-6 px-4 py-3 rounded-lg bg-black/40 border border-white/10"
            />

            <button
              onClick={submitLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-3 rounded-xl font-bold"
            >
              Login to VR Classroom
            </button>
          </>
        ) : (
          <>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10"
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mb-6 px-4 py-3 rounded-lg bg-black/40 border border-white/10"
            >
              <option value="student">🎓 Student</option>
              <option value="teacher">🧑‍🏫 Teacher</option>
            </select>

            <button
              onClick={submitRegister}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-3 rounded-xl font-bold"
            >
              Create VR Account
            </button>
          </>
        )}

        <p
          onClick={() => setPage("welcome")}
          className="text-center mt-8 text-sm text-gray-400 cursor-pointer"
        >
          ← Back to Home
        </p>
      </div>
    </div>
  );
};

export default Auth;
