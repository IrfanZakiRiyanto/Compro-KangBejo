/**
 * Navbar — Navigasi sticky bertema Kang Bejo
 * Props:
 *   activeSection (string) — section yang sedang aktif
 *   onNavClick (fn)        — callback saat item nav diklik
 *   isConnected (bool)     — status koneksi API
 *   apiVersion (string)    — versi API
 */
function Navbar({ activeSection, onNavClick, isConnected, apiVersion }) {
  const navItems = [
    { key: "beranda",   label: "Beranda" },
    { key: "tentang",   label: "Tentang" },
    { key: "fasilitas", label: "Fasilitas" },
    { key: "kegiatan",  label: "Kegiatan" },
  ]

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="nav-brand">
        <span className="brand-icon">🌿</span>
        <span className="brand-text">Kang Bejo</span>
      </div>

      {/* Links */}
      <ul className="nav-links">
        {navItems.map(item => (
          <li key={item.key}>
            <a
              href={`#${item.key}`}
              id={`nav-${item.key}`}
              className={`nav-link${activeSection === item.key ? " active" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                onNavClick(item.key)
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* API Badge */}
      <span
        className="api-badge"
        title={isConnected ? "API terhubung" : "API tidak terhubung"}
      >
        <span className={`dot ${isConnected ? "" : "dot-error"}`}></span>
        {isConnected
          ? `API v${apiVersion ?? "…"}`
          : "API offline"}
      </span>
    </nav>
  )
}

export default Navbar
