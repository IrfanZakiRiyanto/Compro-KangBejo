import SectionHeader from "./SectionHeader"
import { getMediaUrl } from "../services/api"

function NewsSection({ news = [], content = {} }) {
  if (!news || news.length === 0) return null

  return (
    <section id="berita" className="section">
      <div className="container">
        <SectionHeader 
          chip={content.chip || "Berita"}
          title={content.title || "Kabar Terbaru dari Kang Bejo"} 
          subtitle={content.subtitle || "Ikuti terus perkembangan dan acara menarik di desa wisata kami."}
        />

        <div className="news-grid">
          {news.map((item) => (
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
    </section>
  )
}

export default NewsSection
