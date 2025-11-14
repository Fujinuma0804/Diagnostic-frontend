# Generate Page Frontend

This React + Vite application implements the Generate Page experience from the Figma design at https://www.figma.com/design/8DKpFf3RBQuzqS9oE0VfjX/Untitled?node-id=1-3. It uses Tailwind CSS together with shadcn/ui and Radix UI primitives to reproduce the original UI and flows (quiz, character selection, and results).

## Prerequisites

- Node.js 18+
- npm (comes with Node.js) or another compatible package manager

## Quick Start

1. Clone the repository and open the project folder.
2. Move into the frontend workspace:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be served on `http://localhost:5173` by default.

## Environment Variables

Create a `.env` file in `frontend/` if you need to override the default API endpoint:

```env
VITE_API_URL=http://127.0.0.1:8000/api/
```

- `VITE_API_URL` points to the backend used for quiz logic and generated content. Adjust it to match your API origin.

## Available Scripts

- `npm run dev` – start the Vite development server with hot module replacement.
- `npm run build` – produce an optimized production bundle in `dist/`.

## Project Structure Highlights

- `src/` – application source
  - `components/` – page-level and reusable UI pieces
    - `figma/` – helpers for mirroring Figma assets/behaviour
    - `ui/` – shadcn/ui components configured for this project
  - `styles/` – Tailwind and global CSS
  - `App.tsx` – main route tree and layout composition
  - `main.tsx` – Vite entry point
- `public/` – static assets and JSON seed data (`json/` mirrors the backend payloads)
- `package.json` – dependencies and npm scripts

## Tech Stack

- React 18 + React Router
- Vite
- TypeScript
- Tailwind CSS
- Radix UI + shadcn/ui primitives
- Lucide React icons

