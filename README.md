# InnerAlign — Behavioral Clarity Engine

> *AI-Powered Decision Alignment System for High Performers*

A high-fidelity web prototype for the **InnerAlign** platform — part of the Upskalor Builder Studio ecosystem. Built with a **Zen-Tech** aesthetic: neo-glassmorphism, dark mode, and Bento Grid layout.

---

## 🚀 Live Preview

Host on **GitHub Pages** → Settings → Pages → Source: `main` branch → `/root`

Or open `index.html` directly in your browser.

---

## 🏗 What's Inside

```
inneralign/
├── index.html          # Full app shell (onboarding + dashboard)
├── css/
│   └── main.css        # Design system — tokens, glassmorphism, bento grid, responsive
├── js/
│   └── app.js          # All interactions — onboarding flow, AI copilot, navigation
└── README.md
```

---

## ✨ Features

### Onboarding (Zero-Friction, 4-step)
- **Step 1** — Brand splash with animated gradient orbs
- **Step 2** — Intent selection (multi-choice cards)
- **Step 3** — First journal entry with live sentiment detection
- **Step 4** — Baseline Clarity Score animated ring
- **Step 5** — Name + Goal capture → Enter Dashboard

### Dashboard (Bento Grid)
| Card | Description |
|------|-------------|
| 🎯 Clarity Score | Dual concentric ring — Drift + Alignment scores, animated on load |
| 🧠 Clarity Copilot | AI insight panel with typewriter responses + action buttons |
| 📊 Pattern Signals | Animated signal bars — Avoidance, Overthinking, Decision Delay |
| 📈 Clarity Trend | 7-day spark chart |
| ✅ Micro-Corrections | Task list with check-off interactions |
| ⚡ Energy State | Live energy orb with state switcher |
| 🎯 Goal Tracker | Progress bar toward monthly goal |
| 🔥 Streak | 7-day consistency counter |

### Views
- **Journal** — Full editor with mood tracking + AI analysis
- **Agents** — Pattern Detector, Alignment Coach, Action Executor cards + Dual Loop diagram
- **Studio** — Upskalor Builder Studio — 4-layer learning pathway
- **Growth** — Timeline + breakthrough tracker

### Interactions
- Staggered card reveal animations (Intersection Observer)
- Typewriter AI responses with loading dots
- Live sentiment detection in journal inputs
- Energy state switcher with animated orb
- Toast notifications
- Quick Journal modal (Ctrl+J shortcut)
- Task check-off with feedback
- Mobile bottom nav (thumb-friendly)

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#7EE8C8` (Teal) |
| Secondary | `#A78BFA` (Purple) |
| Background | `#080C14` |
| Glass | `rgba(255,255,255,0.04)` |
| Font Display | Syne |
| Font Body | DM Sans |
| Font Mono | DM Mono |

---

## 📱 Responsive

- **Desktop**: Full sidebar + Bento Grid (3-column)
- **Tablet**: 2-column Bento Grid
- **Mobile**: Hidden sidebar + bottom navigation bar + single column

---

## 🔌 Integration Roadmap (from the report)

```
Frontend (this prototype)
    ↓
CopilotKit Runtime (Next.js API route)
    ↓
Studio Backend API
    ↓
Flowise Prediction API (agent engine)
    ↓
InnerAlign Agent Flows:
  • Pattern Detector
  • Alignment Coach  
  • Action Executor
```

---

## 🛠 Tech Stack (Production)

- **Frontend**: Next.js + CopilotKit
- **Backend**: Node.js / TypeScript Studio API
- **Agent Engine**: Flowise (self-hosted, Apache 2.0)
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth

---

## 📄 License

MIT — prototype only. Production build follows Flowise (Apache 2.0) and CopilotKit (MIT) attribution requirements.

---

*Built for Upskalor Builder Studio — "Build agents like software. Ship them like products."*
