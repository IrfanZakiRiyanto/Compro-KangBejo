import { ABOUT_IMAGE } from "../data/images"

function AboutSection({ about, facilityCount, activityCount }) {
  if (!about) return null
  return (
    <section id="tentang" className="section-alt">
      <div className="container">
        <div className="section-header">
          <span className="section-chip">Tentang Kami</span>
          <h2 className="section-title">{about.name}</h2>
          <p className="section-sub">{about.tagline}</p>
        </div>

        <div className="about-grid">
          {/* Gambar kiri */}
          <div className="about-img-wrap">
            <img
              src={ABOUT_IMAGE}
              alt="Desa Wisata Kang Bejo"
              className="about-img"
              loading="lazy"
            />
          </div>

          {/* Teks kanan */}
          <div className="about-text">
            <div className="about-location">Lokasi: {about.location}</div>
            <p className="about-desc">{about.description}</p>
            <div className="about-tags">
              {["Wisata Alam","Edukasi","Budaya","Pertanian"].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <div className="about-stat-num">{facilityCount ?? "–"}</div>
                <div className="about-stat-label">Fasilitas</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">{activityCount ?? "–"}</div>
                <div className="about-stat-label">Kegiatan</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-num">2025</div>
                <div className="about-stat-label">Berdiri</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default AboutSection
