import { useState, useEffect } from 'react'

function HeroSection({ facilityCount, activityCount, loading, onExplore, onActivities, slides = [], content = {} }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Ambil hanya slide yang aktif
  const activeSlides = slides.filter(s => s.is_active)
  const hasSlides = activeSlides.length > 0

  // Interval untuk merotasi gambar latar belakang
  useEffect(() => {
    if (!hasSlides) return
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [hasSlides, activeSlides.length])

  // Fallback pattern jika tidak ada gambar
  const bgStyle = hasSlides && activeSlides[currentImageIndex]?.imageUrl 
    ? { backgroundImage: `url(${activeSlides[currentImageIndex].imageUrl})` }
    : { background: "linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)" }

  return (
    <section id="beranda" className="hero-section" style={bgStyle}>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <div className="hero-chip animate-fade-up">
          {content.chip_text || "Desa Wisata Edukasi"}
        </div>
        
        <h1 className="hero-title animate-fade-up" style={{ animationDelay: '0.1s', whiteSpace: 'pre-line' }}>
          {content.title || "Selamat Datang di\nKang Bejo"}
        </h1>
        
        <p className="hero-subtitle animate-fade-up" style={{ animationDelay: '0.2s', whiteSpace: 'pre-line' }}>
          {content.subtitle || "Wisata Alam, Edukasi & Budaya di Balikpapan —\nNikmati Pengalaman Bertani Kangkung yang Tak Terlupakan"}
        </p>
        
        <div className="hero-buttons animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <button className="btn btn-primary btn-lg" onClick={onExplore}>
            {content.cta_primary || "Jelajahi Sekarang"}
          </button>
          <button className="btn btn-outline btn-lg" onClick={onActivities}>
            {content.cta_secondary || "Lihat Kegiatan"}
          </button>
        </div>

        {/* Indikator Gambar */}
        {hasSlides && activeSlides.length > 1 && (
          <div className="hero-indicators animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {activeSlides.map((_, index) => (
              <div 
                key={index} 
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Hero Stats */}
      <div className="hero-stats-container animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <div className="hero-stat-card">
          <div className="hero-stat-number">{loading ? '...' : facilityCount}</div>
          <div className="hero-stat-label">Fasilitas Tersedia</div>
        </div>
        <div className="hero-stat-card">
          <div className="hero-stat-number">{loading ? '...' : activityCount}</div>
          <div className="hero-stat-label">Kegiatan Seru</div>
        </div>
        <div className="hero-stat-card">
          <div className="hero-stat-number">100%</div>
          <div className="hero-stat-label">Edukasi Alam</div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
