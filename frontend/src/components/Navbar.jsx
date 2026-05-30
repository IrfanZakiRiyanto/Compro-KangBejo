function Navbar({ activeSection, onNavClick }) {
  const navItems = [
    { key: "beranda",   label: "Beranda" },
    { key: "tentang",   label: "Tentang" },
    { key: "fasilitas", label: "Fasilitas" },
    { key: "kegiatan",  label: "Kegiatan" },
    { key: "berita",    label: "Berita" },
    { key: "kontak",    label: "Kontak" },
  ]
  return (
    <nav className="navbar">
      <div className="nav-brand">
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
    </nav>
  )
}
export default Navbar
