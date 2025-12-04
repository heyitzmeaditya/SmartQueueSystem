// smartQueueFrontend/src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api/api";

export default function UserDashboard() {
  const [myToken, setMyToken] = useState(null);
  const [nowServing, setNowServing] = useState(null);
  const [aheadCount, setAheadCount] = useState(0);
  const [pendingTokens, setPendingTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [takingToken, setTakingToken] = useState(false);

  // ------------------------------------------------------------------
  // Load user view (your token + now serving + queue)
  // ------------------------------------------------------------------
  const loadUserView = async () => {
    try {
      const res = await API.get("/queue/user-view");
      setMyToken(res.data.myToken || null);
      setNowServing(res.data.nowServing || null);
      setAheadCount(res.data.aheadCount || 0);
      setPendingTokens(res.data.pendingTokens || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserView();

    // Auto-refresh every 5 seconds
    const interval = setInterval(loadUserView, 5000);
    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------------
  // Handle "Take Token" click
  // ------------------------------------------------------------------
  const handleTakeToken = async () => {
    if (myToken) {
      alert(`You already have Token #${myToken.tokenNumber}`);
      return;
    }

    try {
      setTakingToken(true);
      const res = await API.post("/queue/token");
      const token = res.data;
      setMyToken(token);
      alert(`Your token is #${token.tokenNumber}`);
      // refresh queue info as well
      loadUserView();
    } catch (err) {
      console.error(err);
      alert("Failed to take token");
    } finally {
      setTakingToken(false);
    }
  };

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Title + Button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            User Dashboard
          </h1>

          <button
            onClick={handleTakeToken}
            disabled={takingToken || !!myToken}
            className={`px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all
              ${
                myToken
                  ? "bg-purple-900/50 text-purple-300 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500 active:scale-95"
              }`}
          >
            {myToken ? "Token Already Taken" : "Take Token"}
          </button>
        </div>

        {/* Now Serving + Your Token */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-yellow-400/40 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-yellow-300 mb-2">
              Now Serving
            </h2>
            {loading ? (
              <p className="text-sm text-gray-300">Loading...</p>
            ) : nowServing ? (
              <p className="text-2xl font-bold">
                Token #{nowServing.tokenNumber}
              </p>
            ) : (
              <p className="text-sm text-gray-300">No active token</p>
            )}
          </div>

          <div className="bg-white/5 border border-emerald-400/40 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-emerald-300 mb-2">
              Your Token
            </h2>
            {loading ? (
              <p className="text-sm text-gray-300">Loading...</p>
            ) : myToken ? (
              <>
                <p className="text-2xl font-bold mb-1">
                  Token #{myToken.tokenNumber}
                </p>
                <p className="text-sm text-gray-200">
                  People ahead of you in queue:{" "}
                  <span className="font-semibold">{aheadCount}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-300">
                You don't have a token yet. Click{" "}
                <span className="font-semibold">Take Token</span> to get one.
              </p>
            )}
          </div>
        </section>

        {/* Pending Queue List */}
        <section className="bg-white/5 border border-sky-500/30 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-sky-300 mb-3">
            Pending Queue
          </h2>

          {loading ? (
            <p className="text-sm text-gray-300">Loading...</p>
          ) : pendingTokens.length === 0 ? (
            <p className="text-sm text-gray-300">No pending tokens</p>
          ) : (
            <div className="space-y-2">
              {pendingTokens.map((t) => (
                <div
                  key={t._id}
                  className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-between
                    ${
                      myToken && myToken.tokenNumber === t.tokenNumber
                        ? "bg-purple-600/40 border-purple-400"
                        : "bg-slate-900/60 border-sky-500/30"
                    }`}
                >
                  <span>Token #{t.tokenNumber}</span>
                  {myToken &&
                    myToken.tokenNumber === t.tokenNumber && (
                      <span className="text-xs text-purple-100 font-semibold">
                        This is you
                      </span>
                    )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
