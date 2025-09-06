import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function UrlDashboard() {
  const [tab, setTab] = useState("shorten"); // shorten | history
  const [originalUrl, setOriginalUrl] = useState("");
  const [result, setResult] = useState(null);
  const [urls, setUrls] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Validation URL
  const validateUrl = (url) => {
    if (!url || url.trim() === "") return "Please enter a URL";
    if (url.length > 2048) return "URL is too long (maximum 2048 characters)";
    try {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return "Only HTTP and HTTPS URLs are allowed";
      }
    } catch {
      return "Please enter a valid URL";
    }
    return null;
  };

  // ✅ Shorten API
  const fetchAPI = async () => {
    setError("");
    setResult(null);
    const validationError = validateUrl(originalUrl);
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/shorten",
        { originalUrl },
        { withCredentials: true }
      );
      if (!response.data?.shortUrl) throw new Error("Invalid response");
      setResult(response.data);
    } catch (err) {
      if (err.response?.status === 401) setError("Please login to use this service");
      else setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ History API
  const fetchUserHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:3000/user/history", {
        withCredentials: true,
      });
      setUrls(res.data.urls || []);
    } catch {
      setError("ไม่สามารถโหลดประวัติได้");
    } finally {
      setLoading(false);
    }
  };

  const fetchUrlHistory = async (shorturl_id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/history/${shorturl_id}`, {
        withCredentials: true,
      });
      setSelectedHistory(res.data);
    } catch {
      setError("ไม่สามารถโหลดรายละเอียดได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "history") fetchUserHistory();
  }, [tab]);

  //ลบ

  const deleteUrl = async (shorturl_id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบ Short URL นี้?")) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/${shorturl_id}`, {
        withCredentials: true,
      });
      // อัพเดตตารางใหม่ (filter เอาอันที่ลบออก)
      setUrls((prev) => prev.filter((u) => u.shorturl_id !== shorturl_id));
    } catch {
      setError("ไม่สามารถลบได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        {/* ✅ Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => {
              setTab("shorten");
              setSelectedHistory(null);
            }}
            className={`px-4 py-2 font-semibold ${tab === "shorten"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
              }`}
          >
            🔗 Shorten URL
          </button>
          <button
            onClick={() => {
              setTab("history");
              setResult(null);
            }}
            className={`px-4 py-2 font-semibold ${tab === "history"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
              }`}
          >
            📊 History
          </button>
        </div>

        {/* ✅ Error/Loading */}
        {error && <p className="text-red-500 mb-4">❌ {error}</p>}
        {loading && <p className="text-gray-500 mb-4">⏳ Loading...</p>}

        {/* ================= Shorten ================= */}
        {tab === "shorten" && (
          <div className="space-y-6">
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
                }`}
            />
            <button
              onClick={fetchAPI}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md"
                }`}
            >
              {loading ? "⏳ Shortening..." : "✨ Shorten URL"}
            </button>

            {result && (
              <div className="mt-6 border-t pt-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  ✅ Result
                </h2>
                <p>
                  <span className="font-medium">Original:</span>{" "}
                  <a
                    href={result.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {result.originalUrl}
                  </a>
                </p>
                <p>
                  <span className="font-medium">Short URL:</span>{" "}
                  <a
                    href={result.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline"
                  >
                    {result.shortUrl}
                  </a>
                </p>
                <div className="mt-3">
                  <span className="font-medium">QR Code:</span>
                  <div className="mt-2 flex justify-center">
                    <img
                      src={result.qrCode}
                      alt="QR Code"
                      className="w-40 h-40 rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= History ================= */}
        {tab === "history" && (
          <div>
            {!selectedHistory && urls.length === 0 && (
              <p className="text-gray-600">ยังไม่มี Short URL ที่สร้าง</p>
            )}
            {!selectedHistory && urls.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 border-b">Short URL</th>
                      <th className="p-3 border-b">Original</th>
                      <th className="p-3 border-b text-center">Visits</th>
                      <th className="p-3 border-b text-center">Last Access</th>
                      <th className="p-3 border-b text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url) => (
                      <tr
                        key={url.shorturl_id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="p-3 border-b text-blue-600">
                          <a
                            href={url.short_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url.short_url}
                          </a>
                        </td>
                        <td className="p-3 border-b break-all">{url.original_url}</td>
                        <td className="p-3 border-b text-center">{url.total_visits}</td>
                        <td className="p-3 border-b text-center">
                          {url.last_accessed
                            ? new Date(url.last_accessed).toLocaleString()
                            : "-"}
                        </td>
                        <td className="p-3 border-b text-center ">
                          <button
                            onClick={() => fetchUrlHistory(url.shorturl_id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-1"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteUrl(url.shorturl_id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* รายละเอียดการเข้าถึง */}
            {selectedHistory && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                <h2 className="text-xl font-semibold mb-3">
                  📑 History for {selectedHistory.shorturl_id}
                </h2>
                <p className="mb-2">
                  Total Visits:{" "}
                  <span className="font-bold">{selectedHistory.total_visits}</span>
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-3 border-b">Visitor</th>
                        <th className="p-3 border-b">Access Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHistory.history.map((h) => (
                        <tr key={h.history_id} className="hover:bg-gray-50">
                          <td className="p-3 border-b">{h.accessed_by || "Unknown"}</td>
                          <td className="p-3 border-b">
                            {new Date(h.access_time).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => setSelectedHistory(null)}
                  className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  🔙 Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
