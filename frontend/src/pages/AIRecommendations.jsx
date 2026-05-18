import { useState } from "react";
import axios from "axios";

const API = "https://perfai-backend-r3vt.onrender.com";

export default function AIRecommendations() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleRun = async () => {
    setError("");
    setResults(null);
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/ai/recommend`, {}, { headers });
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || "AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const promotionClass = (val) => {
    if (val === "Yes") return "badge-yes";
    if (val === "No") return "badge-no";
    return "badge-maybe";
  };

  const ratingClass = (val) => {
    if (val === "Excellent") return "badge-excellent";
    if (val === "Good") return "badge-good";
    if (val === "Average") return "badge-average";
    return "badge-poor";
  };

  const rankColor = (rank) => {
    if (rank === 1) return "#fbbf24";
    if (rank === 2) return "#94a3b8";
    if (rank === 3) return "#c97d4e";
    return "var(--text-muted)";
  };

  return (
    <div style={{ padding: "40px 48px", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>AI Recommendations</h1>
              <span style={{
                background: "rgba(74,222,128,0.1)",
                border: "1.5px solid rgba(74,222,128,0.25)",
                borderRadius: "999px", padding: "3px 12px",
                fontSize: "0.75rem", fontWeight: 700,
                color: "var(--primary)", fontFamily: "var(--font-display)",
              }}>
                ✦ OpenRouter Powered
              </span>
            </div>
            <p style={{ color: "var(--text-muted)" }}>
              AI analyzes every employee's profile and generates promotion, training and feedback recommendations
            </p>
          </div>

          <button
            onClick={handleRun}
            disabled={loading}
            style={{
              background: loading
                ? "var(--surface2)"
                : "linear-gradient(135deg, var(--primary), var(--accent))",
              color: loading ? "var(--text-muted)" : "#080c08",
              border: "none", borderRadius: "10px",
              padding: "13px 28px",
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
              transition: "var(--transition)",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "AI Thinking..." : "✦ Run AI Analysis"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="error-msg">{error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "80px 40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div className="spinner" style={{ width: "48px", height: "48px", borderWidth: "3px" }} />
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: "10px" }}>
            AI is analyzing your team...
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Reading performance scores, skills, and experience to generate recommendations
          </p>
        </div>
      )}

      {/* Empty state */}
      {!results && !loading && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div className="card" style={{ textAlign: "center", padding: "60px 40px", gridColumn: "1 / -1" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🤖</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "10px" }}>
              Ready to Analyze
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto 24px" }}>
              Click "Run AI Analysis" to generate promotion recommendations, training suggestions, and performance feedback for all employees
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              {[
                { icon: "🏆", label: "Promotion Decisions" },
                { icon: "📚", label: "Training Plans" },
                { icon: "💬", label: "Performance Feedback" },
                { icon: "📊", label: "Employee Rankings" },
              ].map((f) => (
                <div key={f.label} style={{
                  background: "var(--surface2)", border: "1.5px solid var(--border)",
                  borderRadius: "10px", padding: "12px 18px",
                  fontSize: "0.85rem", color: "var(--text-muted)",
                }}>
                  {f.icon} {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Summary bar */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "14px", marginBottom: "28px",
          }}>
            {[
              { label: "Total Analyzed", value: results.totalEmployees, icon: "👥", color: "var(--text)" },
              { label: "Promotion Ready", value: results.recommendations.filter((r) => r.promotionRecommendation === "Yes").length, icon: "🚀", color: "var(--primary)" },
              { label: "Need Training", value: results.recommendations.filter((r) => r.overallRating === "Needs Improvement" || r.overallRating === "Average").length, icon: "📚", color: "var(--warning)" },
              { label: "Top Rated", value: results.recommendations.filter((r) => r.overallRating === "Excellent").length, icon: "🏆", color: "var(--accent)" },
            ].map((stat) => (
              <div key={stat.label} className="card" style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "8px" }}>
                      {stat.label}
                    </p>
                    <p style={{ fontSize: "1.9rem", fontWeight: 800, fontFamily: "var(--font-display)", color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                  <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Generated at */}
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "20px" }}>
            Generated at {new Date(results.generatedAt).toLocaleString()}
          </p>

          {/* Employee Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {results.recommendations.map((emp, i) => (
              <div key={i} className="card" style={{
                borderLeft: `3px solid ${emp.promotionRecommendation === "Yes"
                  ? "var(--primary)"
                  : emp.promotionRecommendation === "No"
                  ? "var(--danger)"
                  : "var(--warning)"}`,
              }}>
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {/* Rank badge */}
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "50%",
                      background: "var(--surface2)",
                      border: `2px solid ${rankColor(emp.rank)}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-display)", fontWeight: 800,
                      color: rankColor(emp.rank), fontSize: "0.9rem",
                      flexShrink: 0,
                    }}>
                      #{emp.rank}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "2px" }}>{emp.name}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.83rem" }}>
                        {emp.department} · {emp.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span className={`badge ${ratingClass(emp.overallRating)}`}>
                      {emp.overallRating}
                    </span>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      background: "var(--surface2)", border: "1.5px solid var(--border)",
                      borderRadius: "8px", padding: "6px 12px",
                    }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Promotion:</span>
                      <span className={`badge ${promotionClass(emp.promotionRecommendation)}`}>
                        {emp.promotionRecommendation}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: "var(--font-display)", fontWeight: 800,
                      fontSize: "1.4rem",
                      color: emp.performanceScore >= 85 ? "var(--primary)"
                        : emp.performanceScore >= 70 ? "var(--info)"
                        : emp.performanceScore >= 50 ? "var(--warning)"
                        : "var(--danger)",
                    }}>
                      {emp.performanceScore}%
                    </div>
                  </div>
                </div>

                {/* Score bar */}
                <div style={{ height: "5px", background: "var(--surface2)", borderRadius: "999px", marginBottom: "18px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "999px",
                    width: `${emp.performanceScore}%`,
                    background: emp.performanceScore >= 85 ? "var(--primary)"
                      : emp.performanceScore >= 70 ? "var(--info)"
                      : emp.performanceScore >= 50 ? "var(--warning)"
                      : "var(--danger)",
                    transition: "width 0.8s ease",
                  }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  {/* Promotion Reason */}
                  <div style={{
                    background: "rgba(74,222,128,0.04)",
                    border: "1.5px solid rgba(74,222,128,0.12)",
                    borderRadius: "10px", padding: "14px",
                  }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                      🚀 Promotion Analysis
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {emp.promotionReason}
                    </p>
                  </div>

                  {/* Performance Feedback */}
                  <div style={{
                    background: "rgba(96,165,250,0.04)",
                    border: "1.5px solid rgba(96,165,250,0.12)",
                    borderRadius: "10px", padding: "14px",
                  }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--info)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                      💬 Performance Feedback
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {emp.performanceFeedback}
                    </p>
                  </div>
                </div>

                {/* Training Suggestions */}
                {emp.trainingSuggestions?.length > 0 && (
                  <div style={{ marginTop: "14px" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--warning)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
                      📚 Training Suggestions
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {emp.trainingSuggestions.map((skill, j) => (
                        <span key={j} style={{
                          background: "rgba(251,191,36,0.08)",
                          border: "1.5px solid rgba(251,191,36,0.2)",
                          borderRadius: "8px", padding: "5px 12px",
                          fontSize: "0.82rem", color: "var(--warning)",
                          fontFamily: "var(--font-display)", fontWeight: 600,
                        }}>
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginRight: "4px" }}>Current Skills:</span>
                  {emp.skills?.map((s) => (
                    <span key={s} className="badge badge-skill">{s}</span>
                  ))}
                  <span style={{ marginLeft: "auto" }} className="badge badge-good">
                    {emp.experience} yrs exp
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}