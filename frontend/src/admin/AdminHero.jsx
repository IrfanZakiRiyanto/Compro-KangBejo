import { useState, useEffect } from "react"
import { getAllSiteContent, updateSiteContent, getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide, reorderHeroSlides, getMediaUrl } from "../services/adminApi"
import ImageUpload from "./components/ImageUpload"

function AdminHero() {
  const [content, setContent] = useState({})
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resContent, resSlides] = await Promise.all([
        getAllSiteContent(),
        getHeroSlides()
      ])
      setContent(resContent.sections?.hero || {})
      setSlides(resSlides.items || [])
    } catch (err) {
      alert("Gagal memuat: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const handleSaveContent = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSiteContent("hero", content)
      showToast("Teks Hero berhasil disimpan!")
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── SLIDES ──────────────────────────────────────────────
  const handleAddSlide = async () => {
    try {
      await createHeroSlide({ media_id: null, sort_order: slides.length, is_active: true })
      fetchData()
    } catch (err) { alert(err.message) }
  }

  const handleUpdateSlideMedia = async (slideId, mediaId) => {
    try {
      await updateHeroSlide(slideId, { media_id: mediaId })
      fetchData()
    } catch (err) { alert(err.message) }
  }

  const handleToggleSlideActive = async (slide) => {
    try {
      await updateHeroSlide(slide.id, { is_active: !slide.is_active })
      fetchData()
    } catch (err) { alert(err.message) }
  }

  const handleDeleteSlide = async (id) => {
    if (!confirm("Hapus slide ini?")) return
    try {
      await deleteHeroSlide(id)
      fetchData()
    } catch (err) { alert(err.message) }
  }

  const moveSlide = async (index, dir) => {
    if (index + dir < 0 || index + dir >= slides.length) return
    const newSlides = [...slides]
    const temp = newSlides[index]
    newSlides[index] = newSlides[index + dir]
    newSlides[index + dir] = temp
    
    // Update local immediately for UI responsiveness
    setSlides(newSlides)
    
    // API Call
    const orderMap = newSlides.map((s, i) => ({ id: s.id, sort_order: i }))
    try {
      await reorderHeroSlides(orderMap)
    } catch (err) {
      alert("Gagal mengurutkan: " + err.message)
      fetchData() // revert on fail
    }
  }

  if (loading) return <div>Memuat...</div>

  return (
    <div>
      {toast && <div className="ad-toast success">{toast}</div>}
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Hero Section & Slides</h1>
          <p className="ad-page-subtitle">Kelola teks sambutan dan gambar latar belakang berputar</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Editor Teks */}
        <div className="ad-card">
          <div className="ad-card-header">
            <h2 className="ad-card-title">Teks Konten</h2>
          </div>
          <form onSubmit={handleSaveContent}>
            <div className="ad-form-group">
              <label className="ad-label">Label (Chip)</label>
              <input
                className="ad-input"
                value={content.chip_text || ""}
                onChange={e => setContent({...content, chip_text: e.target.value})}
              />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Judul Utama</label>
              <textarea
                className="ad-textarea"
                value={content.title || ""}
                onChange={e => setContent({...content, title: e.target.value})}
                style={{ minHeight: 80 }}
              />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Subjudul</label>
              <textarea
                className="ad-textarea"
                value={content.subtitle || ""}
                onChange={e => setContent({...content, subtitle: e.target.value})}
                style={{ minHeight: 120 }}
              />
            </div>
            <div className="ad-form-row">
              <div className="ad-form-group">
                <label className="ad-label">Teks Tombol 1</label>
                <input
                  className="ad-input"
                  value={content.cta_primary || ""}
                  onChange={e => setContent({...content, cta_primary: e.target.value})}
                />
              </div>
              <div className="ad-form-group">
                <label className="ad-label">Teks Tombol 2</label>
                <input
                  className="ad-input"
                  value={content.cta_secondary || ""}
                  onChange={e => setContent({...content, cta_secondary: e.target.value})}
                />
              </div>
            </div>
            <button type="submit" className="ad-btn ad-btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Teks"}
            </button>
          </form>
        </div>

        {/* Editor Slides */}
        <div className="ad-card">
          <div className="ad-card-header">
            <h2 className="ad-card-title">Background Slides</h2>
            <button type="button" className="ad-btn ad-btn-outline ad-btn-sm" onClick={handleAddSlide}>
              + Tambah Slide
            </button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {slides.length === 0 && <div className="ad-empty">Belum ada slide</div>}
            
            {slides.map((slide, i) => (
              <div key={slide.id} style={{ border: "1px solid var(--ad-border)", borderRadius: 12, padding: 16, display: "flex", gap: 16, background: slide.is_active ? "transparent" : "#f1f5f9" }}>
                <div style={{ width: 120 }}>
                  <ImageUpload 
                    label="" 
                    value={slide.media_id} 
                    onChange={(mediaId) => handleUpdateSlideMedia(slide.id, mediaId)} 
                  />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "1rem" }}>Slide {i + 1}</div>
                    <div style={{ fontSize: ".8rem", color: slide.is_active ? "var(--ad-success)" : "var(--ad-danger)" }}>
                      {slide.is_active ? "Aktif" : "Non-aktif"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button className="ad-btn-icon" onClick={() => moveSlide(i, -1)} disabled={i === 0}>⬆️</button>
                    <button className="ad-btn-icon" onClick={() => moveSlide(i, 1)} disabled={i === slides.length - 1}>⬇️</button>
                    <div style={{ flex: 1 }} />
                    <button 
                      className={`ad-btn-icon ${slide.is_active ? "danger" : ""}`} 
                      onClick={() => handleToggleSlideActive(slide)}
                      title={slide.is_active ? "Non-aktifkan" : "Aktifkan"}
                    >
                      {slide.is_active ? "👁️" : "🙈"}
                    </button>
                    <button className="ad-btn-icon danger" onClick={() => handleDeleteSlide(slide.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHero
