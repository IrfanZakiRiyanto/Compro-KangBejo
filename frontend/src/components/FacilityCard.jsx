function FacilityCard({ facility }) {
  return (
    <div id={`facility-${facility.id}`} className="facility-card">
      <div className="facility-img-wrap">
        <img
          src={facility.image || "https://images.unsplash.com/photo-1595841696250-20c254b1f486?auto=format&fit=crop&q=80&w=400"}
          alt={facility.name}
          className="facility-img"
          loading="lazy"
          onError={e => {
            e.target.src = "https://images.unsplash.com/photo-1595841696250-20c254b1f486?auto=format&fit=crop&q=80&w=400"
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
