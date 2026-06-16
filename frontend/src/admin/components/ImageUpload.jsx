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
    <div className="adm-form-group">
      <label className="adm-label">{label}</label>
      
      {value ? (
        <div style={{ marginBottom: 12 }}>
          <div className="adm-upload-preview">
            <img src={getMediaUrl(value)} alt="Preview" />
            <button
              type="button"
              className="adm-upload-preview-remove"
              onClick={() => onChange(null)}
              title="Hapus gambar"
            >
              &times;
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="adm-upload-zone" 
          onClick={() => setShowPicker(true)}
          style={{ padding: "20px", marginBottom: 12 }}
        >
          <div className="adm-upload-zone-icon" style={{ fontSize: "2.5rem", fontWeight: 300, lineHeight: 1 }}>+</div>
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
