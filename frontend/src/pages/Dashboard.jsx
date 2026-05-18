import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://perfai-backend-r3vt.onrender.com";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${API}/api/employees`, { headers });
        setEmployees(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const avg = (arr) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;

  const avgScore = avg(employees.map((e) => e.performanceScore));
  const topPerformers = employees.filter((e) => e.performanceScore >= 85).length;
  const needsImprovement = employees.filter((e) => e.performanceScore < 50).length;

  const departments = [...new Set(employees.map((e) => e.department))];
  const deptStats = departments.map((dept) => {
    const deptEmployees = employees.filter((e) => e.department === dept);
    return {
      dept,
      count: deptEmployees.length,
      avgScore: avg(deptEmployees.map((e) => e.performanceScore)),
    };
  });

  const getRatingClass = (score) => {
    if (score >= 85) return "badge-excellent";
    if (score >= 70) return "badge-good";
    if (score >= 50) return "badge-average";
    return "badge-poor";
  };

  const getRatingLabel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Average";
    return "Needs Improvement";
  };

  const stats = [
    { label: "Total Employees", value: employees.length, icon: "👥", color: "var(--primary)", sub: "in database" },
    { label: "Avg Performance", value: `${avgScore}%`, icon: "📊", color: "var(--info)", sub: "across all staff" },
    { label: "Top Performers", value: topPerformers, icon: "🏆", color: "var(--accent)", sub: "score 85+" },
    { label: "Need Support", value: needsImprovement, icon: "⚠️", color: "var(--danger)", sub: "score below 50" },
  ];

  return (
    <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "6px" }}>
          Welcome back, {user.name?.split(" ")[0] || "HR"} 👋
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Here's your employee performance overview
        </p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="loading"><div className="spinner" /> Loading analytics...</div>
      ) : (
        <>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px", marginBottom: "32px",
          }}>
            {stats.map((stat) => (
              <div key={stat.label} className="card" style={{ padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "10px" }}>
                      {stat.label}
                    </p>
                    <p style={{ fontSize: "2.1rem", fontWeight: 800, fontFamily: "var(--font-display)", color: stat.color, lineHeight: 1 }}>
                      {stat.value}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "6px" }}>
                      {stat.sub}
                    </p>
                  </div>
                  <span style={{ fontSize: "1.6rem" }}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>

            {/* Department Breakdown */}
            <div className="card">
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px" }}>
                Department Breakdown
              </h3>
              {deptStats.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>No departments yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {deptStats.map((d) => (
                    <div key={d.dept}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>{d.dept}</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          {d.count} emp · avg {d.avgScore}%
                        </span>
                      </div>
                      <div style={{ height: "6px", background: "var(--surface2)", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: "999px",
                          width: `${d.avgScore}%`,
                          background: `linear-gradient(90deg, var(--primary), var(--accent))`,
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px" }}>
                Quick Actions
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "➕  Add New Employee", path: "/add-employee", color: "var(--primary)" },
                  { label: "👥  View All Employees", path: "/employees", color: "var(--info)" },
                  { label: "🤖  Run AI Analysis", path: "/ai-recommendations", color: "var(--accent)" },
                ].map((action) => (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    style={{
                      background: "var(--surface2)",
                      border: "1.5px solid var(--border)",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      textAlign: "left",
                      color: action.color,
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "var(--transition)",
                      width: "100%",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = action.color}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Employees Table */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Recent Employees</h3>
              <button className="btn-secondary" onClick={() => navigate("/employees")} style={{ width: "auto", fontSize: "0.83rem" }}>
                View All →
              </button>
            </div>

            {employees.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>👥</div>
                <p>No employees yet. Add your first employee to get started.</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px" }}>
                <thead>
                  <tr>
                    {["Name", "Department", "Skills", "Score", "Rating"].map((h) => (
                      <th key={h} style={{
                        textAlign: "left", padding: "8px 16px",
                        color: "var(--text-muted)", fontSize: "0.76rem",
                        textTransform: "uppercase", letterSpacing: "0.7px",
                        fontFamily: "var(--font-display)",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 5).map((e) => (
                    <tr key={e._id}>
                      <td style={{ padding: "12px 16px", background: "var(--surface2)", borderRadius: "8px 0 0 8px" }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{e.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{e.email}</div>
                      </td>
                      <td style={{ padding: "12px 16px", background: "var(--surface2)" }}>
                        <span style={{ fontSize: "0.88rem" }}>{e.department}</span>
                      </td>
                      <td style={{ padding: "12px 16px", background: "var(--surface2)" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                          {e.skills.slice(0, 2).map((s) => (
                            <span key={s} className="badge badge-skill" style={{ fontSize: "0.72rem" }}>{s}</span>
                          ))}
                          {e.skills.length > 2 && (
                            <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>+{e.skills.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", background: "var(--surface2)" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--primary)" }}>
                          {e.performanceScore}%
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", background: "var(--surface2)", borderRadius: "0 8px 8px 0" }}>
                        <span className={`badge ${getRatingClass(e.performanceScore)}`}>
                          {getRatingLabel(e.performanceScore)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}