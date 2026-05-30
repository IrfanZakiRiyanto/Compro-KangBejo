import { useState, useEffect } from "react"
import { getDashboardStats } from "../services/adminApi"
import { Link } from "react-router-dom"

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Memuat dashboard...</div>

  return (
    <div>
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Dashboard Overview</h1>
          <p className="ad-page-subtitle">Ringkasan konten website Desa Wisata Kang Bejo</p>
        </div>
      </div>

      <div className="ad-stats-grid">
        <div className="ad-stat-card">
          <div className="ad-stat-icon">🏖️</div>
          <div className="ad-stat-info">
            <h3>{stats?.facilities?.total || 0}</h3>
            <p>Fasilitas</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">🎯</div>
          <div className="ad-stat-info">
            <h3>{stats?.activities?.total || 0}</h3>
            <p>Kegiatan</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">📰</div>
          <div className="ad-stat-info">
            <h3>{stats?.news?.total || 0}</h3>
            <p>Berita</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">⭐</div>
          <div className="ad-stat-info">
            <h3>{stats?.hero_slides?.total || 0}</h3>
            <p>Hero Slides</p>
          </div>
        </div>
        <div className="ad-stat-card">
          <div className="ad-stat-icon">📁</div>
          <div className="ad-stat-info">
            <h3>{stats?.media?.total || 0}</h3>
            <p>Media Library</p>
          </div>
        </div>
      </div>

      <div className="ad-card" style={{ maxWidth: 600 }}>
        <div className="ad-card-header">
          <h2 className="ad-card-title">Akses Cepat</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link to="/admin/hero" className="ad-btn ad-btn-primary">📝 Edit Hero Text</Link>
          <Link to="/admin/about" className="ad-btn ad-btn-primary">ℹ️ Edit Tentang Kami</Link>
          <Link to="/admin/contact" className="ad-btn ad-btn-primary">📞 Edit Kontak</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
