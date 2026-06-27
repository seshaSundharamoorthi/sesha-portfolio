import { useState, useEffect, useRef } from 'react'
import { Lock, Plus, Trash2, Edit3, Save, X, Upload, FileText, Image, Eye, EyeOff, CheckCircle, LogOut, Loader } from 'lucide-react'
import { getProjects, addProject, updateProject, deleteProject, getPhoto, savePhoto, getResume, saveResume, checkAdminPass } from '../utils/storage'

const EMPTY_FORM = { name: '', shortDesc: '', description: '', tech: '', github: '', demo: '', color: '#7C3AED' }
const COLORS = ['#7C3AED', '#EC4899', '#F97316', '#06B6D4', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B']

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [photo, setPhoto] = useState(null)
  const [resume, setResume] = useState({ data: null, name: '' })

  const [photoMsg, setPhotoMsg] = useState('')
  const [resumeMsg, setResumeMsg] = useState('')
  const [savingPhoto, setSavingPhoto] = useState(false)
  const [savingResume, setSavingResume] = useState(false)
  const [savingProject, setSavingProject] = useState(false)
  const [loadingData, setLoadingData] = useState(false)

  const photoRef = useRef()
  const resumeRef = useRef()

  useEffect(() => {
    if (loggedIn) loadAllData()
  }, [loggedIn])

  async function loadAllData() {
    setLoadingData(true)
    const [projs, p, r] = await Promise.all([getProjects(), getPhoto(), getResume()])
    setProjects(projs)
    setPhoto(p)
    setResume(r)
    setLoadingData(false)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (checkAdminPass(pass)) { setLoggedIn(true); setError('') }
    else setError('Wrong password! Try again.')
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setPhotoMsg('❌ Please select an image file!'); return }
    setSavingPhoto(true)
    setPhotoMsg('Uploading to cloud...')
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const ok = await savePhoto(ev.target.result)
      setPhoto(ev.target.result)
      setSavingPhoto(false)
      setPhotoMsg(ok ? '✅ Profile photo saved to cloud! Everyone can see it now.' : '❌ Upload failed. Try again.')
      setTimeout(() => setPhotoMsg(''), 4000)
    }
    reader.readAsDataURL(file)
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') { setResumeMsg('❌ Please select a PDF file!'); return }
    if (file.size > 4 * 1024 * 1024) { setResumeMsg('❌ File too large! Max 4MB.'); return }
    setSavingResume(true)
    setResumeMsg('Uploading to cloud...')
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const ok = await saveResume(ev.target.result, file.name)
      setResume({ data: ev.target.result, name: file.name })
      setSavingResume(false)
      setResumeMsg(ok ? '✅ Resume saved to cloud! Download button is now active.' : '❌ Upload failed. Try again.')
      setTimeout(() => setResumeMsg(''), 4000)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProject = async () => {
    if (!form.name || !form.description) { alert('Project name and description are required!'); return }
    setSavingProject(true)
    const projectData = { ...form, tech: form.tech.split(',').map(t => t.trim()).filter(Boolean) }
    if (editId) await updateProject(editId, projectData)
    else await addProject(projectData)
    const updated = await getProjects()
    setProjects(updated)
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(false)
    setSavingProject(false)
  }

  const handleEdit = (proj) => {
    setForm({ name: proj.name, shortDesc: proj.shortDesc || '', description: proj.description, tech: Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech, github: proj.github || '', demo: proj.demo || '', color: proj.color || '#7C3AED' })
    setEditId(proj.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    await deleteProject(id)
    setProjects(await getProjects())
  }

  // LOGIN
  if (!loggedIn) return (
    <main style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: 400, height: 400, background: '#7C3AED', top: -100, left: -100 }} />
      <div className="blob" style={{ width: 300, height: 300, background: '#EC4899', bottom: -50, right: -50 }} />
      <div style={{ background: '#fff', borderRadius: 24, padding: 48, boxShadow: '0 20px 60px rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.1)', width: '100%', maxWidth: 400, position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#fff' }}>
          <Lock size={28} />
        </div>
        <h2 style={{ fontWeight: 900, fontSize: 24, color: '#1a1a2e', marginBottom: 8 }}>Admin Panel</h2>
        <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 32 }}>Enter your password to continue</p>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <input className="input-style" type={showPass ? 'text' : 'password'} placeholder="Enter admin password" value={pass} onChange={e => { setPass(e.target.value); setError('') }} style={{ paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: 13 }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}><Lock size={16} /> Login</button>
        </form>
        <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 20 }}>Default password: <code style={{ background: '#f8fafc', padding: '2px 6px', borderRadius: 4 }}>sesha123</code></p>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: 'calc(100vh - 64px)', background: '#fafafa' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: 28, color: '#1a1a2e' }}>Admin Panel</h1>
            <p style={{ color: '#9ca3af', fontSize: 14 }}>☁️ All changes save to cloud — visible to everyone instantly!</p>
          </div>
          <button onClick={() => setLoggedIn(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>
            <LogOut size={15} /> Logout
          </button>
        </div>

        {loadingData ? (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #7C3AED', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#9ca3af' }}>Loading your data from cloud...</p>
          </div>
        ) : (
          <>
            {/* PHOTO */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f1f5f9', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f3f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Image size={18} color="#7C3AED" /></div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e' }}>Profile Photo</h3>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>Saved to cloud ☁️ — shows on Home & About pages for all visitors</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: photo ? 'transparent' : 'linear-gradient(135deg, #7C3AED, #EC4899)', border: '3px solid #e9d5ff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {photo ? <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontWeight: 800, fontSize: 24 }}>SS</span>}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <input type="file" ref={photoRef} accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <button onClick={() => photoRef.current.click()} className="btn-primary" style={{ marginBottom: 8 }} disabled={savingPhoto}>
                    {savingPhoto ? <><Loader size={16} className="spin" /> Uploading...</> : <><Upload size={16} /> {photo ? 'Change Photo' : 'Upload Photo'}</>}
                  </button>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>JPG, PNG, WebP — any size</p>
                  {photoMsg && <p style={{ fontSize: 13, color: photoMsg.includes('✅') ? '#16a34a' : '#ef4444', marginTop: 8 }}>{photoMsg}</p>}
                </div>
              </div>
            </div>

            {/* RESUME */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f1f5f9', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fdf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} color="#a21caf" /></div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e' }}>Resume / CV</h3>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>Saved to cloud ☁️ — Download button on Home page works for all visitors</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {resume.data ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12 }}>
                    <FileText size={18} color="#16a34a" />
                    <span style={{ fontSize: 14, color: '#16a34a', fontWeight: 600 }}>{resume.name}</span>
                  </div>
                ) : (
                  <div style={{ padding: '10px 16px', background: '#fff7ed', border: '1px dashed #fdba74', borderRadius: 12 }}>
                    <span style={{ fontSize: 13, color: '#ea580c' }}>No resume uploaded yet</span>
                  </div>
                )}
                <div>
                  <input type="file" ref={resumeRef} accept="application/pdf" onChange={handleResumeUpload} style={{ display: 'none' }} />
                  <button onClick={() => resumeRef.current.click()} className="btn-primary" style={{ background: 'linear-gradient(135deg, #a21caf, #7C3AED)' }} disabled={savingResume}>
                    {savingResume ? <><Loader size={16} /> Uploading...</> : <><Upload size={16} /> {resume.data ? 'Replace Resume' : 'Upload Resume'}</>}
                  </button>
                  <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>PDF only · Max 4MB</p>
                  {resumeMsg && <p style={{ fontSize: 13, color: resumeMsg.includes('✅') ? '#16a34a' : '#ef4444', marginTop: 6 }}>{resumeMsg}</p>}
                </div>
              </div>
            </div>

            {/* PROJECTS */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1a1a2e' }}>Projects</h3>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{projects.length} projects · Saved to cloud ☁️</p>
                </div>
                {!showForm && (
                  <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM) }} className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
                    <Plus size={16} /> Add New Project
                  </button>
                )}
              </div>

              {showForm && (
                <div style={{ background: '#fafafa', borderRadius: 16, padding: 24, marginBottom: 24, border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 20 }}>{editId ? '✏️ Edit Project' : '➕ Add New Project'}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Project Name *</label>
                      <input className="input-style" placeholder="My Awesome Project" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Short Description</label>
                      <input className="input-style" placeholder="One-line summary" value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Full Description *</label>
                      <textarea className="input-style" placeholder="Describe what this project does..." rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Technologies (comma separated)</label>
                      <input className="input-style" placeholder="React, Node.js, MongoDB" value={form.tech} onChange={e => setForm({ ...form, tech: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Card Color</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        {COLORS.map(c => (
                          <button key={c} onClick={() => setForm({ ...form, color: c })} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer', outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: 2 }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>GitHub Link</label>
                      <input className="input-style" placeholder="https://github.com/..." value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Live Demo Link</label>
                      <input className="input-style" placeholder="https://myproject.vercel.app" value={form.demo} onChange={e => setForm({ ...form, demo: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button onClick={handleSaveProject} className="btn-primary" disabled={savingProject}>
                      {savingProject ? <><Loader size={15} /> Saving to cloud...</> : <><Save size={15} /> {editId ? 'Update Project' : 'Save Project'}</>}
                    </button>
                    <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false) }} className="btn-outline"><X size={15} /> Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {projects.map(proj => (
                  <div key={proj.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 14, border: '1px solid #f1f5f9', background: '#fafafa' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: proj.color || '#7C3AED', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>{proj.name}</p>
                      <p style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => handleEdit(proj)} style={{ padding: '7px 14px', borderRadius: 8, background: '#f3f0ff', border: 'none', cursor: 'pointer', color: '#7C3AED', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Edit3 size={13} /> Edit</button>
                      <button onClick={() => handleDelete(proj.id, proj.name)} style={{ padding: '7px 14px', borderRadius: 8, background: '#fef2f2', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}><Trash2 size={13} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 0.8s linear infinite; }`}</style>
    </main>
  )
}
