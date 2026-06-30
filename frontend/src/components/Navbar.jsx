import { useState, useEffect } from 'react'

function Navbar({ activeSection, onNavClick, isConnected, apiVersion, brandText = "Kang Bejo" }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'tentang', label: 'Tentang' },
    { id: 'fasilitas', label: 'Fasilitas' },
    { id: 'kegiatan', label: 'Kegiatan' },
    { id: 'kontak', label: 'Kontak' },
  ]

  const handleNavClick = (id) => {
    onNavClick(id)
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container" style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
        
        <div className="nav-brand" onClick={() => handleNavClick('beranda')} style={{ cursor: 'pointer' }}>
          <img src="/Logo_kangBejo-removebg.png" alt="Logo" className="brand-logo" />
          <span className="brand-text">{brandText}</span>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: "none" }} /* Assuming App.css handles mobile menu button or we hide it for now */
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>
    </nav>
  )
}

export default Navbar
