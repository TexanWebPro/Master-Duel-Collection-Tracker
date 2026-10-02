# Inkwell

A notes desktop app: Electron shell + TanStack Start UI + Tailwind v4, with notes stored as JSON files via Node's `fs`.

## Run

    npm install
    npm run dev      # Vite dev server + Electron window with hot reload
    npm start        # build, then run the production build in Electron
    npm run dist     # package an installer into ./release

## How it fits together

- `electron/main.mjs` — in production it picks a free port, sets `NOTES_DATA_DIR`
  to `<userData>/notes`, imports the built server from `.output/server/index.mjs`
  and opens a window on it. In dev it just opens `http://localhost:3000`.
- `src/server/notes.ts` — `createServerFn` functions that read/write one JSON file
  per note (atomic temp-file + rename). This code only ever runs in Node.
- `src/routes/index.tsx` — route loader calls `listNotes()`; the editor autosaves via `saveNote()`.

Dev data lives in `./.data/notes`. Packaged data lives in your OS user-data folder
(e.g. `~/Library/Application Support/Inkwell/notes`, `%APPDATA%/Inkwell/notes`).
