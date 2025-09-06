import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ถ้าใช้ react-router-dom

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, {
        withCredentials: true, // ถ้าใช้ cookie
      });

      localStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout ล้มเหลว ลองใหม่อีกครั้ง");
    }
  };

  return (
    <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-xl">
      {/* Logo */}
      <p className="text-2xl font-bold text-gray-800">ShortUrl</p>

      {/* Links */}
      <ul className="flex space-x-6">
        <li>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
