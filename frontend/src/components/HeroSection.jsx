import { useState, useEffect } from "react"
import { HERO_IMAGES } from "../data/images"

function HeroSection({ facilityCount, activityCount, loading, onExplore, onActivities }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="beranda" className="hero">
      {/* Background images with transition */}
      {HERO_IMAGES.map((img, index) => (
        <div
          key={img}
          className={`hero-bg ${index === currentImageIndex ? "active" : ""}`}
          style={{
            backgroundImage: `url("${img}")`,
            opacity: index === currentImageIndex ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
      <div className="hero-overlay" style={{ zIndex: 2 }} />

      <div className="hero-content" style={{ zIndex: 3 }}>
        <div className="hero-chip">Desa Wisata Edukasi</div>
        <h1 className="hero-title">
          Selamat Datang di<br />
          <span className="highlight">Kang Bejo</span>
        </h1>
        <p className="hero-subtitle">
          Wisata Alam, Edukasi &amp; Budaya di Balikpapan —<br />
          Nikmati Pengalaman Bertani Kangkung yang Tak Terlupakan
        </p>
        <div className="hero-actions">
          <button id="btn-jelajahi" className="btn btn-primary" onClick={onExplore}>
            Jelajahi Sekarang
          </button>
          <button id="btn-kegiatan" className="btn btn-outline" onClick={onActivities}>
            Lihat Kegiatan
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">{loading ? "…" : facilityCount}</span>
            <span className="stat-label">Fasilitas</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">{loading ? "…" : activityCount}</span>
            <span className="stat-label">Kegiatan</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">Kota</span>
            <span className="stat-label">Balikpapan</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint" style={{ zIndex: 3 }}>
        <span>Scroll ke bawah</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  )
}
export default HeroSection
