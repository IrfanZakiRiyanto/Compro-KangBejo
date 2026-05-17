import { ACTIVITY_GRADIENTS } from "../data/images"

function ActivityCard({ activity, index }) {
  const gradient = ACTIVITY_GRADIENTS[index % ACTIVITY_GRADIENTS.length]
  const num = String(index + 1).padStart(2, "0")
  return (
    <div
      id={`activity-${activity.id}`}
      className="activity-card"
      style={{ background: gradient }}
    >
      <div className="activity-num" aria-hidden="true">{num}</div>
      <div className="activity-icon">{activity.icon || "⭐"}</div>
      <h3 className="activity-name">{activity.name}</h3>
      {activity.description && (
        <p className="activity-desc">{activity.description}</p>
      )}
    </div>
  )
}
export default ActivityCard
