import { createServerFn } from '@tanstack/react-start'

export type Note = {
  id: string
  title: string
  body: string
  updatedAt: string
}

type NoteInput = { id: string; title: string; body: string }

const ID_PATTERN = /^[a-zA-Z0-9-]{8,64}$/

// Everything below runs on the server (inside Electron's Node process),
// never in the renderer.
async function notesDir() {
  const fs = await import('node:fs/promises')
  const path = await import('node:path')
  const dir = process.env.NOTES_DATA_DIR ?? path.join(process.cwd(), '.data', 'notes')
  await fs.mkdir(dir, { recursive: true })
  return dir
}

async function fileFor(id: string) {
  if (!ID_PATTERN.test(id)) throw new Error('Invalid note id')
  const path = await import('node:path')
  return path.join(await notesDir(), `${id}.json`)
}

export const listNotes = createServerFn({ method: 'GET' }).handler(async () => {
  const fs = await import('node:fs/promises')
  const path = await import('node:path')
  const dir = await notesDir()
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.json'))

  const notes: Note[] = []
  for (const file of files) {
    try {
      notes.push(JSON.parse(await fs.readFile(path.join(dir, file), 'utf8')))
    } catch {
      // Skip unreadable or half-written files rather than failing the whole list
    }
  }
  return notes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
})

export const saveNote = createServerFn({ method: 'POST' })
  .inputValidator((data: NoteInput) => data)
  .handler(async ({ data }) => {
    const fs = await import('node:fs/promises')
    const target = await fileFor(data.id)
    const note: Note = {
      id: data.id,
      title: data.title,
      body: data.body,
      updatedAt: new Date().toISOString(),
    }
    // Write to a temp file, then rename, so a crash never leaves a corrupt note.
    const tmp = `${target}.tmp`
    await fs.writeFile(tmp, JSON.stringify(note, null, 2), 'utf8')
    await fs.rename(tmp, target)
    return note
  })

export const deleteNote = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const fs = await import('node:fs/promises')
    await fs.rm(await fileFor(data.id), { force: true })
    return { id: data.id }
  })
