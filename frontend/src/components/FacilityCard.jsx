/**
 * FacilityCard — Kartu untuk satu fasilitas
 * Props:
 *   facility (object) — { id, name, description, icon, is_active }
 */
function FacilityCard({ facility }) {
  return (
    <div
      id={`facility-${facility.id}`}
      className="feature-card glass-card"
      role="article"
      aria-label={`Fasilitas: ${facility.name}`}
    >
      <div className="feature-icon">{facility.icon || "🌿"}</div>
      <h3 className="feature-name">{facility.name}</h3>
      {facility.description && (
        <p className="feature-desc">{facility.description}</p>
      )}
    </div>
  )
}

export default FacilityCard
