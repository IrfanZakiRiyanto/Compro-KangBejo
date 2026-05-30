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
          <div className="about-text">
            <p className="about-desc">
              {content.description || "Desa Wisata Kang Bejo adalah destinasi wisata edukasi unggulan di Balikpapan yang menghadirkan pengalaman belajar dan berwisata di tengah kebun kangkung. Pengunjung dapat menikmati berbagai fasilitas dan kegiatan seru yang memadukan alam, budaya, dan edukasi pertanian."}
            </p>
            
            <div className="about-tags">
              {tagsList.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            <div className="about-stats">
              <div className="about-stat">
                <div className="about-stat-num">📍</div>
                <div className="about-stat-label">{content.location || "Balikpapan, Kalimantan Timur"}</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">🏆</div>
                <div className="about-stat-label">Berdiri Sejak {content.founded_year || "2025"}</div>
              </div>
            </div>
          </div>

          {/* Bagian Kanan: Gambar & Stats Mini */}
          <div className="about-img-wrap">
            <img 
              src={imageUrl} 
              alt="Pemandangan Desa Wisata Kang Bejo" 
              className="about-img"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutSection
