import { useState, useEffect } from "react"
import { getAllSiteContent, updateSiteContent } from "../services/adminApi"
import ImageUpload from "./components/ImageUpload"

function AdminAbout() {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  useEffect(() => {
    getAllSiteContent()
      .then(res => setContent(res.sections?.about || {}))
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
      await updateSiteContent("about", content)
      showToast("Teks Tentang Kami berhasil disimpan!")
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
          <h1 className="ad-page-title">Tentang Kami</h1>
          <p className="ad-page-subtitle">Kelola informasi desa wisata dan profil singkat</p>
        </div>
      </div>

      <div className="ad-card" style={{ maxWidth: 800 }}>
        <form onSubmit={handleSave}>
          <div className="ad-form-row">
            <div className="ad-form-group">
              <label className="ad-label">Label (Chip)</label>
              <input
                className="ad-input"
                value={content.chip || ""}
                onChange={e => setContent({...content, chip: e.target.value})}
              />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Tahun Berdiri</label>
              <input
                className="ad-input"
                value={content.founded_year || ""}
                onChange={e => setContent({...content, founded_year: e.target.value})}
              />
            </div>
          </div>

          <div className="ad-form-group">
            <label className="ad-label">Nama Tempat</label>
            <input
              className="ad-input"
              value={content.name || ""}
              onChange={e => setContent({...content, name: e.target.value})}
              required
            />
          </div>

          <div className="ad-form-group">
            <label className="ad-label">Tagline Singkat</label>
            <input
              className="ad-input"
              value={content.tagline || ""}
              onChange={e => setContent({...content, tagline: e.target.value})}
            />
          </div>

          <div className="ad-form-group">
            <label className="ad-label">Lokasi</label>
            <input
              className="ad-input"
              value={content.location || ""}
              onChange={e => setContent({...content, location: e.target.value})}
            />
          </div>

          <div className="ad-form-group">
            <label className="ad-label">Deskripsi Lengkap</label>
            <textarea
              className="ad-textarea"
              value={content.description || ""}
              onChange={e => setContent({...content, description: e.target.value})}
              style={{ minHeight: 160 }}
              required
            />
          </div>

          <div className="ad-form-group">
            <label className="ad-label">Tags (Pisahkan dengan koma)</label>
            <input
              className="ad-input"
              value={content.tags || ""}
              onChange={e => setContent({...content, tags: e.target.value})}
              placeholder="Contoh: Wisata Alam, Edukasi, Budaya"
            />
          </div>

          <div style={{ marginTop: 24, marginBottom: 24 }}>
            <ImageUpload
              label="Gambar Tentang Kami"
              value={content.media_id}
              onChange={(mediaId) => setContent({...content, media_id: mediaId})}
            />
          </div>

          <button type="submit" className="ad-btn ad-btn-primary" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminAbout
