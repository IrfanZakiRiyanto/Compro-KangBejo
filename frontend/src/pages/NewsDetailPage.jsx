import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import PageFooter from "../components/PageFooter"
import { fetchSingleNews, fetchSiteContent, getMediaUrl, checkHealth } from "../services/api"

// Helper untuk format YYYY-MM-DD ke Indonesia (12 Agustus 2026)
function formatIndonesianDate(dateStr) {
  if (!dateStr) return "Baru saja"
  const reg = /^\d{4}-\d{2}-\d{2}$/
  if (!reg.test(dateStr)) return dateStr
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]
  const [year, month, day] = dateStr.split("-")
  const monthIdx = parseInt(month, 10) - 1
  return `${parseInt(day, 10)} ${months[monthIdx]} ${year}`
}

function NewsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState(null)
  const [siteContent, setSiteContent] = useState({})
  const [isConnected, setIsConnected] = useState(false)
  const [apiVersion, setApiVersion] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Scroll ke atas saat berpindah berita
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [connected, contentRes, newsRes] = await Promise.all([
          checkHealth(),
          fetchSiteContent().catch(() => ({ sections: {} })),
          fetchSingleNews(id)
        ])
        setIsConnected(connected)
        setSiteContent(contentRes.sections || {})
        setNews(newsRes)
      } catch (err) {
        console.error("Gagal memuat detail berita:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  // Ambil versi API
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:8000"
    fetch(`${base}/`).then(r => r.json()).then(d => setApiVersion(d.version)).catch(() => {})
  }, [])

  const handleNavClick = (sectionId) => {
    navigate(`/?section=${sectionId}`)
  }

  const sc = (section, key, fallback = "") => siteContent?.[section]?.[key] ?? fallback

  // Helper untuk merender isi berita dengan dukungan [gambar:ID]
  const renderNewsContent = (text) => {
    if (!text) return null
    const parts = text.split(/(\[gambar:\d+\])/g)
    return parts.map((part, idx) => {
      const match = part.match(/\[gambar:(\d+)\]/)
      if (match) {
        const mediaId = match[1]
        return (
          <div key={idx} className="news-detail-body-img-wrap" style={{ margin: "32px 0", textAlign: "center" }}>
            <img 
              src={getMediaUrl(mediaId)} 
              alt="Sisipan Berita" 
              style={{ 
                maxWidth: "100%", 
                maxHeight: 500, 
                borderRadius: 8, 
                boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                objectFit: "contain" 
              }} 
            />
          </div>
        )
      } else if (part.trim()) {
        return (
          <p key={idx} style={{ 
            fontSize: "1.15rem", 
            lineHeight: "1.8", 
            color: "#2D3748", 
            marginBottom: 20,
            whiteSpace: "pre-wrap",
            textAlign: "justify"
          }}>
            {part}
          </p>
        )
      }
      return null
    })
  }

  if (loading) {
    return (
      <div className="app">
        <Navbar
          activeSection="berita"
          onNavClick={handleNavClick}
          isConnected={isConnected}
          apiVersion={apiVersion}
          brandText={sc("navbar", "brand_text", "Kang Bejo")}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
          <div className="loading-spinner" />
          <span style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Memuat berita...</span>
        </div>
        <PageFooter apiVersion={apiVersion} content={siteContent.footer || {}} />
      </div>
    )
  }

  if (!news) {
    return (
      <div className="app">
        <Navbar
          activeSection="berita"
          onNavClick={handleNavClick}
          isConnected={isConnected}
          apiVersion={apiVersion}
          brandText={sc("navbar", "brand_text", "Kang Bejo")}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 20 }}>
          <h2 style={{ color: "var(--text-heading)" }}>Berita Tidak Ditemukan</h2>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Kembali ke Beranda</button>
        </div>
        <PageFooter apiVersion={apiVersion} content={siteContent.footer || {}} />
      </div>
    )
  }

  return (
    <div className="app" style={{ background: "#FCFCFA" }}>
      <Navbar
        activeSection="berita"
        onNavClick={handleNavClick}
        isConnected={isConnected}
        apiVersion={apiVersion}
        brandText={sc("navbar", "brand_text", "Kang Bejo")}
      />

      <div style={{ 
        maxWidth: 860, 
        margin: "0 auto", 
        padding: "120px 24px 60px",
        minHeight: "80vh"
      }}>
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate("/")} 
          style={{
            background: "none",
            border: "none",
            color: "var(--primary)",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
            fontSize: "1rem",
            padding: 0
          }}
        >
          ← Kembali ke Beranda
        </button>

        {/* Headline / Judul Berita */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "var(--primary-dark)",
          lineHeight: "1.3",
          textAlign: "center",
          marginBottom: 16
        }}>
          {news.title}
        </h1>

        {/* Meta Berita (Tanggal & Penulis) */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          fontSize: "0.95rem",
          color: "var(--text-muted)",
          marginBottom: 32,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 24
        }}>
          <span style={{ fontWeight: 600, color: "var(--primary)" }}>Admin</span>
          <span>•</span>
          <span>{formatIndonesianDate(news.date)}</span>
        </div>

        {/* Gambar Utama (Thumbnail) */}
        {news.media_id && (
          <div style={{ marginBottom: 40, textAlign: "center" }}>
            <img 
              src={getMediaUrl(news.media_id)} 
              alt={news.title} 
              style={{
                width: "100%",
                maxHeight: 500,
                objectFit: "cover",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }}
            />
          </div>
        )}

        {/* Isi Berita */}
        <div style={{ marginTop: 20 }}>
          {renderNewsContent(news.description)}
        </div>
      </div>

      <PageFooter
        apiVersion={apiVersion}
        content={siteContent.footer || {}}
      />
    </div>
  )
}

export default NewsDetailPage
