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

  return (
    <section id="beranda" className="hero">
      {/* Background Slides dengan transisi smooth cross-fade */}
      {hasSlides ? (
        activeSlides.map((slide, idx) => {
          const isActive = idx === currentImageIndex
          return (
            <div
              key={slide.id}
              className="hero-bg"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                opacity: isActive ? 1 : 0,
                transition: "opacity 1.5s ease-in-out, transform 10s ease-out",
                zIndex: isActive ? 1 : 0,
                position: "absolute",
                inset: 0
              }}
            />
          )
        })
      ) : (
        <div 
          className="hero-bg" 
          style={{ 
            background: "linear-gradient(135deg, #1B4332 0%, #0D2418 100%)",
            opacity: 1,
            position: "absolute",
            inset: 0,
            zIndex: 1
          }} 
        />
      )}
      <div className="hero-overlay" style={{ zIndex: 2 }}></div>
      
      <div className="hero-content" style={{ zIndex: 3 }}>
        <div className="hero-chip">
          {content.chip_text || "Desa Wisata Edukasi"}
        </div>
        
        <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>
          <span className="highlight">{content.title?.split('\n')[0]}</span>
          {content.title?.includes('\n') && <br/>}
          {content.title?.split('\n').slice(1).join('\n')}
        </h1>
        
        <p className="hero-subtitle" style={{ whiteSpace: 'pre-line' }}>
          {content.subtitle || "Wisata Alam, Edukasi & Budaya di Balikpapan —\nNikmati Pengalaman Bertani Kangkung yang Tak Terlupakan"}
        </p>
        
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={onExplore}>
            {content.cta_primary || "Jelajahi Sekarang"}
          </button>
          <button className="btn btn-outline btn-lg" onClick={onActivities}>
            {content.cta_secondary || "Lihat Kegiatan"}
          </button>
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
