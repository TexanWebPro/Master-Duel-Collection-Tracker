import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { deleteNote, listNotes, saveNote, type Note } from '../server/notes'

export const Route = createFileRoute('/')({
  loader: () => listNotes(),
  component: Home,
})

function Home() {
  const notes = Route.useLoaderData()
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = notes.find((n) => n.id === selectedId) ?? null

  async function createNote() {
    const id = crypto.randomUUID()
    await saveNote({ data: { id, title: '', body: '' } })
    await router.invalidate()
    setSelectedId(id)
  }

  async function removeNote(id: string) {
    if (!window.confirm('Delete this note? This cannot be undone.')) return
    await deleteNote({ data: { id } })
    setSelectedId(null)
    await router.invalidate()
  }

  return (
    <div className="flex h-screen">
      <aside className="flex w-72 shrink-0 flex-col border-r border-line bg-rail">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-base font-semibold">Inkwell</h1>
          <button
            onClick={createNote}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent/90"
          >
            New note
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Notes">
          {notes.length === 0 && (
            <p className="px-2 py-6 text-sm text-muted">
              No notes yet. Choose New note to write your first one.
            </p>
          )}
          <ul className="space-y-0.5">
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => setSelectedId(n.id)}
                  aria-current={n.id === selectedId}
                  className={`block w-full rounded-md px-3 py-2 text-left ${
                    n.id === selectedId ? 'bg-accent-soft' : 'hover:bg-line/50'
                  }`}
                >
                  <span className="block truncate text-sm font-medium">
                    {n.title || 'Untitled'}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {formatDate(n.updatedAt)}
                    {n.body ? ` — ${n.body.replace(/\s+/g, ' ').slice(0, 40)}` : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        {selected ? (
          <Editor key={selected.id} note={selected} onDelete={() => removeNote(selected.id)} />
        ) : (
          <div className="flex h-full items-center justify-center px-8 text-center text-muted">
            {notes.length ? 'Select a note to keep writing.' : 'Your notes are saved on this computer.'}
          </div>
        )}
      </main>
    </div>
  )
}

function Editor({ note, onDelete }: { note: Note; onDelete: () => void }) {
  const router = useRouter()
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)
  const [status, setStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const lastSaved = useRef({ title: note.title, body: note.body })

  // Autosave 600ms after the last keystroke
  useEffect(() => {
    if (title === lastSaved.current.title && body === lastSaved.current.body) return
    setStatus('saving')
    const timer = setTimeout(async () => {
      try {
        await saveNote({ data: { id: note.id, title, body } })
        lastSaved.current = { title, body }
        setStatus('saved')
        router.invalidate()
      } catch {
        setStatus('error')
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [title, body, note.id, router])

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col px-10 py-8">
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className={status === 'error' ? 'text-danger' : 'text-muted'} role="status">
          {status === 'saving' && 'Saving…'}
          {status === 'saved' && 'Saved'}
          {status === 'error' && 'Could not save. Check that the disk has free space.'}
        </span>
        <button onClick={onDelete} className="rounded-md px-2 py-1 text-danger hover:bg-danger/10">
          Delete note
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Note title"
        className="mb-4 w-full bg-transparent font-prose text-3xl font-semibold outline-none placeholder:text-line"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Start writing"
        aria-label="Note body"
        className="w-full flex-1 resize-none bg-transparent font-prose text-lg leading-8 outline-none placeholder:text-line"
      />
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
