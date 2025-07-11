# TODO App (React + TypeScript + Tailwind)

## How to Run

1. **Install dependencies**
   ```sh
   npm install
   # or
   yarn install
   ```
2. **Start the mock API server (optional, for local development)**
   ```sh
   npm run mock-api
   ```
   - This will start a local REST API at `http://localhost:3001` using [json-server](https://github.com/typicode/json-server) and the mock data in `src/mock/mock_todos.json`.
   - You can edit the mock data file or reset it by running this command again.
3. **Start the development server**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
4. **Open your browser**
   - Go to `http://localhost:5173` (or the port shown in your terminal)

## Why these frameworks?

### React

- React is a modern, component-based library that makes UI development fast, modular, and maintainable. It has a huge ecosystem and is widely used in the industry.

### TypeScript

- TypeScript adds static typing to JavaScript, reducing bugs and making code easier to refactor and maintain, especially in larger projects.

### Tailwind CSS

- Tailwind CSS is a utility-first CSS framework that allows for rapid, consistent, and responsive UI development. It supports dark mode and is easy to customize.

### Vite

- Vite is a fast build tool and dev server for modern web projects. It provides instant hot reload and optimized builds.

### Mock API (json-server)

- Using a mock API server (like `npm run mock-api`) allows you to develop and test your frontend independently from the real backend.
- You can quickly reset, edit, or simulate API responses, making development and debugging much faster and safer.
- It is ideal for team collaboration, prototyping, and when the real API is not ready.

## Mock API

- You can use the included mock in `src/mock/mock_todos.json` or point to any REST API with the same shape.
- To use a real API, adjust the base URL in the custom hooks.

## Folder Structure

- `src/components/` — (for future component extraction)
- `src/hooks/` — Custom hooks for API
- `src/types/` — TypeScript types
- `src/mock/` — Mock data
