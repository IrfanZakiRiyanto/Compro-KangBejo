function PageFooter({ apiVersion, content = {} }) {
  const currentYear = new Date().getFullYear()
  const brandName = content.brand_name || "Kang Bejo"
  const tagline = content.tagline || "Desa Wisata Edukasi Penghasil Kangkung — Balikpapan, Kalimantan Timur"
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">🍃 {brandName}</div>
            <p>{tagline}</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Jelajahi</h4>
              <a href="#beranda">Beranda</a>
              <a href="#tentang">Tentang Kami</a>
              <a href="#fasilitas">Fasilitas</a>
              <a href="#kegiatan">Kegiatan</a>
              <a href="#berita">Berita</a>
            </div>
            <div className="link-group">
              <h4>Informasi</h4>
              <a href="#kontak">Hubungi Kami</a>
              <a href="#kontak">Lokasi Map</a>
              <a href="/admin/login">Admin Login</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {brandName}. Hak cipta dilindungi.</p>
          <div className="footer-meta">
            Proyek KKN ITK &middot; API v{apiVersion || "..."}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PageFooter
