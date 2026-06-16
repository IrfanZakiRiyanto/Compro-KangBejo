const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ── Helpers ──────────────────────────────────────────
async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  if (res.status === 204) return true
  return res.json()
}

function buildParams(obj) {
  const p = new URLSearchParams()
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") p.append(k, v)
  })
  return p.toString()
}

// ── HEALTH ────────────────────────────────────────────
export async function checkHealth() {
  try {
    const res = await fetch(`${API_URL}/health`)
    const data = await res.json()
    return data.status === "healthy"
  } catch {
    return false
  }
}

// ── ABOUT ─────────────────────────────────────────────
export async function fetchAbout() {
  return handleResponse(await fetch(`${API_URL}/about`))
}

// ── STATS ─────────────────────────────────────────────
export async function fetchStats() {
  return handleResponse(await fetch(`${API_URL}/stats`))
}

// ── SITE CONTENT ──────────────────────────────────────
export async function fetchSiteContent() {
  return handleResponse(await fetch(`${API_URL}/site-content`))
}

export async function fetchSiteContentSection(section) {
  return handleResponse(await fetch(`${API_URL}/site-content/${section}`))
}

// ── HERO SLIDES ───────────────────────────────────────
export async function fetchHeroSlides() {
  return handleResponse(await fetch(`${API_URL}/hero-slides`))
}

// ── NEWS ──────────────────────────────────────────────
export async function fetchNews({ skip = 0, limit = 20 } = {}) {
  const q = buildParams({ skip, limit })
  return handleResponse(await fetch(`${API_URL}/news?${q}`))
}

export async function fetchSingleNews(id) {
  return handleResponse(await fetch(`${API_URL}/news/${id}`))
}

// ── MEDIA URL HELPER ──────────────────────────────────
export function getMediaUrl(mediaId) {
  if (!mediaId) return null
  return `${API_URL}/media/${mediaId}`
}

// ── FACILITIES ────────────────────────────────────────
export async function fetchFacilities({ search = "", skip = 0, limit = 50, active_only = true } = {}) {
  const q = buildParams({ search, skip, limit, active_only })
  return handleResponse(await fetch(`${API_URL}/facilities?${q}`))
}

export async function fetchFacility(id) {
  return handleResponse(await fetch(`${API_URL}/facilities/${id}`))
}

export async function createFacility(data) {
  return handleResponse(await fetch(`${API_URL}/facilities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }))
}

export async function updateFacility(id, data) {
  return handleResponse(await fetch(`${API_URL}/facilities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }))
}

export async function deleteFacility(id) {
  return handleResponse(await fetch(`${API_URL}/facilities/${id}`, { method: "DELETE" }))
}

// ── ACTIVITIES ────────────────────────────────────────
export async function fetchActivities({ search = "", skip = 0, limit = 50, active_only = true } = {}) {
  const q = buildParams({ search, skip, limit, active_only })
  return handleResponse(await fetch(`${API_URL}/activities?${q}`))
}

export async function fetchActivity(id) {
  return handleResponse(await fetch(`${API_URL}/activities/${id}`))
}

export async function createActivity(data) {
  return handleResponse(await fetch(`${API_URL}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }))
}

export async function updateActivity(id, data) {
  return handleResponse(await fetch(`${API_URL}/activities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }))
}

export async function deleteActivity(id) {
  return handleResponse(await fetch(`${API_URL}/activities/${id}`, { method: "DELETE" }))
}
