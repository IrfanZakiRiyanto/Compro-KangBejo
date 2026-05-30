import { NavLink, useNavigate } from "react-router-dom"
import { clearToken } from "../../services/adminApi"

function AdminSidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    navigate("/admin/login")
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🍃</div>
        <span>Kang Bejo</span>
      </div>

      <div className="sidebar-label">Dashboard</div>
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-link-icon">📊</span>
          Overview
        </NavLink>
        <NavLink to="/admin/media" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-link-icon">📁</span>
          Media Library
        </NavLink>
      </nav>

      <div className="sidebar-label" style={{ marginTop: 24 }}>Sections Editor</div>
      <nav className="sidebar-nav">
        <NavLink to="/admin/hero" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-link-icon">⭐</span> Hero & Slides
        </NavLink>
        <NavLink to="/admin/about" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-link-icon">ℹ️</span> Tentang Kami
        </NavLink>
        <NavLink to="/admin/facilities" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-link-icon">🏖️</span> Fasilitas
        </NavLink>
        <NavLink to="/admin/activities" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-link-icon">🎯</span> Kegiatan
        </NavLink>
        <NavLink to="/admin/news" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-link-icon">📰</span> Berita
        </NavLink>
        <NavLink to="/admin/contact" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
          <span className="sidebar-link-icon">📞</span> Kontak & Footer
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-link" onClick={handleLogout}>
          <span className="sidebar-link-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
