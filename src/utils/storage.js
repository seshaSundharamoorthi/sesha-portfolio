import { DEFAULT_PROJECTS } from '../data/defaults'

// ============================================================
// JSONBin Cloud Storage — data visible to ALL visitors!
// Free at jsonbin.io
// ============================================================

const API_KEY = '$2a$10$7nljiQRl2JPCQe1.zlMTxeKbnz4EVUdqewdjVuDYYv6/of4yNefcK'
const BASE_URL = 'https://api.jsonbin.io/v3'

// We use ONE bin for all data: { projects, photo, resumeUrl, resumeName }
const BIN_KEY = 'ss_portfolio_bin_id'

async function createBin(data) {
  const res = await fetch(`${BASE_URL}/b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY,
      'X-Bin-Name': 'sesha-portfolio',
      'X-Bin-Private': 'false',
    },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  return json.metadata?.id || null
}

async function getBinId() {
  let id = localStorage.getItem(BIN_KEY)
  if (id) return id

  // Try to find existing bin by name
  try {
    const res = await fetch(`${BASE_URL}/b`, {
      headers: { 'X-Master-Key': API_KEY }
    })
    // If no existing bin found, create new one
  } catch (_) {}

  // Create new bin with default data
  const defaultData = {
    projects: DEFAULT_PROJECTS,
    photo: null,
    resumeData: null,
    resumeName: 'Resume.pdf',
  }
  id = await createBin(defaultData)
  if (id) localStorage.setItem(BIN_KEY, id)
  return id
}

async function readBin() {
  try {
    const id = await getBinId()
    if (!id) return null
    const res = await fetch(`${BASE_URL}/b/${id}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    })
    const json = await res.json()
    return json.record || null
  } catch (_) { return null }
}

async function writeBin(data) {
  try {
    const id = await getBinId()
    if (!id) return false
    await fetch(`${BASE_URL}/b/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
      body: JSON.stringify(data),
    })
    return true
  } catch (_) { return false }
}

// Cache to avoid too many API calls
let _cache = null
let _cacheTime = 0
const CACHE_TTL = 30000 // 30 seconds

async function getData() {
  const now = Date.now()
  if (_cache && (now - _cacheTime) < CACHE_TTL) return _cache
  const data = await readBin()
  if (data) {
    _cache = data
    _cacheTime = now
  }
  return data || { projects: DEFAULT_PROJECTS, photo: null, resumeData: null, resumeName: 'Resume.pdf' }
}

async function setData(updates) {
  const current = await getData()
  const newData = { ...current, ...updates }
  await writeBin(newData)
  _cache = newData
  _cacheTime = Date.now()
  return true
}

// ============================================================
// PROJECTS
// ============================================================
export async function getProjects() {
  const data = await getData()
  return (data.projects && data.projects.length > 0) ? data.projects : DEFAULT_PROJECTS
}

export async function saveProjects(projects) {
  return await setData({ projects })
}

export async function addProject(project) {
  const projects = await getProjects()
  const newProj = { ...project, id: 'proj_' + Date.now() }
  await saveProjects([...projects, newProj])
  return newProj
}

export async function updateProject(id, updates) {
  const projects = await getProjects()
  await saveProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p))
}

export async function deleteProject(id) {
  const projects = await getProjects()
  await saveProjects(projects.filter(p => p.id !== id))
}

// ============================================================
// PHOTO
// ============================================================
export async function getPhoto() {
  const data = await getData()
  return data.photo || null
}

export async function savePhoto(base64) {
  return await setData({ photo: base64 })
}

// ============================================================
// RESUME
// ============================================================
export async function getResume() {
  const data = await getData()
  return {
    data: data.resumeData || null,
    name: data.resumeName || 'Resume.pdf',
  }
}

export async function saveResume(base64, name) {
  return await setData({ resumeData: base64, resumeName: name })
}

// ============================================================
// ADMIN PASSWORD (kept local — only admin needs this)
// ============================================================
export function checkAdminPass(pass) {
  const stored = localStorage.getItem('ss_admin_pass') || 'sesha123'
  return pass === stored
}

export function setAdminPass(newPass) {
  localStorage.setItem('ss_admin_pass', newPass)
}
