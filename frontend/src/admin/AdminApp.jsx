import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import "./admin.css"
import { isLoggedIn } from "../services/adminApi"

import AdminLogin from "./AdminLogin"
import AdminSidebar from "./components/AdminSidebar"
import AdminHeader from "./components/AdminHeader"

import AdminDashboard from "./AdminDashboard"
import AdminMedia from "./AdminMedia"
import AdminHero from "./AdminHero"
import AdminAbout from "./AdminAbout"
import AdminFacilities from "./AdminFacilities"
import AdminActivities from "./AdminActivities"
import AdminNews from "./AdminNews"
import AdminContact from "./AdminContact"

function AdminLayout({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="admin-root">
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          <AdminHeader />
          <div className="admin-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="media" element={<AdminLayout><AdminMedia /></AdminLayout>} />
      <Route path="hero" element={<AdminLayout><AdminHero /></AdminLayout>} />
      <Route path="about" element={<AdminLayout><AdminAbout /></AdminLayout>} />
      <Route path="facilities" element={<AdminLayout><AdminFacilities /></AdminLayout>} />
      <Route path="activities" element={<AdminLayout><AdminActivities /></AdminLayout>} />
      <Route path="news" element={<AdminLayout><AdminNews /></AdminLayout>} />
      <Route path="contact" element={<AdminLayout><AdminContact /></AdminLayout>} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  )
}

export default AdminApp
