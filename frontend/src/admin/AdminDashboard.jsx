import { useState, useEffect } from "react"
import { getDashboardStats } from "../services/adminApi"
import { Link } from "react-router-dom"

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    {
      label: "Hero Slides",
      total: stats?.hero_slides?.total ?? 0,
      active: stats?.hero_slides?.active ?? 0,
      link: "/admin/hero",
      linkLabel: "Kelola Slides",
      desc: "Gambar latar belakang berputar",
    },
    {
      label: "Fasilitas",
      total: stats?.facilities?.total ?? 0,
      active: stats?.facilities?.active ?? 0,
      link: "/admin/facilities",
      linkLabel: "Kelola Fasilitas",
      desc: "Daftar fasilitas wisata",
    },
    {
      label: "Kegiatan",
      total: stats?.activities?.total ?? 0,
      active: stats?.activities?.active ?? 0,
      link: "/admin/activities",
      linkLabel: "Kelola Kegiatan",
      desc: "Program dan kegiatan desa",
    },
    {
      label: "Berita",
      total: stats?.news?.total ?? 0,
      active: stats?.news?.active ?? 0,
      link: "/admin/news",
      linkLabel: "Kelola Berita",
      desc: "Artikel dan informasi terbaru",
    },
    {
      label: "Media Library",
      total: stats?.media?.total ?? 0,
      active: null,
      link: "/admin/media",
      linkLabel: "Kelola Media",
      desc: "Gambar yang diunggah",
    },
  ]

  const quickLinks = [
    { label: "Hero & Teks Sambutan", to: "/admin/hero" },
    { label: "Profil Tentang Kami", to: "/admin/about" },
    { label: "Kontak & Sosial Media", to: "/admin/contact" },
  ]

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Dashboard Overview</h1>
          <p className="adm-page-subtitle">Ringkasan konten website Desa Wisata Kang Bejo</p>
        </div>
      </div>

      {loading ? (
        <div className="adm-loading">Memuat statistik...</div>
      ) : (
        <div className="adm-dashboard-grid">
          {cards.map((card) => (
            <div key={card.label} className="adm-dash-card">
              <div className="adm-dash-card-top">
                <div className="adm-dash-num">{card.total}</div>
                {card.active !== null && (
                  <div className="adm-dash-badge">{card.active} aktif</div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".9rem", color: "var(--adm-text)", marginBottom: 2 }}>
                  {card.label}
                </div>
                <div className="adm-dash-label">{card.desc}</div>
              </div>
              <Link to={card.link}>{card.linkLabel} →</Link>
            </div>
          ))}
        </div>
      )}

      <div className="adm-card" style={{ maxWidth: 580 }}>
        <div className="adm-card-header">
          <h2 className="adm-card-title">Editor Konten Statis</h2>
        </div>
        <p style={{ fontSize: ".85rem", color: "var(--adm-text-muted)", marginBottom: 16 }}>
          Halaman berikut untuk mengedit teks dan informasi yang muncul di bagian tetap website.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {quickLinks.map(ql => (
            <Link key={ql.to} to={ql.to} className="adm-btn adm-btn-outline">
              {ql.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
