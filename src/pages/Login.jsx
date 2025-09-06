import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Login
  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await axios.post(
      "http://35.202.71.133:3000:3000/auth/login",
      { username, password },
      { withCredentials: true } // ✅ ให้ axios รับ cookie กลับมาจาก backend
    );

    alert("เข้าสู่ระบบสำเร็จ");
    navigate("/shorturl");

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};

  // ✅ Guest Login
 const handleGuest = async () => {
  try {
    await axios.post("http://35.202.71.133:3000:3000/auth/guest", {}, { withCredentials: true });
    alert("เข้าสู่ระบบ Guest");
    navigate("/shorturl");
  } catch (err) {
    setError("Guest login failed");
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
        {/* Logo */}
        <div className="text-center">
          <img
            alt="Your Company"
            src={Logo}
            className="mx-auto h-28 w-auto drop-shadow-md"
          />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
