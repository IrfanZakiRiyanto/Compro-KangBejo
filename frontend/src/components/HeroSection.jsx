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
    : { background: "linear-gradient(135deg, #1B4332 0%, #0D2418 100%)" }

  return (
    <section id="beranda" className="hero">
      <div className="hero-bg" style={bgStyle}></div>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
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


      
      <div className="hero-scroll-hint">
        <span>Scroll ke bawah</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  )
}

export default HeroSection
