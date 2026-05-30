function FacilityCard({ facility }) {
  return (
    <div id={`facility-${facility.id}`} className="facility-card">
      <div className="facility-img-wrap">
        <img
          src={facility.image}
          alt={facility.name}
          className="facility-img"
          loading="lazy"
          onError={e => {
            // fallback jika Unsplash tidak bisa diakses
            e.target.style.display = "none"
          }}
        />
      </div>
      <div className="facility-body">
        <h3 className="facility-name">{facility.name}</h3>
        {facility.description && (
          <p className="facility-desc">{facility.description}</p>
        )}
      </div>
    </div>
  )
}
export default FacilityCard
