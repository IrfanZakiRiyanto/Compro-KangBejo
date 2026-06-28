function PageFooter({ apiVersion, content = {} }) {
  const currentYear = new Date().getFullYear()
  const brandName = content.brand_name || "Kang Bejo"
  const tagline = content.tagline || "Desa Wisata Edukasi Penghasil Kangkung — Balikpapan, Kalimantan Timur"
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand-wrap">
              <div className="footer-brand">{brandName}</div>
              <p className="footer-tagline">{tagline}</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-col">
                <h4>Jelajahi</h4>
                <ul>
                  <li><a href="#beranda">Beranda</a></li>
                  <li><a href="#tentang">Tentang Kami</a></li>
                  <li><a href="#fasilitas">Fasilitas</a></li>
                  <li><a href="#kegiatan">Kegiatan</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Informasi</h4>
                <ul>
                  <li><a href="#kontak">Hubungi Kami</a></li>
                  <li><a href="#kontak">Lokasi Map</a></li>
                  <li><a href="/admin/login">Admin Login</a></li>
                </ul>
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
      </div>
    </footer>
  )
}

export default PageFooter
