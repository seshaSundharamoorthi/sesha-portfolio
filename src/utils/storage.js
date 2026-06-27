import { createClient } from '@supabase/supabase-js'
import { DEFAULT_PROJECTS } from '../data/defaults'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-ref')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn(
    'Supabase credentials not configured or using default placeholders. Using mock/default data fallback.'
  )
}

// Helper to extract file name from Supabase storage URL
function getFilenameFromUrl(url) {
  if (!url) return null
  try {
    const parts = url.split('/')
    return parts[parts.length - 1].split('?')[0] // Remove query parameters if any
  } catch (_) {
    return null
  }
}

// Fetch the single row of metadata
async function getMetadata() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('portfolio_metadata')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      // PGRST116 means 0 rows returned
      if (error.code === 'PGRST116') {
        const { data: newRow, error: insertError } = await supabase
          .from('portfolio_metadata')
          .insert([{ id: 1 }])
          .select()
          .single()
        if (!insertError) return newRow
      }
      throw error
    }
    return data
  } catch (err) {
    console.error('Error fetching portfolio metadata:', err)
    return null
  }
}

// ============================================================
// PROJECTS
// ============================================================
export async function getProjects() {
  if (!supabase) return DEFAULT_PROJECTS
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data && data.length > 0 ? data : DEFAULT_PROJECTS
  } catch (err) {
    console.error('Error fetching projects from Supabase:', err)
    return DEFAULT_PROJECTS
  }
}

export async function addProject(project) {
  if (!supabase) {
    console.error('Supabase not configured')
    return null
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error adding project:', err)
    return null
  }
}

export async function updateProject(id, updates) {
  if (!supabase) {
    console.error('Supabase not configured')
    return
  }
  try {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  } catch (err) {
    console.error('Error updating project:', err)
  }
}

export async function deleteProject(id) {
  if (!supabase) {
    console.error('Supabase not configured')
    return
  }
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  } catch (err) {
    console.error('Error deleting project:', err)
  }
}

// ============================================================
// PHOTO
// ============================================================
export async function getPhoto() {
  const metadata = await getMetadata()
  return metadata?.photo_url || null
}

export async function savePhoto(file) {
  if (!supabase) {
    console.error('Supabase not configured')
    return false
  }
  try {
    // 1. Delete old photo if it exists to avoid storage pollution
    const metadata = await getMetadata()
    const oldFilename = getFilenameFromUrl(metadata?.photo_url)
    if (oldFilename) {
      await supabase.storage.from('portfolio-assets').remove([oldFilename])
    }

    // 2. Generate a unique filename
    const fileExt = file.name ? file.name.split('.').pop() : 'png'
    const fileName = `profile-photo-${Date.now()}.${fileExt}`

    // 3. Upload new photo to Supabase Storage bucket
    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) throw uploadError

    // 4. Retrieve public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(fileName)

    // 5. Update metadata table
    const { error: dbError } = await supabase
      .from('portfolio_metadata')
      .update({ photo_url: publicUrl })
      .eq('id', 1)

    if (dbError) throw dbError
    return true
  } catch (err) {
    console.error('Error saving photo to Supabase:', err)
    return false
  }
}

// ============================================================
// RESUME
// ============================================================
export async function getResume() {
  const metadata = await getMetadata()
  return {
    data: metadata?.resume_url || null,
    name: metadata?.resume_name || 'Resume.pdf',
  }
}

export async function saveResume(file, name) {
  if (!supabase) {
    console.error('Supabase not configured')
    return false
  }
  try {
    // 1. Delete old resume if it exists to avoid storage pollution
    const metadata = await getMetadata()
    const oldFilename = getFilenameFromUrl(metadata?.resume_url)
    if (oldFilename) {
      await supabase.storage.from('portfolio-assets').remove([oldFilename])
    }

    // 2. Generate a unique filename
    const fileExt = file.name ? file.name.split('.').pop() : 'pdf'
    const fileName = `resume-${Date.now()}.${fileExt}`

    // 3. Upload new resume to Supabase Storage bucket
    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) throw uploadError

    // 4. Retrieve public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(fileName)

    // 5. Update metadata table
    const { error: dbError } = await supabase
      .from('portfolio_metadata')
      .update({ resume_url: publicUrl, resume_name: name })
      .eq('id', 1)

    if (dbError) throw dbError
    return true
  } catch (err) {
    console.error('Error saving resume to Supabase:', err)
    return false
  }
}

// ============================================================
// ADMIN AUTHENTICATION
// ============================================================
export async function loginAdmin(email, password) {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured yet. Check .env.local' }
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) throw error
    return { success: true, user: data.user }
  } catch (err) {
    console.error('Admin login failed:', err)
    return { success: false, error: err.message || 'Authentication failed' }
  }
}

export async function logoutAdmin() {
  if (!supabase) return
  try {
    await supabase.auth.signOut()
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

export async function getAdminSession() {
  if (!supabase) return null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  } catch (_) {
    return null
  }
}
