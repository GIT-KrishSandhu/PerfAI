import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState({ department: "", name: "", skill: "", minScore: "", maxScore: "" });
  const [editingId, setEditingId] = useState(null);
  const [editScore, setEditScore] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchEmployees = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const url = params.toString()
        ? `${API}/api/employees/search?${params.toString()}`
        : `${API}/api/employees`;
      const { data } = await axios.get(url, { headers });
      setEmployees(Array.isArray(data) ? data : data.employees || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleReset = () => {
    setSearch({ department: "", name: "", skill: "", minScore: "", maxScore: "" });
    fetchEmployees();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await axios.delete(`${API}/api/employees/${id}`, { headers });
      setSuccessMsg(`${name} deleted successfully`);
      fetchEmployees(search);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleUpdateScore = async (id) => {
    if (!editScore) return;
    try {
      await axios.put(`${API}/api/employees/${id}`, { performanceScore: Number(editScore) }, { headers });
      setSuccessMsg("Performance score updated successfully");
      setEditingId(null);
      setEditScore("");
      fetchEmployees(search);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

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

  const departments = ["Development", "HR", "Marketing", "Sales", "Finance", "Operations", "Design", "DevOps"];

  return (
    <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "6px" }}>
          Employee List
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Search, filter, update and manage all employees
        </p>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Search & Filter
        </h3>
        <form onSubmit={handleSearch}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Name</label>
              <input
                placeholder="Search name..."
                value={search.name}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Department</label>
              <select
                value={search.department}
                onChange={(e) => setSearch({ ...search, department: e.target.value })}
              >
                <option value="">All departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Skill</label>
              <input
                placeholder="e.g. React"
                value={search.skill}
                onChange={(e) => setSearch({ ...search, skill: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Min Score</label>
              <input
                type="number" min="0" max="100"
                placeholder="0"
                value={search.minScore}
                onChange={(e) => setSearch({ ...search, minScore: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Max Score</label>
              <input
                type="number" min="0" max="100"
                placeholder="100"
                value={search.maxScore}
                onChange={(e) => setSearch({ ...search, maxScore: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-primary" type="submit" style={{ width: "auto", padding: "10px 24px" }}>
              Search
            </button>
            <button className="btn-secondary" type="button" onClick={handleReset} style={{ width: "auto" }}>
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Messages */}
      {successMsg && <div className="success-msg">{successMsg}</div>}
      {error && <div className="error-msg">{error}</div>}

      {/* Results count */}
      {!loading && (
        <div style={{ marginBottom: "14px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Showing <span style={{ color: "var(--primary)", fontWeight: 600 }}>{employees.length}</span> employee{employees.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="loading"><div className="spinner" /> Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
          <p>No employees found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr>
                {["Employee", "Department", "Skills", "Experience", "Score", "Rating", "Actions"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "10px 16px",
                    color: "var(--text-muted)", fontSize: "0.75rem",
                    textTransform: "uppercase", letterSpacing: "0.7px",
                    fontFamily: "var(--font-display)", fontWeight: 600,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e._id}>
                  <td style={{ padding: "14px 16px", background: "var(--surface)", borderRadius: "10px 0 0 10px", border: "1.5px solid var(--border)", borderRight: "none" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{e.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{e.email}</div>
                  </td>
                  <td style={{ padding: "14px 16px", background: "var(--surface)", border: "1.5px solid var(--border)", borderLeft: "none", borderRight: "none" }}>
                    <span style={{ fontSize: "0.88rem" }}>{e.department}</span>
                  </td>
                  <td style={{ padding: "14px 16px", background: "var(--surface)", border: "1.5px solid var(--border)", borderLeft: "none", borderRight: "none" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {e.skills.slice(0, 2).map((s) => (
                        <span key={s} className="badge badge-skill" style={{ fontSize: "0.72rem" }}>{s}</span>
                      ))}
                      {e.skills.length > 2 && (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", alignSelf: "center" }}>
                          +{e.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", background: "var(--surface)", border: "1.5px solid var(--border)", borderLeft: "none", borderRight: "none" }}>
                    <span style={{ fontSize: "0.88rem" }}>{e.experience} yr{e.experience !== 1 ? "s" : ""}</span>
                  </td>

                  {/* Editable Score */}
                  <td style={{ padding: "14px 16px", background: "var(--surface)", border: "1.5px solid var(--border)", borderLeft: "none", borderRight: "none" }}>
                    {editingId === e._id ? (
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <input
                          type="number" min="0" max="100"
                          value={editScore}
                          onChange={(ev) => setEditScore(ev.target.value)}
                          style={{ width: "64px", padding: "5px 8px", fontSize: "0.82rem" }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateScore(e._id)}
                          style={{ background: "var(--primary)", color: "#080c08", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
                        >✓</button>
                        <button
                          onClick={() => { setEditingId(null); setEditScore(""); }}
                          style={{ background: "var(--surface2)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "6px", padding: "5px 10px", fontSize: "0.78rem", cursor: "pointer" }}
                        >✕</button>
                      </div>
                    ) : (
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
                        onClick={() => { setEditingId(e._id); setEditScore(e.performanceScore); }}
                        title="Click to edit"
                      >
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--primary)", fontSize: "1rem" }}>
                          {e.performanceScore}%
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>✏️</span>
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "14px 16px", background: "var(--surface)", border: "1.5px solid var(--border)", borderLeft: "none", borderRight: "none" }}>
                    <span className={`badge ${getRatingClass(e.performanceScore)}`}>
                      {getRatingLabel(e.performanceScore)}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", background: "var(--surface)", borderRadius: "0 10px 10px 0", border: "1.5px solid var(--border)", borderLeft: "none" }}>
                    <button className="btn-danger" onClick={() => handleDelete(e._id, e.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}