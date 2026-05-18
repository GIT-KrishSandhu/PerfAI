import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/employees", label: "Employees" },
    { path: "/add-employee", label: "Add Employee" },
    { path: "/ai-recommendations", label: "AI Insights" },
  ];

  return (
    <nav style={{
      background: "rgba(15,20,15,0.9)",
      backdropFilter: "blur(16px)",
      borderBottom: "1.5px solid var(--border)",
      padding: "0 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "64px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.25rem",
        fontWeight: 800,
        letterSpacing: "-0.5px",
      }}>
        Perf<span style={{ color: "var(--primary)" }}>AI</span>
      </span>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "4px" }}>
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              background: location.pathname === link.path
                ? "rgba(74,222,128,0.1)" : "transparent",
              color: location.pathname === link.path
                ? "var(--primary)" : "var(--text-muted)",
              border: location.pathname === link.path
                ? "1.5px solid rgba(74,222,128,0.25)" : "1.5px solid transparent",
              padding: "7px 16px",
              borderRadius: "8px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.88rem",
              cursor: "pointer",
              transition: "var(--transition)",
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "0.85rem", color: "#080c08",
        }}>
          {user.name ? user.name[0].toUpperCase() : "H"}
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          {user.name || "HR Admin"}
        </span>
        <button className="btn-danger" onClick={logout} style={{ width: "auto" }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;