import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = "https://perfai-backend-r3vt.onrender.com";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email, role: data.role }));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: "linear-gradient(145deg, #080c08 0%, #0d1a0d 50%, #080c08 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px", position: "relative", overflow: "hidden",
        borderRight: "1.5px solid var(--border)",
      }}>
        <div style={{
          position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)",
          top: "-150px", left: "-150px",
        }} />
        <div style={{
          position: "absolute", width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(163,230,53,0.08) 0%, transparent 70%)",
          bottom: "-80px", right: "-80px",
        }} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: "360px" }}>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: "3rem",
            fontWeight: 800, lineHeight: 1.05, marginBottom: "20px",
          }}>
            Welcome{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              back.
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.95rem" }}>
            Your employee performance dashboard is ready. Sign in to view analytics and AI insights.
          </p>

          <div style={{
            marginTop: "40px",
            background: "rgba(74,222,128,0.05)",
            border: "1.5px solid rgba(74,222,128,0.15)",
            borderRadius: "14px", padding: "24px",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🤖</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: "8px", fontSize: "1rem" }}>
              AI Recommendations Ready
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
              OpenRouter AI analyzes every employee's performance score, skills, and experience to generate promotion and training recommendations.
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{
        width: "460px", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "60px 44px",
      }}>
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "1.2rem",
              fontWeight: 800, marginBottom: "8px",
            }}>
              Perf<span style={{ color: "var(--primary)" }}>AI</span>
            </div>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 800, marginBottom: "6px" }}>
              Sign in
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Access your HR analytics dashboard
            </p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "7px" }}>
                Email Address
              </label>
              <input name="email" type="email" placeholder="jane@company.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "7px" }}>
                Password
              </label>
              <input name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: "4px" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "20px", color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}