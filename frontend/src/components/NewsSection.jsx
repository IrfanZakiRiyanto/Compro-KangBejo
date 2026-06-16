import { useState, useEffect } from "react"
import SectionHeader from "./SectionHeader"
import { getMediaUrl } from "../services/api"

function NewsSection({ news = [], content = {} }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Bagi berita menjadi kelompok berisi maksimal 3 berita per slide
  const itemsPerSlide = 3
  const chunkArray = (arr, size) => {
    if (!arr) return []
    const chunks = []
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size))
    }
    return chunks
  }
  const newsSlides = chunkArray(news, itemsPerSlide)

  // Auto-play rotasi slide berita jika slide lebih dari 1
  useEffect(() => {
    if (newsSlides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newsSlides.length)
    }, 6000) // Geser tiap 6 detik
    return () => clearInterval(interval)
  }, [newsSlides.length])

  if (!news || news.length === 0) return null

  return (
    <section id="berita" className="section">
      <div className="container">
        <SectionHeader 
          chip={content.chip || "Berita"}
          title={content.title || "Kabar Terbaru dari Kang Bejo"} 
          subtitle={content.subtitle || "Ikuti terus perkembangan dan acara menarik di desa wisata kami."}
        />

        {/* Container Utama Slider */}
        <div className="news-slider-container">
          <div 
            className="news-slider-track"
            style={{ 
              transform: `translate3d(-${currentSlide * 100}%, 0, 0)` 
            }}
          >
            {newsSlides.map((slideItems, slideIdx) => (
              <div key={slideIdx} className="news-slide">
                <div className="news-slide-grid">
                  {slideItems.map((item) => (
                    <div key={item.id} className="news-card">
                      <img 
                        src={item.media_id ? getMediaUrl(item.media_id) : "https://images.unsplash.com/photo-1595841696250-20c254b1f486?auto=format&fit=crop&q=80&w=400"} 
                        alt={item.title} 
                        className="news-img"
                        loading="lazy"
                      />
                      <div className="news-body">
                        <div className="news-date">{item.date}</div>
                        <h3 className="news-title">{item.title}</h3>
                        <p className="news-desc">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigasi Dot Bulat */}
        {newsSlides.length > 1 && (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            gap: 8, 
            marginTop: 20 
          }}>
            {newsSlides.map((_, idx) => {
              const isActive = idx === currentSlide
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: isActive ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: isActive ? "#1B4332" : "#CED4DA",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0
                  }}
                  title={`Menuju slide ke-${idx + 1}`}
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default NewsSection
