function ActivityCard({ activity, index }) {
  const num = String(index + 1).padStart(2, "0")
  return (
    <div
      id={`activity-${activity.id}`}
      className="activity-card"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url("${activity.image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
      }}
    >
      <div className="activity-num" aria-hidden="true">{num}</div>
      <h3 className="activity-name" style={{ marginTop: 'auto' }}>{activity.name}</h3>
      {activity.description && (
        <p className="activity-desc" style={{ color: '#eee' }}>{activity.description}</p>
      )}
    </div>
  )
}
export default ActivityCard
