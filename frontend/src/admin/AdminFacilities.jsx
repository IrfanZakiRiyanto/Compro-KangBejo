import { useState, useEffect } from "react"
import { getFacilities, createFacility, updateFacility, deleteFacility, getMediaUrl, getAllSiteContent, updateSiteContent } from "../services/adminApi"
import DataTable from "./components/DataTable"
import ImageUpload from "./components/ImageUpload"

function AdminFacilities() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState("")

  // Form State
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: "", description: "", icon: "", is_active: true, media_id: null })
  
  // Section text state
  const [sectionText, setSectionText] = useState({})
  const [savingText, setSavingText] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [resData, resContent] = await Promise.all([
        getFacilities(),
        getAllSiteContent()
      ])
      setData(resData.items || [])
      setSectionText(resContent.sections?.facilities || {})
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
      await updateSiteContent("facilities", sectionText)
      showToast("Teks section berhasil disimpan!")
    } catch (err) { alert(err.message) } finally { setSavingText(false) }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", icon: "", is_active: true, media_id: null })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description || "",
      icon: item.icon || "",
      is_active: item.is_active,
      media_id: item.media_id
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus fasilitas "${item.name}"?`)) return
    try {
      await deleteFacility(item.id)
      showToast("Fasilitas dihapus")
      fetchData()
    } catch (err) { alert(err.message) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateFacility(editingId, formData)
        showToast("Fasilitas diupdate")
      } else {
        await createFacility(formData)
        showToast("Fasilitas ditambah")
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
      render: (row) => row.media_id ? <img src={getMediaUrl(row.media_id)} className="adm-table-img" alt={row.name} /> : <div className="adm-table-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--adm-text-muted)" }}>No Image</div>
    },
    { 
      label: "Nama Fasilitas", 
      render: (row) => <div><div style={{ fontWeight: 600 }}>{row.name}</div><div style={{ fontSize: 12, color: "var(--adm-text-muted)" }}>{row.description?.substring(0, 50)}...</div></div>
    },
    { label: "Ikon", key: "icon" },
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
          <h1 className="adm-page-title">Fasilitas</h1>
          <p className="adm-page-subtitle">Kelola daftar fasilitas yang ada di Desa Wisata</p>
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
            <h2 className="adm-card-title">Daftar Fasilitas</h2>
            <button className="adm-btn adm-btn-primary" onClick={() => { resetForm(); setShowForm(true) }}>
              + Tambah Fasilitas
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
              <h2 className="adm-modal-title">{editingId ? "Edit Fasilitas" : "Tambah Fasilitas"}</h2>
              <button className="adm-modal-close" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="adm-form-group">
                <label className="adm-label">Nama Fasilitas</label>
                <input className="adm-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Deskripsi</label>
                <textarea className="adm-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="adm-form-row">
                <div className="adm-form-group">
                  <label className="adm-label">Ikon (Optional)</label>
                  <input className="adm-input" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="Contoh: leaf" />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Status</label>
                  <select className="adm-select" value={formData.is_active ? "true" : "false"} onChange={e => setFormData({...formData, is_active: e.target.value === "true"})}>
                    <option value="true">Aktif</option>
                    <option value="false">Non-aktif</option>
                  </select>
                </div>
              </div>
              <ImageUpload label="Gambar Fasilitas" value={formData.media_id} onChange={id => setFormData({...formData, media_id: id})} />
              
              <div className="adm-form-actions">
                <button type="submit" className="adm-btn adm-btn-primary">Simpan</button>
                <button type="button" className="adm-btn adm-btn-outline" onClick={resetForm}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminFacilities
