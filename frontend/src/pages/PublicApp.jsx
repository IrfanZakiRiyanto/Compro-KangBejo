import { useState, useEffect, useCallback } from "react"

import Navbar        from "../components/Navbar"
import HeroSection   from "../components/HeroSection"
import AboutSection  from "../components/AboutSection"
import FacilityCard  from "../components/FacilityCard"
import ActivityCard  from "../components/ActivityCard"
import SectionHeader from "../components/SectionHeader"
import PageFooter    from "../components/PageFooter"
import ContactSection from "../components/ContactSection"

import { checkHealth, fetchFacilities, fetchActivities, fetchSiteContent, fetchHeroSlides, getMediaUrl } from "../services/api"

function PublicApp() {
  const [activeSection, setActiveSection] = useState("beranda")
  const [isConnected,   setIsConnected]   = useState(false)
  const [apiVersion,    setApiVersion]    = useState(null)
  const [siteContent,   setSiteContent]   = useState({})
  const [heroSlides,    setHeroSlides]    = useState([])
  const [facilities,    setFacilities]    = useState([])
  const [activities,    setActivities]    = useState([])
  const [loading,       setLoading]       = useState(true)

  // ── Fetch semua data ──────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [connected, contentRes, slidesRes, facData, actData] = await Promise.all([
        checkHealth(),
        fetchSiteContent().catch(() => ({ sections: {} })),
        fetchHeroSlides().catch(() => ({ items: [] })),
        fetchFacilities({ active_only: true }),
        fetchActivities({ active_only: true }),
      ])
      setIsConnected(connected)
      setSiteContent(contentRes.sections || {})
      setHeroSlides(
        (slidesRes.items ?? []).map(s => ({
          ...s,
          imageUrl: getMediaUrl(s.media_id),
        }))
      )
      setFacilities(
        (facData.items ?? []).map(f => ({
          ...f,
          image: f.media_id ? getMediaUrl(f.media_id) : null,
        }))
      )
      setActivities(
        (actData.items ?? []).map(a => ({
          ...a,
          image: a.media_id ? getMediaUrl(a.media_id) : null,
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
    const ids = ["beranda","tentang","fasilitas","kegiatan","kontak"]
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) }),
      { threshold: 0.35 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [loading])

  // Scroll ke section dari query parameter (misal saat kembali dari detail berita)
  useEffect(() => {
    if (!loading) {
      const params = new URLSearchParams(window.location.search)
      const section = params.get("section")
      if (section) {
        const t = setTimeout(() => {
          scrollTo(section)
          // Bersihkan query param dari address bar agar tidak berulang
          window.history.replaceState({}, document.title, window.location.pathname)
        }, 300)
        return () => clearTimeout(t)
      }
    }
  }, [loading, scrollTo])

  // ── Helpers ──────────────────────────────────────
  const sc = (section, key, fallback = "") => siteContent?.[section]?.[key] ?? fallback

  // ── Render ───────────────────────────────────────
  return (
    <div className="app">

      <Navbar
        activeSection={activeSection}
        onNavClick={scrollTo}
        isConnected={isConnected}
        apiVersion={apiVersion}
        brandText={sc("navbar", "brand_text", "Kang Bejo")}
      />

      <HeroSection
        facilityCount={facilities.length}
        activityCount={activities.length}
        loading={loading}
        onExplore={() => scrollTo("tentang")}
        onActivities={() => scrollTo("kegiatan")}
        slides={heroSlides}
        content={siteContent.hero || {}}
      />

      {loading && (
        <div className="loading-bar">
          <div className="loading-spinner" />
          <span>Memuat data dari API…</span>
        </div>
      )}

      {/* TENTANG */}
      <AboutSection
        content={siteContent.about || {}}
        facilityCount={facilities.length}
        activityCount={activities.length}
      />

      {/* FASILITAS */}
      {facilities.length > 0 && (
        <section id="fasilitas" className="section">
          <div className="container">
            <SectionHeader
              chip={sc("facilities", "chip", "Fasilitas")}
              title={sc("facilities", "title", "Apa yang Kami Sediakan")}
              subtitle={sc("facilities", "subtitle", "Nikmati berbagai fasilitas lengkap di Desa Wisata Kang Bejo")}
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
              chip={sc("activities", "chip", "Kegiatan")}
              title={sc("activities", "title", "Aktivitas Seru Menanti")}
              subtitle={sc("activities", "subtitle", "Berbagai kegiatan menarik yang bisa kamu ikuti bersama keluarga & teman")}
            />
            <div className="cards-grid">
              {activities.map((a, i) => <ActivityCard key={a.id} activity={a} index={i} />)}
            </div>
          </div>
        </section>
      )}


      {/* KONTAK */}
      <ContactSection content={siteContent.contact || {}} />

      <PageFooter
        apiVersion={apiVersion}
        content={siteContent.footer || {}}
      />
    </div>
  )
}

export default PublicApp
