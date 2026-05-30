import { useState, useEffect } from "react"
import { getAllSiteContent, updateSiteContent } from "../services/adminApi"

function AdminContact() {
  const [content, setContent] = useState({})
  const [footerContent, setFooterContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  useEffect(() => {
    getAllSiteContent()
      .then(res => {
        setContent(res.sections?.contact || {})
        setFooterContent(res.sections?.footer || {})
      })
      .catch(err => alert(err.message))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSiteContent("contact", content)
      await updateSiteContent("footer", footerContent)
      showToast("Data Kontak & Footer berhasil disimpan!")
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Memuat...</div>

  return (
    <div>
      {toast && <div className="ad-toast success">{toast}</div>}
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Kontak & Footer</h1>
          <p className="ad-page-subtitle">Kelola informasi alamat, sosial media, dan footer website</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          
          <div className="ad-card">
            <div className="ad-card-header"><h2 className="ad-card-title">Teks Section Kontak</h2></div>
            <div className="ad-form-group">
              <label className="ad-label">Label (Chip)</label>
              <input className="ad-input" value={content.chip || ""} onChange={e => setContent({...content, chip: e.target.value})} />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Judul Utama</label>
              <input className="ad-input" value={content.title || ""} onChange={e => setContent({...content, title: e.target.value})} />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Subjudul</label>
              <textarea className="ad-textarea" value={content.subtitle || ""} onChange={e => setContent({...content, subtitle: e.target.value})} style={{ minHeight: 80 }} />
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-header"><h2 className="ad-card-title">Informasi Kontak</h2></div>
            <div className="ad-form-group">
              <label className="ad-label">Alamat Lengkap</label>
              <textarea className="ad-textarea" value={content.address || ""} onChange={e => setContent({...content, address: e.target.value})} style={{ minHeight: 80 }} />
            </div>
            <div className="ad-form-row">
              <div className="ad-form-group">
                <label className="ad-label">Email</label>
                <input type="email" className="ad-input" value={content.email || ""} onChange={e => setContent({...content, email: e.target.value})} />
              </div>
              <div className="ad-form-group">
                <label className="ad-label">Telepon / WhatsApp</label>
                <input className="ad-input" value={content.phone || ""} onChange={e => setContent({...content, phone: e.target.value})} />
              </div>
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Link Google Maps (Iframe SRC URL)</label>
              <input className="ad-input" value={content.maps_embed_url || ""} onChange={e => setContent({...content, maps_embed_url: e.target.value})} placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-header"><h2 className="ad-card-title">Sosial Media</h2></div>
            <div className="ad-form-group">
              <label className="ad-label">URL Instagram</label>
              <input className="ad-input" value={content.instagram || ""} onChange={e => setContent({...content, instagram: e.target.value})} />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">URL Facebook</label>
              <input className="ad-input" value={content.facebook || ""} onChange={e => setContent({...content, facebook: e.target.value})} />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">URL YouTube</label>
              <input className="ad-input" value={content.youtube || ""} onChange={e => setContent({...content, youtube: e.target.value})} />
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-header"><h2 className="ad-card-title">Footer</h2></div>
            <div className="ad-form-group">
              <label className="ad-label">Nama Brand Footer</label>
              <input className="ad-input" value={footerContent.brand_name || ""} onChange={e => setFooterContent({...footerContent, brand_name: e.target.value})} />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Tagline Footer</label>
              <textarea className="ad-textarea" value={footerContent.tagline || ""} onChange={e => setFooterContent({...footerContent, tagline: e.target.value})} style={{ minHeight: 80 }} />
            </div>
          </div>

        </div>

        <div style={{ marginTop: 32 }}>
          <button type="submit" className="ad-btn ad-btn-primary" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminContact
