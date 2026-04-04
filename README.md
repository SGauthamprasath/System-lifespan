# KRONOS System Monitor

KRONOS is a futuristic, Iron Man/JARVIS-inspired desktop application for system health monitoring. Built with React, Vite, and Electron, it features a high-fidelity HUD interface with real-time telemetry, glass-morphism aesthetics, and professional-grade monitoring tools.

---

## 📂 Detailed Project Structure

Below is an exhaustive breakdown of what is contained in every file of the KRONOS project.

### 📁 Root Configuration (`/kronos/frontend`)
- **`package.json`**: Defines the project metadata, scripts (`dev`, `build`), and dependencies. It specifically contains the `"main": "dist-electron/main.js"` entry point for the Electron shell.
- **`vite.config.ts`**: The main orchestration file for the build process. It integrates the `vite-plugin-electron` to handle the simultaneous compilation of the React renderer and the Electron main process.
- **`tailwind.config.js`**: Home to the KRONOS Design System. It defines the custom colors (`kronos-primary`, `kronos-bg`), fonts (`Space Grotesk`, `JetBrains Mono`), and the HUD animations like `scanline` and `pulseGlow`.
- **`index.html`**: The single-page application entry point. It loads the `main.tsx` script and defines the root DOM element where the app is mounted.
- **`tsconfig.json` / `tsconfig.app.json`**: TypeScript configuration files that ensure strict type-checking across both the React frontend and the Electron backend.
- **`eslint.config.js`**: Standardizes code quality and formatting rules across the development team.

### 🖥️ Electron Main Process (`/src/main`)
- **`main.ts`**: The core Electron backend. It handles system-level window creation, sets the dark-space background color, removes the default OS frame for a custom look, and listens for window control signals (close/minimize).
- **`preload.ts`**: The "Safe Bridge." It uses `contextBridge` to securely expose specific desktop-only functions (like window minimizing) to the React frontend without exposing the entire Node.js API.

### 📄 View Components (`/src/pages`)
- **`Dashboard.tsx`**: The primary monitoring hub. It contains the logic for the central 82% health ring and high-level summaries for CPU, RAM, and Disk storage.
- **`Metrics.tsx`**: A data-heavy page that organizes real-time telemetry into a 4-column HUD grid and renders the main system process table.
- **`Alerts.tsx`**: A tactical feed component. It handles the display of security logs, authorized/unauthorized access history, and critical system warnings.
- **`Settings.tsx`**: The user control center. It contains the state and UI for system-wide adjustments like CPU caps, memory limits, and "Neural Sentinel" sensitivity.
- **`About.tsx`**: The informational splash screen. It contains the KRONOS wordmark and technical metadata about the current build version.

### 🧩 UI Components (`/src/components`)

#### 📁 `common/` (Shared HUD Elements)
- **`GlassCard.tsx`**: A styled wrapper that applies backdrop-blur and absolute-positioned "corner brackets" to create the signature Iron Man HUD aesthetic for all panels.
- **`Sidebar.tsx`**: The navigation backbone. It handles the switching between pages and applies glowing hover/active effects to the tactical icons.
- **`Topbar.tsx`**: A draggable header component. It contains the cross-app system clock, uptime counter, and the actual functional buttons for minimizing/closing the app.
- **`StatusDot.tsx`**: A micro-component that renders a pulsing color-coded ring (Green/Yellow/Red) based on the health state of a specific metric.

#### 📁 `metrics/` (Data Visualization)
- **`LiveGraph.tsx`**: A specialized charting component using `Recharts`. It contains the SVG definitions and smooth interpolation logic for the real-time telemetry graphs.
- **`ProcessTable.tsx`**: An interactive data grid. It contains the filtering logic and row-rendering for active system processes and their respective PID/Memory stats.

#### 📁 `settings/` (Modular Controls)
- **`ThresholdSlider.tsx`**: A custom range input component that handles the numeric state and visual feedback for system threshold adjustments.
- **`ToggleSwitch.tsx`**: A custom logic component for boolean "on/off" features like desktop notifications.

### 🧠 Logic & State (`/src/store`)
- **`metricsStore.ts`**: The "Heartbeat." This file contains the Zustand store and a `setInterval` loop that constantly updates the CPU and Network usage stats globally, simulating a live OS environment.

---

## 🏗️ Technical Stack Summary
- **Frontend Engine**: React 18 & Vite (Development Speed)
- **Visual Design**: Tailwind CSS (Tactical HUD Styling)
- **Global State**: Zustand (Low-latency telemetry updates)
- **Visualization**: Recharts (SVG monitoring graphs)
- **Desktop Shell**: Electron (Frameless native integration)

---
*Built for the next generation of synthetic surveillance. Always watching. Always ahead.*

