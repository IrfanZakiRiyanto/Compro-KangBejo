/**
 * PageFooter — Footer website Kang Bejo
 * Props:
 *   apiVersion (string) — versi API untuk ditampilkan
 */
function PageFooter({ apiVersion }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="brand-icon">🌿</span>
        <span className="brand-text">Kang Bejo</span>
      </div>
      <p className="footer-desc">
        Desa Wisata Edukasi Penghasil Kangkung — Balikpapan, Kalimantan Timur
      </p>
      <p className="footer-copy">
        © {new Date().getFullYear()} Desa Wisata Kang Bejo
        {apiVersion && (
          <>
            {" "}·{" "}
            <span className="footer-version">API v{apiVersion}</span>
          </>
        )}
      </p>
    </footer>
  )
}

export default PageFooter
