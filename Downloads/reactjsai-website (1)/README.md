# React JS AI Website

A modern React TypeScript web application built with Vite, featuring a comprehensive collection of UI components powered by Radix UI and styled with TailwindCSS.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI
- **Styling**: TailwindCSS
- **State Management**: TanStack React Query
- **Forms**: React Hook Form
- **Notifications**: Sonner
- **Charts**: Recharts

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Exit0rigin/react.js.ai.git
   cd react.js.ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   
   Or if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Type checking** (optional):
   ```bash
   npm run typecheck
   ```

## Getting Started

### Development Server

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the address shown in your terminal).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run serve
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run serve` | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # UI component library
│   └── Portfolio.tsx    # Portfolio component
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── lib/                # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Features

- 💎 Rich collection of UI components (Accordion, Dialog, Tabs, etc.)
- 🎨 Modern design with TailwindCSS
- 📱 Responsive layouts
- ♿ Accessible components via Radix UI
- 🎯 Type-safe with TypeScript
- ⚡ Fast development with Vite
- 📊 Data visualization with Recharts
- 🔔 Toast notifications with Sonner

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is private. All rights reserved.

## Contact

For more information, visit: [https://github.com/Exit0rigin/react.js.ai](https://github.com/Exit0rigin/react.js.ai)
