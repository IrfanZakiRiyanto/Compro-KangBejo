function ActivityCard({ activity, index }) {
  const num = String(index + 1).padStart(2, "0")
  return (
    <div
      id={`activity-${activity.id}`}
      className="activity-card"
      style={{
        backgroundImage: `url("${activity.image || 'https://images.unsplash.com/photo-1595841696250-20c254b1f486?auto=format&fit=crop&q=80&w=400'}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="activity-num" aria-hidden="true">{num}</div>
      <div className="activity-card-content">
        <h3 className="activity-name">{activity.name}</h3>
        {activity.description && (
          <p className="activity-desc">{activity.description}</p>
        )}
      </div>
    </div>
  )
}
export default ActivityCard

