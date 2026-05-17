function PageFooter({ apiVersion }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand-wrap">
            <div className="footer-brand">
              <span>🌿</span> Kang Bejo
            </div>
            <p className="footer-tagline">
              Desa Wisata Edukasi Penghasil Kangkung — Balikpapan, Kalimantan Timur
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Navigasi</h4>
              <ul>
                {["beranda","tentang","fasilitas","kegiatan"].map(k => (
                  <li key={k}>
                    <a href={`#${k}`} style={{textTransform:"capitalize"}}>{k}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4>Informasi</h4>
              <ul>
                <li><a href="#tentang">Tentang Desa</a></li>
                <li><a href="#fasilitas">Fasilitas</a></li>
                <li><a href="#kegiatan">Kegiatan</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Desa Wisata Kang Bejo. All rights reserved.</span>
          {apiVersion && (
            <span>API v{apiVersion} · KKN ITK Balikpapan</span>
          )}
        </div>
      </div>
    </footer>
  )
}
export default PageFooter
