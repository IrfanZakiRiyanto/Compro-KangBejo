import { useState, useEffect, useCallback } from "react"
import "./App.css"

// ── Komponen
import Navbar        from "./components/Navbar"
import HeroSection   from "./components/HeroSection"
import AboutSection  from "./components/AboutSection"
import FacilityCard  from "./components/FacilityCard"
import ActivityCard  from "./components/ActivityCard"
import SectionHeader from "./components/SectionHeader"
import PageFooter    from "./components/PageFooter"

// ── Service layer
import {
  checkHealth,
  fetchAbout,
  fetchFacilities,
  fetchActivities,
} from "./services/api"

// ─────────────────────────────────────────────────────
//  ROOT COMPONENT
// ─────────────────────────────────────────────────────
function App() {
  // ── State ─────────────────────────────────────────
  const [activeSection, setActiveSection] = useState("beranda")
  const [isConnected,   setIsConnected]   = useState(false)
  const [apiVersion,    setApiVersion]    = useState(null)

  const [about,       setAbout]       = useState(null)
  const [facilities,  setFacilities]  = useState([])
  const [activities,  setActivities]  = useState([])
  const [loading,     setLoading]     = useState(true)

  // ── Load semua data dari API ───────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [connected, aboutData, facData, actData] = await Promise.all([
        checkHealth(),
        fetchAbout(),
        fetchFacilities({ active_only: true }),
        fetchActivities({ active_only: true }),
      ])

      setIsConnected(connected)
      setAbout(aboutData)
      setFacilities(facData.items ?? [])
      setActivities(actData.items ?? [])
    } catch (err) {
      console.error("Gagal memuat data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch versi API
  useEffect(() => {
    fetch(
      (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/"
    )
      .then(r => r.json())
      .then(d => setApiVersion(d.version))
      .catch(() => {})
  }, [])

  // Load data saat mount
  useEffect(() => { loadAll() }, [loadAll])

  // ── Scroll handler ─────────────────────────────────
  const scrollTo = useCallback((sectionId) => {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Highlight nav saat scroll
  useEffect(() => {
    const sections = ["beranda", "tentang", "fasilitas", "kegiatan"]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // ── Render ─────────────────────────────────────────
  return (
    <div className="app">

      {/* ── NAVBAR ── */}
      <Navbar
        activeSection={activeSection}
        onNavClick={scrollTo}
        isConnected={isConnected}
        apiVersion={apiVersion}
      />

      {/* ── HERO ── */}
      <HeroSection
        facilityCount={facilities.length}
        activityCount={activities.length}
        loading={loading}
        onExplore={() => scrollTo("tentang")}
        onActivities={() => scrollTo("kegiatan")}
      />

      {/* ── LOADING BAR ── */}
      {loading && (
        <div className="loading-bar">
          <div className="loading-spinner"></div>
          <span>Memuat data dari API...</span>
        </div>
      )}

      {/* ── TENTANG ── */}
      <AboutSection about={about} />

      {/* ── FASILITAS ── */}
      {facilities.length > 0 && (
        <section id="fasilitas" className="section section-alt">
          <div className="container">
            <SectionHeader
              chip="Fasilitas"
              title="Apa yang Kami Sediakan"
              subtitle="Nikmati berbagai fasilitas lengkap di Desa Wisata Kang Bejo"
            />
            <div className="cards-grid">
              {facilities.map(f => (
                <FacilityCard key={f.id} facility={f} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── KEGIATAN ── */}
      {activities.length > 0 && (
        <section id="kegiatan" className="section">
          <div className="container">
            <SectionHeader
              chip="Kegiatan"
              title="Aktivitas Seru Menanti"
              subtitle="Berbagai kegiatan menarik yang bisa kamu ikuti bersama keluarga & teman"
            />
            <div className="cards-grid">
              {activities.map((a, idx) => (
                <ActivityCard key={a.id} activity={a} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <PageFooter apiVersion={apiVersion} />

    </div>
  )
}

export default App
