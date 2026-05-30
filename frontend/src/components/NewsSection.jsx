function NewsSection() {
  const dummyNews = [
    {
      id: 1,
      title: "Panen Raya Kangkung Sukses Digelar",
      date: "12 Agustus 2026",
      desc: "Warga desa bersama wisatawan ikut serta dalam panen kangkung tahun ini dengan hasil yang melimpah.",
      img: "https://images.unsplash.com/photo-1595856461937-db56c0ac5833?auto=format&fit=crop&w=600&q=75"
    },
    {
      id: 2,
      title: "Penambahan Fasilitas Spot Foto Baru",
      date: "20 Juli 2026",
      desc: "Kini ada spot foto baru dengan pemandangan langsung ke kebun hijau yang memanjakan mata.",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=75"
    },
    {
      id: 3,
      title: "Kunjungan Sekolah Alam Balikpapan",
      date: "5 Juni 2026",
      desc: "Anak-anak belajar bertani dengan cara yang menyenangkan di area Edukasi Kang Bejo.",
      img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=75"
    }
  ]

  return (
    <section id="berita" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-chip">Berita</span>
          <h2 className="section-title">Kabar Terbaru</h2>
          <p className="section-sub">Ikuti terus perkembangan dan acara menarik di Desa Wisata Kang Bejo.</p>
        </div>
        <div className="cards-grid">
          {dummyNews.map(news => (
            <div key={news.id} className="news-card">
              <img src={news.img} alt={news.title} className="news-img" />
              <div className="news-body">
                <div className="news-date">{news.date}</div>
                <h3 className="news-title">{news.title}</h3>
                <p className="news-desc">{news.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default NewsSection
