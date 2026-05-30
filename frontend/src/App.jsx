import { useState, useEffect, useCallback } from "react"
import "./App.css"

import Navbar        from "./components/Navbar"
import HeroSection   from "./components/HeroSection"
import AboutSection  from "./components/AboutSection"
import FacilityCard  from "./components/FacilityCard"
import ActivityCard  from "./components/ActivityCard"
import SectionHeader from "./components/SectionHeader"
import PageFooter    from "./components/PageFooter"
import NewsSection   from "./components/NewsSection"
import ContactSection from "./components/ContactSection"

import { checkHealth, fetchAbout, fetchFacilities, fetchActivities } from "./services/api"
import { FACILITY_IMAGES, DEFAULT_FACILITY_IMAGE, ACTIVITY_IMAGES, DEFAULT_ACTIVITY_IMAGE } from "./data/images"

function App() {
  const [activeSection, setActiveSection] = useState("beranda")
  const [isConnected,   setIsConnected]   = useState(false)
  const [apiVersion,    setApiVersion]    = useState(null)
  const [about,         setAbout]         = useState(null)
  const [facilities,    setFacilities]    = useState([])
  const [activities,    setActivities]    = useState([])
  const [loading,       setLoading]       = useState(true)

  // ── Fetch semua data ──────────────────────────────
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
      // Enrich fasilitas dengan URL gambar dari data/images.js
      setFacilities(
        (facData.items ?? []).map(f => ({
          ...f,
          image: FACILITY_IMAGES[f.name] ?? DEFAULT_FACILITY_IMAGE,
        }))
      )
      setActivities(
        (actData.items ?? []).map(a => ({
          ...a,
          image: ACTIVITY_IMAGES[a.name] ?? DEFAULT_ACTIVITY_IMAGE,
        }))
      )
    } catch (err) {
      console.error("Gagal memuat data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Ambil versi API
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:8000"
    fetch(`${base}/`).then(r => r.json()).then(d => setApiVersion(d.version)).catch(() => {})
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Scroll & Intersection ────────────────────────
  const scrollTo = useCallback((id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    const ids = ["beranda","tentang","fasilitas","kegiatan","berita","kontak"]
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.35 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [loading])

  // ── Render ───────────────────────────────────────
  return (
    <div className="app">

      <Navbar
        activeSection={activeSection}
        onNavClick={scrollTo}
        isConnected={isConnected}
        apiVersion={apiVersion}
      />

      <HeroSection
        facilityCount={facilities.length}
        activityCount={activities.length}
        loading={loading}
        onExplore={() => scrollTo("tentang")}
        onActivities={() => scrollTo("kegiatan")}
      />

      {loading && (
        <div className="loading-bar">
          <div className="loading-spinner" />
          <span>Memuat data dari API…</span>
        </div>
      )}

      {/* TENTANG */}
      <AboutSection
        about={about}
        facilityCount={facilities.length}
        activityCount={activities.length}
      />

      {/* FASILITAS */}
      {facilities.length > 0 && (
        <section id="fasilitas" className="section">
          <div className="container">
            <SectionHeader
              chip="Fasilitas"
              title="Apa yang Kami Sediakan"
              subtitle="Nikmati berbagai fasilitas lengkap di Desa Wisata Kang Bejo"
            />
            <div className="cards-grid-2">
              {facilities.map(f => <FacilityCard key={f.id} facility={f} />)}
            </div>
          </div>
        </section>
      )}

      {/* KEGIATAN */}
      {activities.length > 0 && (
        <section id="kegiatan" className="section-alt">
          <div className="container">
            <SectionHeader
              chip="Kegiatan"
              title="Aktivitas Seru Menanti"
              subtitle="Berbagai kegiatan menarik yang bisa kamu ikuti bersama keluarga & teman"
            />
            <div className="cards-grid">
              {activities.map((a, i) => <ActivityCard key={a.id} activity={a} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* BERITA */}
      <NewsSection />

      {/* KONTAK */}
      <ContactSection />

      <PageFooter apiVersion={apiVersion} />
    </div>
  )
}

export default App
