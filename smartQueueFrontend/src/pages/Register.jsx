import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const nav = useNavigate();

  const register = async () => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registration successful");
      nav("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-indigo-900">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl w-[380px] text-white shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        <input
          className="w-full p-3 rounded-lg bg-black/40 mb-4 outline-none"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 rounded-lg bg-black/40 mb-4 outline-none"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 rounded-lg bg-black/40 mb-4 outline-none"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full p-3 rounded-lg bg-black/40 mb-6 outline-none"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="USER">User</option>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          onClick={register}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
