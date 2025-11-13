# Generate Page in ReactJS

This is a ReactJS application for a Generate Page, built with Vite, TypeScript, and Tailwind CSS. It includes various UI components from shadcn/ui and Radix UI primitives.

The original Figma design is available at https://www.figma.com/design/8DKpFf3RBQuzqS9oE0VfjX/Untitled?node-id=1-3

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

## Installation

1. Clone the repository or download the project files.
2. Navigate to the project directory:
   ```bash
   cd testapp_frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Setup

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
VITE_API_URL=http://127.0.0.1:8000/api/
```

- `VITE_API_URL`: The base URL for the API endpoints. Update this to match your backend server URL.

## Running the Application

To start the development server:

```bash
npm run dev
```

This will start the Vite development server, typically on `http://localhost:5173`.

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

- `src/`: Source code
  - `components/`: Reusable components
    - `ui/`: shadcn/ui components
    - `figma/`: Figma-specific components
  - `styles/`: CSS styles
  - `App.tsx`: Main application component
  - `main.tsx`: Entry point
- `public/`: Static assets
- `package.json`: Dependencies and scripts

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- shadcn/ui components
- Lucide React icons

