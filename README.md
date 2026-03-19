# Unicorn

> ⚠️ This is the **public version** of Unicorn. Some features and source files from the private repository have been omitted.

A web-based drawing and art application with a focus on performance. The hardest problems here weren't the UI — they were keeping the canvas responsive under heavy stroke data, making erasing fast without freezing the main thread, and ensuring drawings survive a page reload exactly as they were left.

**Built by:** [darthblanc](https://github.com/darthblanc) and [j-cow2](https://github.com/j-cow2)

> **Stack:** React · Vite · Firebase (Auth, Firestore, Storage) · Web Workers · Canvas API · Node.js

---

## Engineering Highlights

### Stroke Compression — Custom Delta/Diff Encoding

Raw canvas strokes are dense: every pointer event produces an (x, y) coordinate, and a single drawing session can generate tens of thousands of points. Storing and retrieving that naively from Firestore would be slow and expensive.

Unicorn uses a **custom delta encoding scheme** — rather than storing absolute coordinates for every point, each stroke is encoded as a series of offsets from the previous point. This significantly reduces the payload size stored in Firestore, making saves faster and reads cheaper.

On load, strokes are decoded and **redrawn precisely** — the original drawing is reconstructed exactly, not approximated.

### Quadtree Erasing — Offloaded to a Web Worker

Erasing requires checking every stored stroke point against the eraser's hit area. For large drawings this is an expensive spatial query — running it on the main thread would block rendering and make the UI feel frozen.

Unicorn solves this by:

1. **Building a quadtree** over all stroke points — a spatial index that makes hit-testing O(log n) instead of O(n)
2. **Running the quadtree queries and redrawing entirely inside a Web Worker** — keeping the main thread free for user input and UI updates
3. **Posting results back to the main thread** only when the erase operation is complete

This means erasing stays smooth regardless of drawing complexity.

### Autosaving

Drawings are automatically persisted to Firestore on a timed interval without interrupting the user. The autosave system:

- Compresses the current stroke state using delta encoding before writing
- Uses Firebase Storage for any raster assets
- Fires via event listeners on the file menu so save state is always reflected in the UI

### Firebase Auth + File Management

Each user has an isolated workspace. Firebase Authentication gates access to drawings, and Firestore listeners keep the file menu in sync with live updates — opening, renaming, or deleting a file reflects immediately without a page refresh.

---

## Architecture

```
unicorn-public/
├── my-react-app/
│   ├── src/
│   │   ├── canvas/        # Drawing engine, stroke management, delta encoding
│   │   ├── workers/       # Web Worker — quadtree construction, erase ops, redraw
│   │   ├── firebase/      # Auth, Firestore, Storage integration
│   │   ├── components/    # UI — toolbar, file menu, canvas wrapper
│   │   └── hooks/         # Autosave, file listeners, auth state
│   └── firebase.json      # Emulator config
└── node-backend/          # Supporting backend services
```

---

## Getting Started

### Prerequisites

```bash
sudo apt-get install nodejs npm
```

### Install & Run

```bash
git clone https://github.com/darthblanc/unicorn-public.git
cd unicorn-public/my-react-app
npm install
npm run dev
```

Press `o` + Enter in the terminal to open in browser.

### Firebase Setup

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Start emulators: `firebase emulators:start`
4. Create `my-react-app/hidden/firebaseConfig.json` with your Firebase project config:

```json
{
  "apiKey": "your-api-key",
  "authDomain": "your-auth-domain",
  "projectId": "your-project-id",
  "storageBucket": "your-storage-bucket",
  "messagingSenderId": "your-messaging-sender-id",
  "appId": "your-app-id"
}
```

---

## Known Limitations

- **No multiplayer / real-time collaboration** — drawings are per-user only. The Firestore listener architecture could support this with additional conflict resolution logic, but it hasn't been implemented.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React + Vite |
| Canvas | Canvas API |
| Performance | Web Workers |
| Auth | Firebase Authentication |
| Database | Firestore |
| Storage | Firebase Storage |
| Backend | Node.js |
