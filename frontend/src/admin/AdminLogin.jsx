import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { login, isLoggedIn } from "../services/adminApi"

function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/admin/dashboard")
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(username, password)
      navigate("/admin/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1B4332 0%, #0D2418 60%, #1B4332 100%)",
      fontFamily: "'Poppins', 'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "44px 40px",
        width: "420px",
        maxWidth: "95%",
        boxShadow: "0 20px 60px rgba(0,0,0,.25)",
        border: "1px solid #EAE8E2",
      }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#1B4332",
            margin: "0 0 6px 0",
          }}>Kang Bejo Admin</h1>
          <p style={{ fontSize: ".85rem", color: "#64748B", margin: 0 }}>
            Login untuk mengelola konten website
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FEE2E2",
            color: "#DC2626",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: ".85rem",
            fontWeight: 600,
            marginBottom: "16px",
            textAlign: "center",
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block",
              fontSize: ".78rem",
              fontWeight: 700,
              color: "#1B4332",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: ".5px",
            }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1.5px solid #C5A055",
                borderRadius: "10px",
                fontSize: ".9rem",
                fontFamily: "inherit",
                color: "#07162C",
                background: "#FFFFFF",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#1B4332"}
              onBlur={e => e.target.style.borderColor = "#C5A055"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{
              display: "block",
              fontSize: ".78rem",
              fontWeight: 700,
              color: "#1B4332",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: ".5px",
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1.5px solid #C5A055",
                borderRadius: "10px",
                fontSize: ".9rem",
                fontFamily: "inherit",
                color: "#07162C",
                background: "#FFFFFF",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#1B4332"}
              onBlur={e => e.target.style.borderColor = "#C5A055"}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: loading ? "#718096" : "#1B4332",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontSize: ".95rem",
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: ".5px",
              transition: "background .2s",
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = "#0D2418" }}
            onMouseLeave={e => { if (!loading) e.target.style.background = "#1B4332" }}
          >
            {loading ? "Memproses..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
