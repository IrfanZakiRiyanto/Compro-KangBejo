import { useState, useEffect } from "react"
import { getNews, createNews, updateNews, deleteNews, getMediaUrl, getAllSiteContent, updateSiteContent } from "../services/adminApi"
import DataTable from "./components/DataTable"
import ImageUpload from "./components/ImageUpload"
import MediaPicker from "./components/MediaPicker"

// Helper untuk format YYYY-MM-DD ke Indonesia (12 Agustus 2026)
function formatIndonesianDate(dateStr) {
  if (!dateStr) return "Baru saja"
  const reg = /^\d{4}-\d{2}-\d{2}$/
  if (!reg.test(dateStr)) return dateStr
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]
  const [year, month, day] = dateStr.split("-")
  const monthIdx = parseInt(month, 10) - 1
  return `${parseInt(day, 10)} ${months[monthIdx]} ${year}`
}

// Helper untuk konversi Indonesia (12 Agustus 2026) ke YYYY-MM-DD agar bisa di-edit oleh input date
function convertToDateInputFormat(dateStr) {
  if (!dateStr) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  
  const months = [
    "januari", "februari", "maret", "april", "mei", "juni",
    "juli", "agustus", "september", "oktober", "november", "desember"
  ]
  const parts = dateStr.toLowerCase().split(/\s+/)
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0')
    const monthName = parts[1]
    const year = parts[2]
    const monthIdx = months.indexOf(monthName)
    if (monthIdx !== -1 && /^\d{1,2}$/.test(parts[0]) && /^\d{4}$/.test(year)) {
      const month = String(monthIdx + 1).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  }
  return ""
}

