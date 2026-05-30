import { useState, useEffect, useRef } from "react"
import { listMedia, uploadMedia, getMediaUrl } from "../../services/adminApi"

function MediaPicker({ onSelect, onClose }) {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef()

  const fetchMedia = () => {
    setLoading(true)
    listMedia()
      .then(res => setMedia(res.items || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      await uploadMedia(file)
      fetchMedia()
    } catch (err) {
      alert("Gagal upload: " + err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="ad-modal-overlay" onClick={onClose}>
      <div className="ad-modal ad-modal-lg" onClick={e => e.stopPropagation()}>
        <div className="ad-modal-header">
          <h2 className="ad-modal-title">Pilih Media</h2>
          <button className="ad-modal-close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*,video/*"
          />
          <button
            className="ad-btn ad-btn-primary"
            onClick={handleUploadClick}
            disabled={uploading}
          >
            {uploading ? "Mengunggah..." : "⬆️ Unggah File Baru"}
          </button>
        </div>

        {loading ? (
          <div className="ad-empty">Memuat library...</div>
        ) : media.length === 0 ? (
          <div className="ad-empty">Belum ada file media yang diunggah.</div>
        ) : (
          <div className="ad-media-grid">
            {media.map(item => (
              <div
                key={item.id}
                className="ad-media-item"
                onClick={() => onSelect(item.id)}
              >
                {item.mime_type.startsWith("video/") ? (
                  <video src={getMediaUrl(item.id)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <img src={getMediaUrl(item.id)} alt={item.filename} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MediaPicker
