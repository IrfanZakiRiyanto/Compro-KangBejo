import SectionHeader from "./SectionHeader"
import { getMediaUrl } from "../services/api"

function AboutSection({ content = {}, facilityCount, activityCount }) {
  // Parsing tags dari string comma-separated
  const tagsList = content.tags ? content.tags.split(",").map(t => t.trim()) : ["Wisata Alam", "Edukasi", "Budaya", "Pertanian"]
  
  // Gambar fallback jika tidak di-set di admin
  const imageUrl = content.media_id ? getMediaUrl(content.media_id) : "https://images.unsplash.com/photo-1595841696250-20c254b1f486?auto=format&fit=crop&q=80&w=800"

  return (
    <section id="tentang" className="section">
      <div className="container">
        
        <SectionHeader 
          chip={content.chip || "Tentang Kami"}
          title={content.name || "Desa Wisata Kang Bejo"} 
          subtitle={content.tagline || "Desa Wisata Edukasi Penghasil Kangkung di Balikpapan"}
        />

        <div className="about-grid">
          
          {/* Bagian Kiri: Teks */}
          <div className="about-text-content">
            <p className="about-description">
              {content.description || "Desa Wisata Kang Bejo adalah destinasi wisata edukasi unggulan di Balikpapan yang menghadirkan pengalaman belajar dan berwisata di tengah kebun kangkung. Pengunjung dapat menikmati berbagai fasilitas dan kegiatan seru yang memadukan alam, budaya, dan edukasi pertanian."}
            </p>
            
            <div className="about-tags">
              {tagsList.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">📍</div>
                <div>
                  <h4>Lokasi Strategis</h4>
                  <p>{content.location || "Balikpapan, Kalimantan Timur"}</p>
                </div>
              </div>
              <div className="highlight-item">
                <div className="highlight-icon">🏆</div>
                <div>
                  <h4>Berdiri Sejak</h4>
                  <p>{content.founded_year || "2025"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Gambar & Stats Mini */}
          <div className="about-image-wrapper">
            <div className="about-image-decoration"></div>
            <img 
              src={imageUrl} 
              alt="Pemandangan Desa Wisata Kang Bejo" 
              className="about-image"
              loading="lazy"
            />
            
            <div className="about-floating-card">
              <div className="floating-stat">
                <span className="stat-value">{facilityCount || '...'}</span>
                <span className="stat-label">Fasilitas</span>
              </div>
              <div className="floating-divider"></div>
              <div className="floating-stat">
                <span className="stat-value">{activityCount || '...'}</span>
                <span className="stat-label">Kegiatan</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutSection
