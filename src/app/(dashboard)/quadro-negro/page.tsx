'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Pin,
  PinOff,
  Download,
  Upload,
  Search,
  Filter,
  Grid,
  List,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Note {
  id: string
  title: string
  content: string
  color: string
  pinned: boolean
  createdAt: string
  updatedAt: string
}

const COLORS = [
  'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
  'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
  'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
  'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700',
  'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
  'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
  'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
]

export default function QuadroNegroPage() {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sabio-notes')
      if (saved) return JSON.parse(saved)
    }
    return []
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({ title: '', content: '', color: COLORS[0] })
  const [showNewNote, setShowNewNote] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    localStorage.setItem('sabio-notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editingNote, showNewNote])

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPinned = !showPinnedOnly || note.pinned
      return matchesSearch && matchesPinned
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  const handleCreateNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return
    const note: Note = {
      id: crypto.randomUUID(),
      title: newNote.title,
      content: newNote.content,
      color: newNote.color,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes([note, ...notes])
    setNewNote({ title: '', content: '', color: COLORS[0] })
    setShowNewNote(false)
  }

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
      )
    )
    setEditingNote(null)
  }

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() } : note
      )
    )
  }

  const handleDuplicate = (note: Note) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      title: `${note.title} (cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
  }

  const handleExport = () => {
    const data = JSON.stringify(notes, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sabio-notes-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        if (Array.isArray(imported)) {
          setNotes((prev) => [...imported, ...prev])
        }
      } catch {
        alert('Arquivo inválido')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">📝 Quadro Negro</h1>
          <p className="text-muted-foreground">Suas anotações, ideias e rascunhos organizados</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <label className="flex items-center gap-1 cursor-pointer">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImport} className="sr-only" />
            <Button variant="outline" size="sm">Importar</Button>
          </label>
          <Button onClick={() => setShowNewNote(true)} className="gap-1">
            <Plus className="w-4 h-4" />
            Nova Nota
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar notas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={showPinnedOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className="gap-1"
              >
                <Pin className="w-4 h-4" />
                Fixadas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Note Form */}
      {showNewNote && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Nova Nota
              <Button variant="ghost" size="icon" onClick={() => setShowNewNote(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="noteTitle">Título</Label>
              <Input
                id="noteTitle"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                placeholder="Título da nota"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noteContent">Conteúdo</Label>
              <Textarea
                id="noteContent"
                ref={textareaRef}
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="Escreva sua nota..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewNote({ ...newNote, color })}
                    className={cn(
                      'w-8 h-8 rounded-lg border-2 transition-all',
                      newNote.color === color ? 'border-primary scale-110' : 'border-transparent hover:border-border'
                    )}
                    style={{ backgroundColor: color.replace('bg-', '').replace('dark:', '').split(' ')[0] }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewNote(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateNote}>
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Grid/List */}
      {filteredNotes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Edit2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery || showPinnedOnly ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || showPinnedOnly
                ? 'Tente ajustar sua busca ou filtros'
                : 'Crie sua primeira nota clicando em "Nova Nota"'}
            </p>
            {!searchQuery && !showPinnedOnly && (
              <Button onClick={() => setShowNewNote(true)} className="gap-1">
                <Plus className="w-4 h-4" />
                Criar Primeira Nota
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={cn(viewMode === 'grid' ? 'grid gap-4' : 'space-y-3', viewMode === 'grid' && 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4')}>
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={setEditingNote}
              onDelete={handleDeleteNote}
              onTogglePin={handleTogglePin}
              onDuplicate={handleDuplicate}
              editingNote={editingNote}
              onUpdate={handleUpdateNote}
              onCancelEdit={() => setEditingNote(null)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onDuplicate,
  editingNote,
  onUpdate,
  onCancelEdit,
}: {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onDuplicate: (note: Note) => void
  editingNote: Note | null
  onUpdate: (id: string, updates: Partial<Note>) => void
  onCancelEdit: () => void
}) {
  const [localTitle, setLocalTitle] = useState(note.title)
  const [localContent, setLocalContent] = useState(note.content)
  const [localColor, setLocalColor] = useState(note.color)
  const isEditing = editingNote?.id === note.id

  const colorStyle = note.color
    .replace('bg-', '')
    .replace('dark:', '')
    .split(' ')[0]

  if (isEditing) {
    return (
      <Card
        className={cn(
          'relative border-2 border-primary',
          note.color.replace('bg-', 'bg-').replace('dark:', '').split(' ')[0]
        )}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              placeholder="Título"
              className="flex-1"
              autoFocus
            />
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => onUpdate(note.id, { title: localTitle, content: localContent, color: localColor })} title="Salvar">
                <Save className="w-4 h-4 text-green-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onCancelEdit} title="Cancelar">
                <X className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <Textarea
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            placeholder="Conteúdo"
            rows={4}
            className="bg-background"
          />
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLocalColor(color)}
                className={cn(
                  'w-6 h-6 rounded border-2 transition-all',
                  localColor === color ? 'border-primary scale-110' : 'border-transparent'
                )}
                style={{ backgroundColor: color.replace('bg-', '').replace('dark:', '').split(' ')[0] }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'relative transition-all hover:shadow-lg',
        note.pinned && 'ring-2 ring-primary/50',
        note.color
      )}
      style={{ backgroundColor: colorStyle }}
    >
      {note.pinned && (
        <div className="absolute -top-2 -right-2">
          <Pin className="w-5 h-5 text-primary" />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground flex-1 pr-2 truncate">{note.title || 'Sem título'}</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(note)} title="Editar">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDuplicate(note)} title="Duplicar">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onTogglePin(note.id)} title={note.pinned ? 'Desfixar' : 'Fixar'}>
              {note.pinned ? <PinOff className="w-4 h-4 text-primary" /> : <Pin className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(note.id)} title="Excluir" className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">{note.content}</p>
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>Atualizado: {new Date(note.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </CardContent>
    </Card>
  )
}