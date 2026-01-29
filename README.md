# ✍️ InkSync

**InkSync** is a modern, real-time collaborative whiteboard platform built with a scalable **pnpm monorepo**, TypeScript, and Docker - designed for production from day one.

This repository contains the frontend, backend service and shared packages, fully containerized and deployed using **Render**.

---

## ✨ Features

- 🏗️ **Monorepo architecture** using `pnpm workspaces`
- ⚡ **TypeScript-first** codebase
- 📦 Shared packages (`shared-types`) for type safety
- 🐳 **Production‑ready Docker setup** (multi‑stage build)
- 🚀 **Deployed on Render** with zero-config Docker runtime
- 🔒 Environment‑based configuration
- ♻️ Reproducible builds using `pnpm-lock.yaml`

---

## 🗂️ Project Structure

```text
InkSync/
├─ apps/
│  └─ frontend/            # Frontend
│     ├─ src/
│     ├─ tsconfig.json
│     └─ package.json
│  └─ backend/            # Backend
│     ├─ src/
│     ├─ tsconfig.json
│     └─ package.json
│
├─ packages/
│  └─ shared-types/       # Shared TypeScript types
│     ├─ src/
│     ├─ tsconfig.json
│     └─ package.json
│
├─ Dockerfile              # Production Docker build
├─ pnpm-lock.yaml          # Dependency lockfile
├─ pnpm-workspace.yaml     # Workspace configuration
├─ package.json            # Root config
└─ README.md
```

---

## 🛠️ Tech Stack

### 🎨 Frontend

- **Framework:** React 19
- **Styling:** Tailwind CSS (Vite integration)
- **Canvas Rendering:** Konva + React Konva
- **Routing:** React Router v7
- **Realtime:** Socket.IO Client
- **UI Utilities:** React Modal
- **QR Sharing:** qrcode.react

### ⚙️ Backend

- **Runtime:** Node.js 20
- **Framework:** Express 5
- **Realtime:** Socket.IO

### 📦 Shared

- **Type Safety:** `@whiteboard/shared-types` (workspace package)

---

## 🧰 Tooling

- **Runtime:** Node.js 20
- **Language:** TypeScript
- **Package Manager:** pnpm (workspaces)
- **Containerization:** Docker (multi-stage)
- **Deployment:** Render

---

- **Package Manager:** pnpm (workspaces)
- **Containerization:** Docker (multi-stage)
- **Deployment:** Render

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Prerequisites

- Node.js `>= 20`
- pnpm `>= 9`
- Docker (optional, for container testing)

Enable pnpm via Corepack:

```bash
corepack enable
```

---

### 2️⃣ Install Dependencies

From the repository root:

```bash
pnpm install
```

---

### 3️⃣ Build Packages

```bash
pnpm --filter @whiteboard/shared-types build
pnpm --filter @whiteboard/backend build
pnpm --filter @whiteboard/frontend build
```

---

### 4️⃣ Run Backend Locally

```bash
pnpm --filter @whiteboard/backend dev
```

Backend will start on:

```
http://localhost:4000
```

---

## 🐳 Docker (Production Build)

### Build Image

```bash
docker build -t ink-sync .
```

### Run Container

```bash
docker run -p 4000:4000 ink-sync
```

---

## 🌍 Deployment (Render)

This project is deployed using **Render Web Service (Docker runtime)**.

### Key Deployment Notes

- Dockerfile is located at **repo root**
- `Root Directory` in Render is **empty**
- Port is injected automatically by Render
- App listens on `process.env.PORT`

No custom build or start commands are required.

---

## 🔐 Environment Variables

Example `.env`:

```env
NODE_ENV=production
PORT=4000
```

⚠️ Never commit `.env` files to version control.

---

## ❤️ Health Check

A simple health endpoint is recommended:

```http
GET /health
```

Response:

```json
{ "status": "ok" }
```

---

## 📦 Scripts (Common)

```bash
pnpm install                 # Install all dependencies
pnpm build                   # Build all packages
pnpm dev                     # Start dev mode
pnpm lint                    # Run linter
```

---

## 🧠 Monorepo Philosophy

- **Single source of truth** for dependencies
- **Shared types** across services
- **Fast installs** with pnpm
- **Docker‑first** mindset

---

## 🛡️ Production Best Practices

- ✅ Lockfile‑based installs
- ✅ Multi‑stage Docker builds
- ✅ Environment‑based config
- ✅ Graceful shutdown support
- ✅ Zero‑config CI/CD via Render

---

## 📄 License

MIT © InkSync

---


Built with ❤️ By Nemish Gorasiya using pnpm, TypeScript and Docker.
