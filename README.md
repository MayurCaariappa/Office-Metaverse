# Office Metaverse

Office Metaverse is a full-stack demo for a virtual office product: a multiplayer workspace where users sign in, choose a map, and see each other move around in realtime.

## Current product slice

The current version focuses on a polished and credible multiplayer foundation:

- secure sign up and sign in with hashed passwords and JWT auth
- map selection flow with asset-backed scenes
- realtime player presence over WebSockets
- room-aware multiplayer movement sync
- refresh-safe client session persistence
- a more polished product shell around the gameplay canvas

## Feature status

| Area                  | Status      | Notes                                                |
| --------------------- | ----------- | ---------------------------------------------------- |
| Authentication        | Implemented | Typed API, hashed passwords, JWT session flow        |
| Map gallery           | Implemented | REST-backed map browsing with media URLs             |
| Multiplayer movement  | Implemented | WebSocket presence sync scoped by map                |
| Avatar management API | Implemented | Admin-only upload flow ready for extension           |
| Voice/video           | Planned     | Not implemented yet.                                 |
| Chat and interactions | Planned     | Realtime layer is structured to support this next    |
| Dynamic office growth | Planned     | Map and presence architecture prepared for extension |

## Architecture

### Frontend

- React + TypeScript + Vite
- Route-guarded flows for auth, lobby, and office view
- Small client API layer for HTTP and WebSocket configuration
- Canvas-based office renderer with polished product shell

### Backend

- Express + TypeScript
- Zod-based request validation
- JWT auth with role-aware middleware
- Multer-based media upload pipeline
- Repository-driven app construction for testability

### Realtime

- Native `ws` server
- Typed message contracts
- Map-scoped player registry
- Reconnect-aware client behavior

### Data

- MongoDB via Mongoose
- User, map, and avatar models

## Local setup

### 1. Install dependencies

```bash
npm install
npm install --prefix frontend
```

### 2. Create your env file

```bash
cp .env.example .env
```

Update the values in `.env`, especially:

- `MONGODB_URI`
- `JWT_SECRET`
- `UPLOAD_DIR`

### 3. Start the app

```bash
npm run dev
```

That launches:

- backend API on `API_PORT`
- realtime server on `WS_PORT`
- frontend Vite app on `http://localhost:5173`

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
```

## Demo flow

1. Open the landing page and sign up or sign in.
2. Enter the map gallery.
3. Open the same map in multiple tabs or browsers.
4. Move with arrow keys or WASD to validate live multiplayer sync.

## Roadmap

- proximity chat and direct messaging
- richer avatars and sprite-based animation
- interaction zones for desks, meeting rooms, and collaboration spaces
- analytics/observability for room activity
- deployable cloud environment with seeded demo data

Started on 22 October, 2024.
