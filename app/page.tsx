"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Music, Search, Edit, Trash2, Volume2, Loader2, AlertCircle, Wifi, WifiOff, ArrowLeft, X } from "lucide-react"
import { songService, isSupabaseConfigured, type Song } from "@/lib/supabase"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentView, setCurrentView] = useState<"list" | "add" | "view" | "edit">("list")
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setIsLoading(true)
        const loadedSongs = await songService.getAllSongs()
        setSongs(loadedSongs)
        setError(null)
      } catch (error) {
        console.error("Error loading songs:", error)
        setError("Error al cargar las canciones. Usando almacenamiento local.")
      } finally {
        setIsLoading(false)
      }
    }
    loadSongs()
  }, [])

  const addSong = async (song: Omit<Song, "id">) => {
    try {
      setIsLoading(true)
      const newSong = await songService.createSong({
        ...song,
        category: song.category || "general",
      })
      setSongs((prev) => [...prev, newSong])
      setCurrentView("list")
      setError(null)
    } catch (error) {
      console.error("Error creating song:", error)
      setError("Error al crear la cancion. Intentalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateSong = async (updatedSong: Song) => {
    try {
      setIsLoading(true)
      const updated = await songService.updateSong(updatedSong.id, updatedSong)
      setSongs((prev) => prev.map((song) => (song.id === updatedSong.id ? updated : song)))
      setCurrentView("list")
      setError(null)
    } catch (error) {
      console.error("Error updating song:", error)
      setError("Error al actualizar la cancion. Intentalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSong = async (id: string) => {
    try {
      setIsLoading(true)
      await songService.deleteSong(id)
      setSongs((prev) => prev.filter((song) => song.id !== id))
      setCurrentView("list")
      setError(null)
    } catch (error) {
      console.error("Error deleting song:", error)
      setError("Error al eliminar la cancion. Intentalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  const filteredSongs = songs.filter((song) => {
    const normalizedTitle = normalizeText(song.title)
    const normalizedSearch = normalizeText(searchTerm)
    return normalizedTitle.includes(normalizedSearch)
  })

  const renderContent = () => {
    switch (currentView) {
      case "add":
        return <SongForm onSave={addSong} onCancel={() => setCurrentView("list")} />
      case "edit":
        return selectedSong ? (
          <SongForm song={selectedSong} onSave={updateSong} onCancel={() => setCurrentView("list")} />
        ) : null
      case "view":
        return selectedSong ? (
          <SongViewer
            song={selectedSong}
            onBack={() => setCurrentView("list")}
            onEdit={() => setCurrentView("edit")}
            onDelete={() => {
              if (confirm(`Estas seguro de que quieres eliminar "${selectedSong.title}"?`)) {
                deleteSong(selectedSong.id)
              }
            }}
          />
        ) : null
      default:
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Connection Status */}
            <div className="flex justify-center px-4">
              <Badge
                variant="outline"
                className={`flex items-center gap-2 px-3 py-1 text-xs ${
                  isSupabaseConfigured
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {isSupabaseConfigured ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    Base de datos conectada
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    Modo local
                  </>
                )}
              </Badge>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-4 mx-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Hero Section */}
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-contemplative to-reflective rounded-lg mb-4 sm:mb-6 shadow-lg">
                <span className="text-white text-xl sm:text-2xl font-light">+</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-contemplative px-4">
                Cancionero
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => setCurrentView("add")}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-contemplative to-reflective hover:opacity-90 shadow-lg text-white font-medium px-6 py-3 rounded-lg"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Nueva Cancion
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm sm:max-w-md mx-auto px-4">
              <Search className="absolute left-6 sm:left-7 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar canciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-10 h-10 sm:h-10 border border-contemplative/30 focus:border-contemplative rounded-lg shadow-sm bg-white"
              />
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-contemplative" />
                  <span className="text-contemplative">Cargando canciones...</span>
                </div>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="flex justify-center px-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-contemplative to-reflective text-white shadow-sm rounded-full"
                  >
                    {songs.length} {songs.length === 1 ? "cancion" : "canciones"} total
                  </Badge>
                </div>

                {/* Songs List */}
                {filteredSongs.length === 0 ? (
                  <div className="px-4">
                    <Card className="text-center py-12 sm:py-16 border border-contemplative/20 bg-white/80 rounded-lg">
                      <CardContent className="px-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-contemplative to-reflective rounded-lg mb-4">
                          <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-contemplative mb-3 px-4">
                          {songs.length === 0 ? "Comienza tu coleccion de canciones" : "No se encontraron canciones"}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-sm mx-auto px-4">
                          {songs.length === 0
                            ? "Crea tu primera cancion para la liturgia o la adoracion"
                            : "Intenta con otros terminos de busqueda"}
                        </p>
                        {songs.length === 0 && (
                          <Button
                            onClick={() => setCurrentView("add")}
                            className="w-full sm:w-auto bg-gradient-to-r from-contemplative to-reflective text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Primera Cancion
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-8 sm:space-y-12 px-4">
                    {/* Misa Section */}
                    {(() => {
                      const misaSongs = filteredSongs
                        .filter((song) => song.category === "misa")
                        .sort((a, b) => a.title.localeCompare(b.title, "es", { sensitivity: "base" }))
                      return (
                        misaSongs.length > 0 && (
                          <SongSection
                            title="Cancionero de Misa"
                            songs={misaSongs}
                            onView={(song) => { setSelectedSong(song); setCurrentView("view"); }}
                            onEdit={(song) => { setSelectedSong(song); setCurrentView("edit"); }}
                            onDelete={(song) => {
                              if (confirm(`Estas seguro de que quieres eliminar "${song.title}"?`)) {
                                deleteSong(song.id)
                              }
                            }}
                          />
                        )
                      )
                    })()}

                    {/* General Section */}
                    {(() => {
                      const generalSongs = filteredSongs
                        .filter((song) => song.category === "general" || !song.category)
                        .sort((a, b) => a.title.localeCompare(b.title, "es", { sensitivity: "base" }))
                      return (
                        generalSongs.length > 0 && (
                          <SongSection
                            title="Cancionero"
                            songs={generalSongs}
                            onView={(song) => { setSelectedSong(song); setCurrentView("view"); }}
                            onEdit={(song) => { setSelectedSong(song); setCurrentView("edit"); }}
                            onDelete={(song) => {
                              if (confirm(`Estas seguro de que quieres eliminar "${song.title}"?`)) {
                                deleteSong(song.id)
                              }
                            }}
                          />
                        )
                      )
                    })()}
                  </div>
                )}
              </>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-contemplative-50/10">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-10 max-w-7xl">{renderContent()}</div>
    </div>
  )
}

// Song Section Component
function SongSection({ 
  title, 
  songs, 
  onView, 
  onEdit, 
  onDelete 
}: { 
  title: string
  songs: Song[]
  onView: (song: Song) => void
  onEdit: (song: Song) => void
  onDelete: (song: Song) => void
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-contemplative to-reflective rounded-lg flex items-center justify-center shadow-lg">
            <Music className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-contemplative">{title}</h2>
        </div>
        <Badge variant="secondary" className="bg-contemplative/20 text-contemplative border-contemplative/30 w-fit">
          {songs.length} {songs.length === 1 ? "cancion" : "canciones"}
        </Badge>
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {songs.map((song) => (
          <Card key={song.id} className="group border border-contemplative/20 bg-white/90 overflow-hidden rounded-lg hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 px-3 sm:px-4 pt-3">
              <div className="absolute top-2 right-2 sm:right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {song.audio_file && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-contemplative rounded-full flex items-center justify-center">
                    <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="text-xs sm:text-sm font-semibold text-contemplative line-clamp-2 leading-tight pr-6">
                {song.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-4 pb-3">
              <div className="flex flex-col gap-2">
                {song.audio_file && (
                  <div className="w-full">
                    <audio controls className="w-full rounded shadow-sm" style={{ height: "24px" }} preload="none">
                      <source src={song.audio_file} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 sm:h-8 text-xs bg-white border-contemplative/30 text-contemplative hover:bg-contemplative/10"
                    onClick={() => onView(song)}
                  >
                    <Music className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 text-contemplative hover:bg-contemplative/10"
                    onClick={(e) => { e.stopPropagation(); onEdit(song); }}
                  >
                    <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 text-contemplative hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => { e.stopPropagation(); onDelete(song); }}
                  >
                    <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Song Form Component
function SongForm({ 
  song, 
  onSave, 
  onCancel 
}: { 
  song?: Song
  onSave: (song: any) => void
  onCancel: () => void 
}) {
  const [title, setTitle] = useState(song?.title || "")
  const [lyrics, setLyrics] = useState(song?.lyrics || "")
  const [category, setCategory] = useState<"misa" | "general">(song?.category || "general")
  const [audioFile, setAudioFile] = useState(song?.audio_file || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (song) {
      onSave({ ...song, title, lyrics, category, audio_file: audioFile })
    } else {
      onSave({ title, lyrics, category, audio_file: audioFile })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-contemplative">
          {song ? "Editar Cancion" : "Nueva Cancion"}
        </h1>
      </div>
      
      <Card className="border border-contemplative/20">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titulo</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nombre de la cancion"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={(value: "misa" | "general") => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="misa">Cancionero de Misa</SelectItem>
                  <SelectItem value="general">Cancionero General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lyrics">Letra con acordes</Label>
              <Textarea
                id="lyrics"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder={`Escribe la letra con acordes en lineas separadas:

DO        SOL       LAm
Cada linea de acordes arriba
FA        SOL       DO
De su linea de letra correspondiente`}
                className="min-h-[300px] font-mono text-sm"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audio">URL del Audio (opcional)</Label>
              <Input
                id="audio"
                value={audioFile}
                onChange={(e) => setAudioFile(e.target.value)}
                placeholder="https://ejemplo.com/audio.mp3"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-contemplative to-reflective text-white">
                {song ? "Guardar Cambios" : "Crear Cancion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Song Viewer Component
function SongViewer({ 
  song, 
  onBack, 
  onEdit, 
  onDelete 
}: { 
  song: Song
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-contemplative to-reflective rounded-full flex items-center justify-center shadow-lg">
            <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-contemplative">{song.title}</h1>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" onClick={onEdit} className="border-contemplative/30 text-contemplative">
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Button variant="outline" onClick={onDelete} className="border-red-300 text-red-600 hover:bg-red-50">
          <Trash2 className="w-4 h-4 mr-2" />
          Eliminar
        </Button>
      </div>
      
      {song.audio_file && (
        <Card className="border border-contemplative/30">
          <CardHeader className="py-3">
            <CardTitle className="text-base flex items-center gap-2 text-contemplative">
              <Volume2 className="w-4 h-4" />
              Reproductor de Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <audio controls className="w-full" preload="metadata">
              <source src={song.audio_file} type="audio/mpeg" />
            </audio>
          </CardContent>
        </Card>
      )}
      
      <Card className="border border-contemplative/30">
        <CardContent className="p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
            {song.lyrics}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
