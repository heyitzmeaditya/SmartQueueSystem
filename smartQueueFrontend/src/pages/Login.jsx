import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      const role = res.data.user.role;
      if (role === "USER") nav("/user");
      if (role === "STAFF") nav("/staff");
      if (role === "ADMIN") nav("/admin");
    } catch {
      alert("Invalid Login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-black">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl w-[380px] text-white shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6">
          Smart Queue System
        </h2>

        <input
          className="w-full p-3 rounded-lg bg-black/40 mb-4 outline-none border border-white/10"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 rounded-lg bg-black/40 mb-6 outline-none border border-white/10"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg font-semibold transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
