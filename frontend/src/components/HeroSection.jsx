/**
 * HeroSection — Section pertama website Kang Bejo
 * Props:
 *   facilityCount (number) — jumlah fasilitas dari API
 *   activityCount (number) — jumlah kegiatan dari API
 *   loading (bool)         — sedang fetch?
 *   onExplore (fn)         — callback tombol "Jelajahi Sekarang"
 *   onActivities (fn)      — callback tombol "Lihat Kegiatan"
 */
function HeroSection({ facilityCount, activityCount, loading, onExplore, onActivities }) {
  return (
    <section id="beranda" className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        {/* Chip */}
        <div className="hero-chip">🌿 Desa Wisata Edukasi</div>

        {/* Judul */}
        <h1 className="hero-title">
          Desa Wisata<br />
          <span className="highlight">Kang Bejo</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Penghasil Kangkung Terbaik di Balikpapan —<br />
          Wisata Alam, Edukasi &amp; Budaya dalam Satu Destinasi
        </p>

        {/* CTA Buttons */}
        <div className="hero-actions">
          <button
            id="btn-jelajahi"
            className="btn btn-primary"
            onClick={onExplore}
          >
            Jelajahi Sekarang
          </button>
          <button
            id="btn-kegiatan"
            className="btn btn-outline"
            onClick={onActivities}
          >
            Lihat Kegiatan
          </button>
        </div>

        {/* Stats Bar */}
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">
              {loading ? "…" : facilityCount}
            </span>
            <span className="stat-label">Fasilitas</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-num">
              {loading ? "…" : activityCount}
            </span>
            <span className="stat-label">Kegiatan</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <span className="stat-num">📍</span>
            <span className="stat-label">Balikpapan</span>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="hero-scroll-hint">
        <span>Scroll ke bawah</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  )
}

export default HeroSection
