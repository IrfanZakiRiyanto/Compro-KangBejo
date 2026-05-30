import { useState } from "react"
import MediaPicker from "./MediaPicker"
import { getMediaUrl } from "../../services/adminApi"

function ImageUpload({ label, value, onChange }) {
  const [showPicker, setShowPicker] = useState(false)

  const handleSelect = (mediaId) => {
    onChange(mediaId)
    setShowPicker(false)
  }

  return (
    <div className="ad-form-group">
      <label className="ad-label">{label}</label>
      
      {value ? (
        <div style={{ marginBottom: 12 }}>
          <div className="ad-upload-preview">
            <img src={getMediaUrl(value)} alt="Preview" />
            <button
              type="button"
              className="ad-upload-preview-remove"
              onClick={() => onChange(null)}
              title="Hapus gambar"
            >
              &times;
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="ad-upload-zone" 
          onClick={() => setShowPicker(true)}
          style={{ padding: "20px", marginBottom: 12 }}
        >
          <div className="ad-upload-zone-icon">🖼️</div>
          <p>Pilih Gambar / Video</p>
        </div>
      )}

      {showPicker && (
        <MediaPicker
          onSelect={handleSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

export default ImageUpload