function AdminNews() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState("")

  // Form State
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: "", description: "", date: "", is_active: true, sort_order: 0, media_id: null })
  const [showMediaPickerForEditor, setShowMediaPickerForEditor] = useState(false)
  
  // Section text state
  const [sectionText, setSectionText] = useState({})
  const [savingText, setSavingText] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resData, resContent] = await Promise.all([
        getNews(),
        getAllSiteContent()
      ])
      setData(resData.items || [])
      setSectionText(resContent.sections?.news || {})
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

  const handleSaveText = async (e) => {
    e.preventDefault()
    setSavingText(true)
    try {
      await updateSiteContent("news", sectionText)
      showToast("Teks section berhasil disimpan!")
    } catch (err) { alert(err.message) } finally { setSavingText(false) }
  }

  const resetForm = () => {
    setFormData({ title: "", description: "", date: "", is_active: true, sort_order: 0, media_id: null })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description || "",
      date: convertToDateInputFormat(item.date),
      is_active: item.is_active,
      sort_order: item.sort_order || 0,
      media_id: item.media_id
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus berita "${item.title}"?`)) return
    try {
      await deleteNews(item.id)
      showToast("Berita dihapus")
      fetchData()
    } catch (err) { alert(err.message) }
  }

  const handleInsertMedia = (mediaId) => {
    const textarea = document.getElementById("news-description-textarea")
    if (!textarea) {
      setFormData({ ...formData, description: (formData.description || "") + ` [gambar:${mediaId}]` })
      setShowMediaPickerForEditor(false)
      return
    }
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.description || ""
    const newText = text.substring(0, start) + ` [gambar:${mediaId}] ` + text.substring(end)
    setFormData({ ...formData, description: newText })
    setShowMediaPickerForEditor(false)
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + ` [gambar:${mediaId}] `.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 50)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData, sort_order: parseInt(formData.sort_order, 10) || 0 }
      if (editingId) {
        await updateNews(editingId, payload)
        showToast("Berita diupdate")
      } else {
        await createNews(payload)
        showToast("Berita ditambah")
      }
      resetForm()
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const columns = [
    { 
      label: "Gambar", 
      render: (row) => row.media_id ? <img src={getMediaUrl(row.media_id)} className="adm-table-img" alt={row.title} /> : <div className="adm-table-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--adm-text-muted)" }}>No Image</div>
    },
    { 
      label: "Berita", 
      render: (row) => <div><div style={{ fontWeight: 600 }}>{row.title}</div><div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>{formatIndonesianDate(row.date)}</div></div>
    },
    { 
      label: "Status", 
      render: (row) => <span className={`adm-badge ${row.is_active ? 'adm-badge-active' : 'adm-badge-inactive'}`}>{row.is_active ? "Aktif" : "Non-aktif"}</span> 
    }
  ]

  if (loading) return <div className="adm-loading">Memuat data...</div>

  return (
    <div>
      {toast && <div className="adm-toast success">{toast}</div>}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Berita & Kabar Terbaru</h1>
          <p className="adm-page-subtitle">Kelola berita, acara, atau pengumuman</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32, alignItems: "start" }}>
        
        {/* Kolom Kiri: Teks Section */}
        <div className="adm-card">
          <div className="adm-card-header"><h2 className="adm-card-title">Teks Section</h2></div>
          <form onSubmit={handleSaveText}>
            <div className="adm-form-group">
              <label className="adm-label">Label (Chip)</label>
              <input className="adm-input" value={sectionText.chip || ""} onChange={e => setSectionText({...sectionText, chip: e.target.value})} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Judul Utama</label>
              <input className="adm-input" value={sectionText.title || ""} onChange={e => setSectionText({...sectionText, title: e.target.value})} />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Subjudul</label>
              <textarea className="adm-textarea" value={sectionText.subtitle || ""} onChange={e => setSectionText({...sectionText, subtitle: e.target.value})} style={{ minHeight: 80 }} />
            </div>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={savingText}>
              {savingText ? "Menyimpan..." : "Simpan Teks"}
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Tabel Data */}
        <div className="adm-card">
          <div className="adm-card-header">
            <h2 className="adm-card-title">Daftar Berita</h2>
            <button className="adm-btn adm-btn-primary" onClick={() => { resetForm(); setShowForm(true) }}>
              + Tambah Berita
            </button>
          </div>
          
          <DataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
        </div>

      </div>

      {/* Modal Form Tambah/Edit */}
      {showForm && (
        <div className="adm-modal-overlay" onClick={resetForm}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2 className="adm-modal-title">{editingId ? "Edit Berita" : "Tambah Berita"}</h2>
              <button className="adm-modal-close" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="adm-form-group">
                <label className="adm-label">Judul Berita</label>
                <input className="adm-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Isi / Deskripsi Lengkap Berita</label>
                <textarea 
                  id="news-description-textarea"
                  className="adm-textarea" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  style={{ minHeight: 180 }}
                  required 
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--adm-text-muted)" }}>
                    Tip: Gunakan <code>[gambar:ID]</code> untuk menyisipkan gambar tambahan di tengah paragraf berita.
                  </span>
                  <button 
                    type="button" 
                    className="adm-btn adm-btn-outline" 
                    style={{ padding: "4px 12px", fontSize: "0.75rem", minHeight: "auto" }}
                    onClick={() => setShowMediaPickerForEditor(true)}
                  >
                    🖼️ Sisipkan Gambar
                  </button>
                </div>
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Tanggal Berita</label>
                <input 
                  type="date" 
                  className="adm-input" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                  required 
                />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Status</label>
                <select className="adm-select" value={formData.is_active ? "true" : "false"} onChange={e => setFormData({...formData, is_active: e.target.value === "true"})}>
                  <option value="true">Aktif</option>
                  <option value="false">Non-aktif</option>
                </select>
              </div>
              
              <ImageUpload label="Gambar Berita" value={formData.media_id} onChange={id => setFormData({...formData, media_id: id})} />
              
              <div className="adm-form-actions">
                <button type="submit" className="adm-btn adm-btn-primary">Simpan</button>
                <button type="button" className="adm-btn adm-btn-outline" onClick={resetForm}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showMediaPickerForEditor && (
        <MediaPicker 
          onSelect={handleInsertMedia} 
          onClose={() => setShowMediaPickerForEditor(false)} 
        />
      )}
    </div>
  )
}

export default AdminNews
