/**
 * AboutSection — Section tentang Desa Wisata Kang Bejo
 * Props:
 *   about (object | null) — data dari GET /about
 */
function AboutSection({ about }) {
  if (!about) return null

  const tags = [
    { icon: "🌿", label: "Wisata Alam" },
    { icon: "📚", label: "Edukasi" },
    { icon: "🎭", label: "Budaya" },
    { icon: "🌾", label: "Pertanian" },
  ]

  return (
    <section id="tentang" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-chip">Tentang Kami</span>
          <h2 className="section-title">{about.name}</h2>
          <p className="section-sub">{about.tagline}</p>
        </div>

        <div className="about-grid">
          {/* Kartu Lokasi */}
          <div className="about-card glass-card">
            <div className="about-icon">📍</div>
            <h3>Lokasi</h3>
            <p>{about.location}</p>
          </div>

          {/* Deskripsi + Tags */}
          <div className="about-main glass-card">
            <p className="about-desc">{about.description}</p>
            <div className="about-tags">
              {tags.map(tag => (
                <span key={tag.label} className="tag">
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
