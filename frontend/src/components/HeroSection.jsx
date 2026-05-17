import { HERO_IMAGE } from "../data/images"

function HeroSection({ facilityCount, activityCount, loading, onExplore, onActivities }) {
  return (
    <section id="beranda" className="hero">
      {/* Background image */}
      <div
        className="hero-bg"
        style={{ backgroundImage: `url("${HERO_IMAGE}")` }}
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-chip">🌿 Desa Wisata Edukasi</div>
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
            <span className="stat-num">📍</span>
            <span className="stat-label">Balikpapan</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <span>Scroll ke bawah</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  )
}
export default HeroSection
