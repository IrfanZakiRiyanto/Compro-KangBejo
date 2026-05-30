import { useState, useEffect } from "react"
import { getNews, createNews, updateNews, deleteNews, getMediaUrl, getAllSiteContent, updateSiteContent } from "../services/adminApi"
import DataTable from "./components/DataTable"
import ImageUpload from "./components/ImageUpload"

function AdminNews() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState("")

  // Form State
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: "", description: "", date: "", is_active: true, sort_order: 0, media_id: null })
  
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
      date: item.date || "",
      is_active: item.is_active,
      sort_order: item.sort_order,
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
      render: (row) => row.media_id ? <img src={getMediaUrl(row.media_id)} className="ad-table-img" alt={row.title} /> : <div className="ad-table-img" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>🖼️</div>
    },
    { 
      label: "Berita", 
      render: (row) => <div><div style={{ fontWeight: 600 }}>{row.title}</div><div style={{ fontSize: 12, color: "var(--ad-text-muted)" }}>{row.date}</div></div>
    },
    { label: "Urutan", key: "sort_order" },
    { 
      label: "Status", 
      render: (row) => <span className={`ad-badge ${row.is_active ? 'ad-badge-active' : 'ad-badge-inactive'}`}>{row.is_active ? "Aktif" : "Non-aktif"}</span> 
    }
  ]

  if (loading) return <div>Memuat...</div>

  return (
    <div>
      {toast && <div className="ad-toast success">{toast}</div>}
      <div className="ad-page-header">
        <div>
          <h1 className="ad-page-title">Berita & Kabar Terbaru</h1>
          <p className="ad-page-subtitle">Kelola berita, acara, atau pengumuman</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32, alignItems: "start" }}>
        
        {/* Kolom Kiri: Teks Section */}
        <div className="ad-card">
          <div className="ad-card-header"><h2 className="ad-card-title">Teks Section</h2></div>
          <form onSubmit={handleSaveText}>
            <div className="ad-form-group">
              <label className="ad-label">Label (Chip)</label>
              <input className="ad-input" value={sectionText.chip || ""} onChange={e => setSectionText({...sectionText, chip: e.target.value})} />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Judul Utama</label>
              <input className="ad-input" value={sectionText.title || ""} onChange={e => setSectionText({...sectionText, title: e.target.value})} />
            </div>
            <div className="ad-form-group">
              <label className="ad-label">Subjudul</label>
              <textarea className="ad-textarea" value={sectionText.subtitle || ""} onChange={e => setSectionText({...sectionText, subtitle: e.target.value})} style={{ minHeight: 80 }} />
            </div>
            <button type="submit" className="ad-btn ad-btn-primary" disabled={savingText}>
              {savingText ? "Menyimpan..." : "Simpan Teks"}
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Tabel Data */}
        <div className="ad-card">
          <div className="ad-card-header">
            <h2 className="ad-card-title">Daftar Berita</h2>
            <button className="ad-btn ad-btn-primary" onClick={() => { resetForm(); setShowForm(true) }}>
              + Tambah Berita
            </button>
          </div>
          
          <DataTable columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
        </div>

      </div>

      {/* Modal Form Tambah/Edit */}
      {showForm && (
        <div className="ad-modal-overlay" onClick={resetForm}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <h2 className="ad-modal-title">{editingId ? "Edit Berita" : "Tambah Berita"}</h2>
              <button className="ad-modal-close" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="ad-form-group">
                <label className="ad-label">Judul Berita</label>
                <input className="ad-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="ad-form-group">
                <label className="ad-label">Isi / Deskripsi Singkat</label>
                <textarea className="ad-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="ad-form-row">
                <div className="ad-form-group">
                  <label className="ad-label">Tanggal (Teks Bebas)</label>
                  <input className="ad-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="Contoh: 12 Agustus 2026" />
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">Urutan Tampil (0 = paling atas)</label>
                  <input type="number" className="ad-input" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: e.target.value})} />
                </div>
              </div>
              <div className="ad-form-group">
                <label className="ad-label">Status</label>
                <select className="ad-select" value={formData.is_active ? "true" : "false"} onChange={e => setFormData({...formData, is_active: e.target.value === "true"})}>
                  <option value="true">Aktif</option>
                  <option value="false">Non-aktif</option>
                </select>
              </div>
              
              <ImageUpload label="Gambar Berita" value={formData.media_id} onChange={id => setFormData({...formData, media_id: id})} />
              
              <div className="ad-form-actions">
                <button type="submit" className="ad-btn ad-btn-primary">Simpan</button>
                <button type="button" className="ad-btn ad-btn-outline" onClick={resetForm}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminNews
