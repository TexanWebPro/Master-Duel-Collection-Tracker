import { app, BrowserWindow, shell } from 'electron'
import path from 'node:path'
import net from 'node:net'
import { pathToFileURL } from 'node:url'

const isDev = process.argv.includes('--dev')
const HOST = '127.0.0.1'
let mainWindow = null

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.once('error', reject)
    srv.listen(0, HOST, () => {
      const { port } = srv.address()
      srv.close(() => resolve(port))
    })
  })
}

async function waitForServer(url, tries = 100) {
  for (let i = 0; i < tries; i++) {
    try {
      await fetch(url)
      return
    } catch {
      await new Promise((r) => setTimeout(r, 100))
    }
  }
  throw new Error(`Server did not start at ${url}`)
}

// In production the TanStack Start server runs inside Electron's Node runtime,
// so its server functions can use the filesystem directly.
async function startEmbeddedServer() {
  const port = await freePort()
  process.env.NOTES_DATA_DIR = path.join(app.getPath('userData'), 'notes')
  process.env.PORT = String(port)
  process.env.NITRO_PORT = String(port)
  process.env.HOST = HOST
  process.env.NITRO_HOST = HOST

  const appRoot = app.getAppPath().replace('app.asar', 'app.asar.unpacked')
  const entry = path.join(appRoot, '.output', 'server', 'index.mjs')
  await import(pathToFileURL(entry).href)

  const url = `http://${HOST}:${port}`
  await waitForServer(url)
  return url
}

async function createWindow() {
  const url = isDev ? 'http://localhost:3000' : await startEmbeddedServer()
  const origin = new URL(url).origin

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 720,
    minHeight: 480,
    backgroundColor: '#eef1f0',
    title: 'Master Duel Collection Tracker',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  // Keep the app on its own origin; send everything else to the system browser.
  mainWindow.webContents.setWindowOpenHandler(({ url: target }) => {
    shell.openExternal(target)
    return { action: 'deny' }
  })
  mainWindow.webContents.on('will-navigate', (event, target) => {
    if (new URL(target).origin !== origin) {
      event.preventDefault()
      shell.openExternal(target)
    }
  })

  await mainWindow.loadURL(url)
}

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
  app.whenReady().then(createWindow)
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}
