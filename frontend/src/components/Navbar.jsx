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
    { id: 'berita', label: 'Berita' },
    { id: 'kontak', label: 'Kontak' },
  ]

  const handleNavClick = (id) => {
    onNavClick(id)
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        
        <div className="brand" onClick={() => handleNavClick('beranda')}>
          <div className="brand-logo">🍃</div>
          <span className="brand-text">{brandText}</span>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-status" title={`API v${apiVersion}`}>
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span className="status-text">{isConnected ? 'Online' : 'Offline'}</span>
        </div>

      </div>
    </nav>
  )
}

export default Navbar
