function Navbar({ activeSection, onNavClick, isConnected, apiVersion }) {
  const navItems = [
    { key: "beranda",   label: "Beranda" },
    { key: "tentang",   label: "Tentang" },
    { key: "fasilitas", label: "Fasilitas" },
    { key: "kegiatan",  label: "Kegiatan" },
  ]
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-icon">🌿</span>
        <span className="brand-text">Kang Bejo</span>
      </div>
      <ul className="nav-links">
        {navItems.map(item => (
          <li key={item.key}>
            <a
              href={`#${item.key}`}
              id={`nav-${item.key}`}
              className={`nav-link${activeSection === item.key ? " active" : ""}`}
              onClick={e => { e.preventDefault(); onNavClick(item.key) }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <span className="api-badge">
        <span className={`dot${isConnected ? "" : " dot-error"}`}></span>
        {isConnected ? `API v${apiVersion ?? "…"}` : "API offline"}
      </span>
    </nav>
  )
}
export default Navbar
