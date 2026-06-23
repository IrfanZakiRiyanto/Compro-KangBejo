import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { listMedia, uploadMedia, deleteMedia, getMediaUrl } from "../../services/adminApi"

function MediaPicker({ onSelect, onClose }) {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
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

    // Batasan 5MB
    const MAX_SIZE_BYTES = 5 * 1024 * 1024
    if (file.size > MAX_SIZE_BYTES) {
      alert(`Gagal: Ukuran file melebihi batas 5MB! (Ukuran file Anda: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    setUploading(true)
    try {
      const res = await uploadMedia(file)
      fetchMedia()
      // Auto select newly uploaded media
      if (res && res.id) {
        setSelectedId(res.id)
      }
    } catch (err) {
      alert("Gagal upload: " + err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSave = () => {
    if (selectedId) {
      onSelect(selectedId)
    }
  }

  const handleDelete = async (e, item) => {
    e.stopPropagation()
    if (!confirm(`Hapus "${item.filename}" secara permanen?`)) return
    try {
      await deleteMedia(item.id)
      if (selectedId === item.id) setSelectedId(null)
      fetchMedia()
    } catch (err) {
      alert("Gagal menghapus: " + err.message)
    }
  }

  const pickerContent = (
    <div className="adm-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="adm-modal adm-modal-lg" onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", maxHeight: "90vh" }}>
        {/* Header */}
        <div className="adm-modal-header" style={{ marginBottom: 16 }}>
          <h2 className="adm-modal-title">Pilih Media (Pustaka Gambar & Video)</h2>
          <button className="adm-modal-close" onClick={onClose} style={{ fontSize: "1.5rem" }}>&times;</button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: 4, marginBottom: 20 }}>
          {/* Panduan Ukuran & Resolusi */}
          <div style={{ 
            marginBottom: 16, 
            padding: "12px 16px", 
            background: "#F8F9F5", 
            borderRadius: 8, 
            border: "1px solid var(--adm-border)",
            fontSize: ".8rem", 
            color: "var(--adm-text-muted)" 
          }}>
            <div style={{ fontWeight: 700, color: "var(--adm-text)", marginBottom: 4 }}>
              Panduan & Batasan Unggah Media:
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.5 }}>
              <li><strong>Maksimal Ukuran File:</strong> 5MB (berlaku untuk Foto & Video).</li>
              <li><strong>Foto (Rekomendasi):</strong> Format <code>.webp</code> atau <code>.jpg</code>. Resolusi ideal: <code>1920x1080 px</code> (Hero/Slide) atau <code>800x600 px</code> (Fasilitas/Kegiatan/Berita).</li>
              <li><strong>Video (Rekomendasi):</strong> Format <code>.mp4</code> (720p HD / 1280x720 px) untuk mencegah lag dan performa lambat pada website.</li>
            </ul>
          </div>

          {/* Action Upload */}
          <div style={{ marginBottom: 20 }}>
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
              {uploading ? "Mengunggah..." : "+ Unggah Berkas Baru"}
            </button>
          </div>

          {/* Media Grid */}
          {loading ? (
            <div className="adm-empty">Memuat library...</div>
          ) : media.length === 0 ? (
            <div className="adm-empty">Belum ada file media yang diunggah.</div>
          ) : (
            <div className="adm-media-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
              {media.map(item => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`adm-media-item ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedId(item.id)}
                    onDoubleClick={() => {
                      setSelectedId(item.id)
                      onSelect(item.id)
                    }}
                    style={{
                      border: isSelected ? "3px solid #1B4332" : "2px solid #EAE8E2",
                      borderRadius: 10,
                      transform: isSelected ? "scale(0.98)" : "none",
                      boxShadow: isSelected ? "0 0 10px rgba(27, 67, 50, 0.3)" : "none",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {item.mime_type.startsWith("video/") ? (
                      <video src={getMediaUrl(item.id)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <img src={getMediaUrl(item.id)} alt={item.filename} />
                    )}

                    {/* Delete button — always visible on hover via CSS, top-right */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item)}
                      title="Hapus media ini"
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(220, 38, 38, 0.9)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        lineHeight: 1,
                        zIndex: 10,
                        opacity: 0,
                        transition: "opacity 0.15s ease",
                        padding: 0,
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "0"}
                      onFocus={e => e.currentTarget.style.opacity = "1"}
                      onBlur={e => e.currentTarget.style.opacity = "0"}
                    >
                      ×
                    </button>

                    {/* Tick icon overlay if selected */}
                    {isSelected && (
                      <div style={{
                        position: "absolute",
                        top: 6,
                        left: 6,
                        background: "#1B4332",
                        color: "#fff",
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justify: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        justifyContent: "center"
                      }}>
                        ✓
                      </div>
                    )}

                    <div className="adm-media-item-overlay" style={{ fontSize: "0.65rem", padding: 6 }}>
                      {item.filename.length > 15 ? item.filename.substring(0, 12) + "..." : item.filename}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          paddingTop: 16,
          borderTop: "1px solid var(--adm-border)"
        }}>
          <button 
            type="button" 
            className="adm-btn adm-btn-outline" 
            onClick={onClose}
            style={{ minWidth: 100 }}
          >
            Batal
          </button>
          <button 
            type="button" 
            className="adm-btn adm-btn-primary" 
            onClick={handleSave}
            disabled={!selectedId}
            style={{ minWidth: 140, opacity: selectedId ? 1 : 0.6 }}
          >
            Simpan Pilihan
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(pickerContent, document.body)
}

export default MediaPicker
