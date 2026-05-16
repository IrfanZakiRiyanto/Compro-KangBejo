/**
 * SectionHeader — Header reusable untuk setiap section
 * Props:
 *   chip (string)     — label chip kecil di atas
 *   title (string)    — judul section
 *   subtitle (string) — subjudul / deskripsi singkat
 */
function SectionHeader({ chip, title, subtitle }) {
  return (
    <div className="section-header">
      {chip && <span className="section-chip">{chip}</span>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  )
}

export default SectionHeader
