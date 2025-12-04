import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminDashboard() {
  const [tokens, setTokens] = useState([]);

  // ✅ Load queue every 2 seconds (auto refresh)
  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await API.get("/queue");
      setTokens(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FILTER BASED ON STATUS
  const nowServing = tokens.find((t) => t.status === "SERVING");
  const pendingTokens = tokens.filter((t) => t.status === "PENDING");
  const servedTokens = tokens.filter((t) => t.status === "SERVED");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black p-10 text-white">
      <h2 className="text-4xl font-bold mb-10">Admin Queue Dashboard</h2>

      {/* ✅ NOW SERVING */}
      <div className="mb-10">
        <h3 className="text-2xl text-yellow-400 mb-2">Now Serving</h3>
        {nowServing ? (
          <div className="bg-yellow-600/20 border border-yellow-500 px-6 py-4 rounded-xl w-fit">
            Token #{nowServing.tokenNumber}
          </div>
        ) : (
          <p className="text-gray-400">No active token</p>
        )}
      </div>

      {/* ✅ PENDING TOKENS */}
      <div className="mb-10">
        <h3 className="text-2xl text-blue-400 mb-4">Pending Tokens</h3>

        {pendingTokens.length === 0 ? (
          <p className="text-gray-400">No pending tokens</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingTokens.map((t) => (
              <div
                key={t._id}
                className="bg-blue-500/10 border border-blue-500 px-6 py-4 rounded-xl"
              >
                Token #{t.tokenNumber}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ SERVED HISTORY */}
      <div>
        <h3 className="text-2xl text-green-400 mb-4">Served History</h3>

        {servedTokens.length === 0 ? (
          <p className="text-gray-400">No served tokens yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {servedTokens.map((t) => (
              <div
                key={t._id}
                className="bg-green-500/10 border border-green-500 px-6 py-4 rounded-xl"
              >
                Token #{t.tokenNumber}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
