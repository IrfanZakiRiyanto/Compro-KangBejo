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
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <h1>Kang Bejo Admin</h1>
          <p>Login untuk mengelola konten website</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="ad-form-group">
            <label className="ad-label">Username</label>
            <input
              type="text"
              className="ad-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="ad-form-group" style={{ marginBottom: 32 }}>
            <label className="ad-label">Password</label>
            <input
              type="password"
              className="ad-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="ad-btn ad-btn-primary" disabled={loading}>
            {loading ? "Memproses..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
