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
        const contactData = res.sections?.contact || {}
        // Migrasi data: Jika tiktok masih kosong tapi facebook ada isinya, salin ke tiktok
        if (!contactData.tiktok && contactData.facebook) {
          contactData.tiktok = contactData.facebook
        }
        setContent(contactData)
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
      // Hapus key facebook agar bersih saat disimpan
      const { facebook, ...cleanedContent } = content
      await updateSiteContent("contact", cleanedContent)
      await updateSiteContent("footer", footerContent)
      showToast("Data Kontak & Footer berhasil disimpan!")
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="adm-loading">Memuat data...</div>

  return (
    <div>
      {toast && <div className="adm-toast success">{toast}</div>}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Kontak & Footer</h1>
          <p className="adm-page-subtitle">Kelola informasi alamat, sosial media, dan footer website</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          
          <div className="adm-card">
            <div className="adm-card-header"><h2 className="adm-card-title">Teks Section Kontak</h2></div>
            <div className="adm-form-group">
              <label className="adm-label">Label (Chip)</label>
              <input className="adm-input" value={content.chip || ""} onChange={e => setContent({...content, chip: e.target.value})} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Judul Utama</label>
              <input className="adm-input" value={content.title || ""} onChange={e => setContent({...content, title: e.target.value})} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Subjudul</label>
              <textarea className="adm-textarea" value={content.subtitle || ""} onChange={e => setContent({...content, subtitle: e.target.value})} style={{ minHeight: 80 }} />
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header"><h2 className="adm-card-title">Informasi Kontak</h2></div>
            <div className="adm-form-group">
              <label className="adm-label">Alamat Lengkap</label>
              <textarea className="adm-textarea" value={content.address || ""} onChange={e => setContent({...content, address: e.target.value})} style={{ minHeight: 80 }} />
            </div>
            <div className="adm-form-row">
              <div className="adm-form-group">
                <label className="adm-label">Email</label>
                <input type="email" className="adm-input" value={content.email || ""} onChange={e => setContent({...content, email: e.target.value})} />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Telepon / WhatsApp</label>
                <input className="adm-input" value={content.phone || ""} onChange={e => setContent({...content, phone: e.target.value})} />
              </div>
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Link Google Maps (Iframe SRC URL)</label>
              <input className="adm-input" value={content.maps_embed_url || ""} onChange={e => setContent({...content, maps_embed_url: e.target.value})} placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header"><h2 className="adm-card-title">Sosial Media</h2></div>
            <div className="adm-form-group">
              <label className="adm-label">URL Instagram</label>
              <input className="adm-input" value={content.instagram || ""} onChange={e => setContent({...content, instagram: e.target.value})} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">URL TikTok</label>
              <input className="adm-input" value={content.tiktok || ""} onChange={e => setContent({...content, tiktok: e.target.value})} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">URL YouTube</label>
              <input className="adm-input" value={content.youtube || ""} onChange={e => setContent({...content, youtube: e.target.value})} />
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header"><h2 className="adm-card-title">Footer</h2></div>
            <div className="adm-form-group">
              <label className="adm-label">Nama Brand Footer</label>
              <input className="adm-input" value={footerContent.brand_name || ""} onChange={e => setFooterContent({...footerContent, brand_name: e.target.value})} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Tagline Footer</label>
              <textarea className="adm-textarea" value={footerContent.tagline || ""} onChange={e => setFooterContent({...footerContent, tagline: e.target.value})} style={{ minHeight: 80 }} />
            </div>
          </div>

        </div>

        <div style={{ marginTop: 32 }}>
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminContact
