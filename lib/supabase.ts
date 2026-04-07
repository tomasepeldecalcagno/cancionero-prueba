import { createClient } from '@supabase/supabase-js'

// Verificar que las variables de entorno esten configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar si Supabase esta configurado correctamente
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') && 
  supabaseUrl.includes('supabase') &&
  supabaseAnonKey.length > 20
)

// Crear cliente de Supabase
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

// Tipos para TypeScript
export interface Song {
  id: string
  title: string
  artist?: string
  lyrics: string
  original_key?: string
  audio_file?: string
  audio_file_name?: string
  category: 'misa' | 'general'
  created_at?: string
  updated_at?: string
}

// Funciones para localStorage como fallback
const localStorageService = {
  async getAllSongs(): Promise<Song[]> {
    if (typeof window === 'undefined') return []
    try {
      const savedSongs = localStorage.getItem("cancionero-songs")
      return savedSongs ? JSON.parse(savedSongs) : []
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return []
    }
  },

  async createSong(song: Omit<Song, 'id' | 'created_at' | 'updated_at'>): Promise<Song> {
    const newSong: Song = {
      ...song,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    if (typeof window !== 'undefined') {
      try {
        const savedSongs = localStorage.getItem("cancionero-songs")
        const songs = savedSongs ? JSON.parse(savedSongs) : []
        songs.push(newSong)
        localStorage.setItem("cancionero-songs", JSON.stringify(songs))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
    
    return newSong
  },

  async updateSong(id: string, song: Partial<Song>): Promise<Song> {
    if (typeof window === 'undefined') throw new Error('Not available on server')
    
    try {
      const savedSongs = localStorage.getItem("cancionero-songs")
      const songs = savedSongs ? JSON.parse(savedSongs) : []
      const index = songs.findIndex((s: Song) => s.id === id)
      
      if (index !== -1) {
        songs[index] = { ...songs[index], ...song, updated_at: new Date().toISOString() }
        localStorage.setItem("cancionero-songs", JSON.stringify(songs))
        return songs[index]
      }
      
      throw new Error('Song not found')
    } catch (error) {
      console.error('Error updating in localStorage:', error)
      throw error
    }
  },

  async deleteSong(id: string): Promise<void> {
    if (typeof window === 'undefined') return
    
    try {
      const savedSongs = localStorage.getItem("cancionero-songs")
      const songs = savedSongs ? JSON.parse(savedSongs) : []
      const filteredSongs = songs.filter((s: Song) => s.id !== id)
      localStorage.setItem("cancionero-songs", JSON.stringify(filteredSongs))
    } catch (error) {
      console.error('Error deleting from localStorage:', error)
    }
  }
}

// Servicio principal de canciones
export const songService = {
  // Obtener todas las canciones
  async getAllSongs(): Promise<Song[]> {
    if (!supabase) {
      console.log('Using localStorage (Supabase not configured)')
      return localStorageService.getAllSongs()
    }

    try {
      console.log('Fetching songs from Supabase...')
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('title', { ascending: true })

      if (error) {
        console.error('Error fetching songs from Supabase:', error)
        console.log('Falling back to localStorage')
        return localStorageService.getAllSongs()
      }

      console.log(`Loaded ${data?.length || 0} songs from Supabase`)
      return data || []
    } catch (error) {
      console.error('Error connecting to Supabase:', error)
      console.log('Falling back to localStorage')
      return localStorageService.getAllSongs()
    }
  },

  // Crear una nueva cancion
  async createSong(song: Omit<Song, 'id' | 'created_at' | 'updated_at'>): Promise<Song> {
    if (!supabase) {
      console.log('Creating song in localStorage')
      return localStorageService.createSong(song)
    }

    try {
      console.log('Creating song in Supabase...')
      const { data, error } = await supabase
        .from('songs')
        .insert([{
          title: song.title,
          artist: song.artist,
          lyrics: song.lyrics,
          original_key: song.original_key,
          audio_file: song.audio_file,
          audio_file_name: song.audio_file_name,
          category: song.category
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating song in Supabase:', error)
        console.log('Falling back to localStorage')
        return localStorageService.createSong(song)
      }

      console.log('Song created in Supabase:', data.title)
      return data
    } catch (error) {
      console.error('Error creating song in Supabase:', error)
      console.log('Falling back to localStorage')
      return localStorageService.createSong(song)
    }
  },

  // Actualizar una cancion
  async updateSong(id: string, song: Partial<Song>): Promise<Song> {
    if (!supabase) {
      console.log('Updating song in localStorage')
      return localStorageService.updateSong(id, song)
    }

    try {
      console.log('Updating song in Supabase...')
      const { data, error } = await supabase
        .from('songs')
        .update({
          title: song.title,
          artist: song.artist,
          lyrics: song.lyrics,
          original_key: song.original_key,
          audio_file: song.audio_file,
          audio_file_name: song.audio_file_name,
          category: song.category
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating song in Supabase:', error)
        console.log('Falling back to localStorage')
        return localStorageService.updateSong(id, song)
      }

      console.log('Song updated in Supabase:', data.title)
      return data
    } catch (error) {
      console.error('Error updating song in Supabase:', error)
      console.log('Falling back to localStorage')
      return localStorageService.updateSong(id, song)
    }
  },

  // Eliminar una cancion
  async deleteSong(id: string): Promise<void> {
    if (!supabase) {
      console.log('Deleting song from localStorage')
      return localStorageService.deleteSong(id)
    }

    try {
      console.log('Deleting song from Supabase...')
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting song from Supabase:', error)
        console.log('Falling back to localStorage')
        return localStorageService.deleteSong(id)
      }

      console.log('Song deleted from Supabase')
    } catch (error) {
      console.error('Error deleting song from Supabase:', error)
      console.log('Falling back to localStorage')
      return localStorageService.deleteSong(id)
    }
  }
}
