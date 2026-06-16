import { useState, useEffect, useRef } from "react"
import { listMedia, uploadMedia, deleteMedia, getMediaUrl } from "../services/adminApi"

function AdminMedia() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState("")
  const fileInputRef = useRef()

  const fetchMedia = () => {
    setLoading(true)
    listMedia()
      .then(res => setMedia(res.items || []))
      .catch(err => alert("Gagal memuat media: " + err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      await uploadMedia(file)
      showToast("Media berhasil diunggah!")
      fetchMedia()
    } catch (err) {
      alert("Gagal upload: " + err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm("Hapus file media ini permanen?")) return
    try {
      await deleteMedia(id)
      showToast("Media berhasil dihapus!")
      fetchMedia()
    } catch (err) {
      alert("Gagal menghapus: " + err.message)
    }
  }

  const handleCopyLink = (id) => {
    const url = getMediaUrl(id)
    navigator.clipboard.writeText(url)
    showToast("Link disalin ke clipboard!")
  }

  return (
    <div>
      {toast && <div className="adm-toast success">{toast}</div>}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Media Library</h1>
          <p className="adm-page-subtitle">Kelola semua gambar dan video (Maksimal 5MB per file)</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          <button
            className="adm-btn adm-btn-primary"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? "Mengunggah..." : "⬆️ Unggah File Baru"}
          </button>
        </div>
      </div>

      <div className="adm-card">
        {loading ? (
          <div className="adm-empty">Memuat library...</div>
        ) : media.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">📁</div>
            <p>Belum ada file media yang diunggah.</p>
          </div>
        ) : (
          <div className="adm-media-grid">
            {media.map(item => (
              <div
                key={item.id}
                className="adm-media-item"
                title={item.filename}
                onClick={() => handleCopyLink(item.id)}
              >
                {item.mime_type.startsWith("video/") ? (
                  <video src={getMediaUrl(item.id)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <img src={getMediaUrl(item.id)} alt={item.filename} />
                )}
                <div className="adm-media-item-overlay">
                  {item.filename.length > 20 ? item.filename.substring(0, 18) + '...' : item.filename}
                </div>
                <button 
                  className="adm-media-item-delete"
                  onClick={(e) => handleDelete(item.id, e)}
                  title="Hapus permanen"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminMedia
