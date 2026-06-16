import { useEffect, useState } from "react"
import { getMe } from "../../services/adminApi"

function AdminHeader() {
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    getMe()
      .then(setAdmin)
      .catch(() => {}) // handled by api
  }, [])

  return (
    <header className="admin-header">
      <div className="admin-header-title">Content Management System</div>
      
      <div className="admin-header-right">
        <a href="/" target="_blank" rel="noreferrer" className="adm-btn adm-btn-outline adm-btn-sm">
          Lihat Website
        </a>
        <div className="admin-header-user">
          <div className="admin-header-dot"></div>
          {admin ? admin.username : "Admin"}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
