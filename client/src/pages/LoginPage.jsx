import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const { login, authUser } = useContext(AuthContext);

  // SINGLE SOURCE OF TRUTH
  const [mode, setMode] = useState("signup"); // signup | login
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  // Redirect if already logged in
  if (authUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "signup") {
      if (!fullName || !email || !password || !bio) {
        alert("Missing Details");
        return;
      }

      login("signup", {
        fullName, // ✅ MATCHES BACKEND
        email,
        password,
        bio,
      });
    } else {
      if (!email || !password) {
        alert("Missing Details");
        return;
      }

      login("login", {
        email,
        password,
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* LEFT */}
      <img
        src={assets.logo_big}
        alt="QuickChat"
        className="w-[min(30vw,250px)]"
      />

      {/* RIGHT */}
      <form
        onSubmit={handleSubmit}
        className="border bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-5 rounded-xl shadow-xl w-[min(90vw,400px)]"
      >
        <h2 className="font-medium text-2xl text-center capitalize">
          {mode === "signup" ? "Sign up" : "Login"}
        </h2>

        {/* SIGNUP ONLY */}
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        )}

        {/* COMMON */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        {/* SIGNUP ONLY */}
        {mode === "signup" && (
          <textarea
            rows={3}
            placeholder="Short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 rounded-md font-medium hover:opacity-90 transition"
        >
          {mode === "signup" ? "Create Account" : "Login"}
        </button>

        <p className="text-sm text-center text-gray-400">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <span
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="text-violet-400 cursor-pointer hover:underline"
          >
            {mode === "signup" ? "Login" : "Create account"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
