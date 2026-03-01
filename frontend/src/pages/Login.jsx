import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/Auth/InputField";
import LoginCard from "../components/Auth/LoginCard";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (login(username, password)) {
      navigate("/dashboard", { replace: true });
    } else {
      setError("The username or password you entered is incorrect.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#080a14] to-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* ambient glows */}
      <div className="absolute top-[20%] left-[15%] w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[18%] w-[380px] h-[380px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <LoginCard title="Hospital Admin Login" subtitle="Secure access to analytics dashboard">
        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            name="username"
          />

          <InputField
            label="Password"
            icon={Lock}
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            name="password"
            showPasswordToggle
            showValue={showPw}
            onToggle={() => setShowPw((v) => !v)}
          />

          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/15 rounded-lg px-3.5 py-2.5 mb-4">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </LoginCard>
    </div>
  );
}
