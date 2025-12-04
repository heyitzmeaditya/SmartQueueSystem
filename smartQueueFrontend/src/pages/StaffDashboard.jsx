import API from "../api/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function StaffDashboard() {
const callNext = async () => {
  try {
    const res = await API.post("/queue/next");
    alert("Now Serving Token: " + res.data.tokenNumber);
  } catch (err) {
    alert("Call failed");
  }
};







  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-indigo-900 flex flex-col justify-center items-center text-white">
      <h2 className="text-4xl font-bold mb-8">Staff Control Panel</h2>

      <button
        onClick={callNext}
        className="bg-green-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition cursor-pointer"
      >
        Call Next Token
      </button>
    </div>
  );
}
