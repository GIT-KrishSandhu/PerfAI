import { useState } from "react";
import axios from "axios";

const API = "https://perfai-backend-r3vt.onrender.com";

export default function AddEmployee() {
  const [form, setForm] = useState({
    name: "", email: "", department: "",
    skills: "", performanceScore: "", experience: "", 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);

    const skillsArray = form.skills
      .split(",").map((s) => s.trim()).filter(Boolean);

    if (skillsArray.length === 0) {
      setError("Please enter at least one skill");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${API}/api/employees`,
        {
          ...form,
          skills: skillsArray,
          performanceScore: Number(form.performanceScore),
          experience: Number(form.experience),
        },
        { headers }
      );
      setSuccess(`✅ ${form.name} has been added successfully!`);
      setForm({ name: "", email: "", department: "", skills: "", performanceScore: "", experience: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const departments = ["Development", "HR", "Marketing", "Sales", "Finance", "Operations", "Design", "DevOps"];
  const quickSkills = ["React", "Node.js", "Python", "MongoDB", "AWS", "Docker", "TypeScript", "Machine Learning", "Excel", "Communication"];

  const addSkill = (skill) => {
    const arr = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
    if (!arr.includes(skill)) {
      setForm({ ...form, skills: [...arr, skill].join(", ") });
    }
  };

  const scoreColor = () => {
    const s = Number(form.performanceScore);
    if (s >= 85) return "var(--primary)";
    if (s >= 70) return "var(--info)";
    if (s >= 50) return "var(--warning)";
    return "var(--danger)";
  };

  const scoreLabel = () => {
    const s = Number(form.performanceScore);
    if (s >= 85) return "Excellent";
    if (s >= 70) return "Good";
    if (s >= 50) return "Average";
    if (s > 0) return "Needs Improvement";
    return "";
  };

  return (
    <div style={{ padding: "40px 48px", maxWidth: "900px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "6px" }}>
          Add Employee
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Add a new employee to the performance tracking system
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "20px", alignItems: "start" }}>

        {/* Main Form */}
        <div className="card">
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Name + Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "7px" }}>
                  Full Name *
                </label>
                <input name="name" placeholder="Aman Verma" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "7px" }}>
                  Email Address *
                </label>
                <input name="email" type="email" placeholder="aman@company.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            {/* Department */}
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "7px" }}>
                Department *
              </label>
              <select name="department" value={form.department} onChange={handleChange} required>
                <option value="">Select department...</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "7px" }}>
                Skills * <span style={{ fontWeight: 400 }}>(comma separated)</span>
              </label>
              <input
                name="skills"
                placeholder="React, Node.js, MongoDB"
                value={form.skills}
                onChange={handleChange}
                required
              />
              {form.skills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                  {form.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
                    <span key={skill} className="badge badge-skill">{skill}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Score + Experience */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "7px" }}>
                  Performance Score * <span style={{ fontWeight: 400 }}>(0–100)</span>
                </label>
                <input
                  name="performanceScore"
                  type="number" min="0" max="100"
                  placeholder="85"
                  value={form.performanceScore}
                  onChange={handleChange}
                  required
                />
                {form.performanceScore && (
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, height: "5px", background: "var(--surface2)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: "999px",
                        width: `${Math.min(form.performanceScore, 100)}%`,
                        background: scoreColor(),
                        transition: "width 0.3s ease",
                      }} />
                    </div>
                    <span style={{ fontSize: "0.78rem", color: scoreColor(), fontWeight: 600, fontFamily: "var(--font-display)", whiteSpace: "nowrap" }}>
                      {scoreLabel()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "block", marginBottom: "7px" }}>
                  Years of Experience *
                </label>
                <input
                  name="experience"
                  type="number" min="0" max="50"
                  placeholder="3"
                  value={form.experience}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: "4px" }}>
              {loading ? "Adding Employee..." : "Add Employee →"}
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Quick Add Skills */}
          <div className="card">
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "12px" }}>
              Quick Add Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {quickSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  style={{
                    background: "rgba(74,222,128,0.05)",
                    color: "var(--text-muted)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "8px",
                    padding: "5px 11px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseOver={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.color = "var(--primary)"; }}
                  onMouseOut={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-muted)"; }}
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Score Guide */}
          <div className="card">
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "12px" }}>
              Score Guide
            </h3>
            {[
              { range: "85 – 100", label: "Excellent", cls: "badge-excellent" },
              { range: "70 – 84", label: "Good", cls: "badge-good" },
              { range: "50 – 69", label: "Average", cls: "badge-average" },
              { range: "0 – 49", label: "Needs Improvement", cls: "badge-poor" },
            ].map((item) => (
              <div key={item.range} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.83rem" }}>{item.range}</span>
                <span className={`badge ${item.cls}`}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="card" style={{ background: "rgba(74,222,128,0.03)", border: "1.5px solid rgba(74,222,128,0.15)" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "10px", color: "var(--primary)" }}>
              💡 Tips
            </h3>
            <ul style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.8, paddingLeft: "14px" }}>
              <li>Use exact skill names for better AI analysis</li>
              <li>Performance score affects AI recommendations</li>
              <li>Add bio details to improve AI feedback quality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}