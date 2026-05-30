/**
 * adminApi.js — Fungsi API khusus admin panel (semua request pakai JWT token)
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ── Token management ────────────────────────────────────
function getToken() {
  return localStorage.getItem("admin_token")
}

export function setToken(token) {
  localStorage.setItem("admin_token", token)
}

export function clearToken() {
  localStorage.removeItem("admin_token")
}

export function isLoggedIn() {
  return !!getToken()
}

// ── Headers dengan auth ─────────────────────────────────
function authHeaders(extra = {}) {
  const token = getToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

function authHeadersMultipart() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── Response handler ────────────────────────────────────
async function handleResponse(res) {
  if (res.status === 401) {
    clearToken()
    window.location.href = "/admin/login"
    throw new Error("Sesi berakhir, silakan login kembali")
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  if (res.status === 204) return true
  return res.json()
}


// ═══════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════

export async function login(username, password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Login gagal")
  }
  const data = await res.json()
  setToken(data.access_token)
  return data
}

export async function getMe() {
  return handleResponse(
    await fetch(`${API_URL}/admin/me`, { headers: authHeaders() })
  )
}


// ═══════════════════════════════════════════════════════
//  MEDIA
// ═══════════════════════════════════════════════════════

export function getMediaUrl(mediaId) {
  if (!mediaId) return null
  return `${API_URL}/media/${mediaId}`
}

export async function uploadMedia(file) {
  const form = new FormData()
  form.append("file", file)
  return handleResponse(
    await fetch(`${API_URL}/admin/media`, {
      method: "POST",
      headers: authHeadersMultipart(),
      body: form,
    })
  )
}

export async function listMedia(skip = 0, limit = 50) {
  const params = new URLSearchParams({ skip, limit })
  return handleResponse(
    await fetch(`${API_URL}/admin/media?${params}`, { headers: authHeaders() })
  )
}

export async function deleteMedia(id) {
  return handleResponse(
    await fetch(`${API_URL}/admin/media/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
  )
}


// ═══════════════════════════════════════════════════════
//  SITE CONTENT
// ═══════════════════════════════════════════════════════

export async function getAllSiteContent() {
  return handleResponse(
    await fetch(`${API_URL}/admin/site-content`, { headers: authHeaders() })
  )
}

export async function updateSiteContent(section, data) {
  return handleResponse(
    await fetch(`${API_URL}/admin/site-content/${section}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ data }),
    })
  )
}


// ═══════════════════════════════════════════════════════
//  HERO SLIDES
// ═══════════════════════════════════════════════════════

export async function getHeroSlides() {
  return handleResponse(
    await fetch(`${API_URL}/admin/hero-slides`, { headers: authHeaders() })
  )
}

export async function createHeroSlide(data) {
  return handleResponse(
    await fetch(`${API_URL}/admin/hero-slides`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  )
}

export async function updateHeroSlide(id, data) {
  return handleResponse(
    await fetch(`${API_URL}/admin/hero-slides/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  )
}

export async function deleteHeroSlide(id) {
  return handleResponse(
    await fetch(`${API_URL}/admin/hero-slides/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
  )
}

export async function reorderHeroSlides(order) {
  return handleResponse(
    await fetch(`${API_URL}/admin/hero-slides-reorder`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ order }),
    })
  )
}


// ═══════════════════════════════════════════════════════
//  NEWS
// ═══════════════════════════════════════════════════════

export async function getNews(skip = 0, limit = 20) {
  const params = new URLSearchParams({ skip, limit })
  return handleResponse(
    await fetch(`${API_URL}/admin/news?${params}`, { headers: authHeaders() })
  )
}

export async function createNews(data) {
  return handleResponse(
    await fetch(`${API_URL}/admin/news`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  )
}

export async function updateNews(id, data) {
  return handleResponse(
    await fetch(`${API_URL}/admin/news/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  )
}

export async function deleteNews(id) {
  return handleResponse(
    await fetch(`${API_URL}/admin/news/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
  )
}


// ═══════════════════════════════════════════════════════
//  FACILITIES
// ═══════════════════════════════════════════════════════

export async function getFacilities(skip = 0, limit = 50) {
  const params = new URLSearchParams({ skip, limit })
  return handleResponse(
    await fetch(`${API_URL}/admin/facilities?${params}`, { headers: authHeaders() })
  )
}

export async function createFacility(data) {
  return handleResponse(
    await fetch(`${API_URL}/admin/facilities`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  )
}

export async function updateFacility(id, data) {
  return handleResponse(
    await fetch(`${API_URL}/admin/facilities/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  )
}

export async function deleteFacility(id) {
  return handleResponse(
    await fetch(`${API_URL}/admin/facilities/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
  )
}


// ═══════════════════════════════════════════════════════
//  ACTIVITIES
// ═══════════════════════════════════════════════════════

export async function getActivities(skip = 0, limit = 50) {
  const params = new URLSearchParams({ skip, limit })
  return handleResponse(
    await fetch(`${API_URL}/admin/activities?${params}`, { headers: authHeaders() })
  )
}

export async function createActivity(data) {
  return handleResponse(
    await fetch(`${API_URL}/admin/activities`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  )
}

export async function updateActivity(id, data) {
  return handleResponse(
    await fetch(`${API_URL}/admin/activities/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  )
}

export async function deleteActivity(id) {
  return handleResponse(
    await fetch(`${API_URL}/admin/activities/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
  )
}


// ═══════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════

export async function getDashboardStats() {
  return handleResponse(
    await fetch(`${API_URL}/admin/dashboard-stats`, { headers: authHeaders() })
  )
}
