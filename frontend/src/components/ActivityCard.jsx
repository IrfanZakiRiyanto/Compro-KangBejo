/**
 * ActivityCard — Kartu untuk satu kegiatan
 * Props:
 *   activity (object) — { id, name, description, icon, is_active }
 *   index (number)    — urutan tampilan (untuk nomor dekoratif)
 */
function ActivityCard({ activity, index }) {
  const displayNum = String(index + 1).padStart(2, "0")

  return (
    <div
      id={`activity-${activity.id}`}
      className="activity-card glass-card"
      role="article"
      aria-label={`Kegiatan: ${activity.name}`}
    >
      {/* Nomor dekoratif di background */}
      <div className="activity-num" aria-hidden="true">{displayNum}</div>

      <div className="activity-icon">{activity.icon || "⭐"}</div>
      <h3 className="activity-name">{activity.name}</h3>
      {activity.description && (
        <p className="activity-desc">{activity.description}</p>
      )}
    </div>
  )
}

export default ActivityCard
