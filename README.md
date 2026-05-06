# Quantum Dashboard

> Frontend interface for the **Quantum-Inspired Cybersecurity Network Analyzer** — upload traffic logs, trigger analysis, and visualize threat detection results powered by a .NET 8 backend.

---

## Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [File Structure](#-file-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Testing](#-testing)
- [Coverage Report](#-coverage-report)
- [Test Cases](#-test-cases)
- [User Workflow](#-user-workflow)

---

## Project Overview

The Quantum Dashboard provides security analysts with a clean portal to:

- **Upload** network traffic CSV logs
- **Trigger** quantum-inspired analysis pipelines
- **Visualize** threat classifications, anomaly scores, and historical trends

It communicates with a .NET 8 backend that runs quantum-inspired anomaly detection algorithms and exposes results via a REST API.

### Core Features

| Feature | Description |
|---|---|
| Dashboard Interface | Real-time overview of system status and recent threat detections |
| Log Upload Portal | Drag-and-drop interface for uploading CSV network traffic logs |
| Visual Analytics | Threat classifications (Normal / Suspicious / Attack), anomaly scores, trends |
| Threat Reporting | Detailed tables for inspecting individual nodes and event metadata |

---

## Tech Stack

| Technology | Role |
|---|---|
| React | UI component framework |
| TypeScript | Type-safe development |
| Vite | Build tool and dev server |
| Fetch API | Backend HTTP communication |
| Vitest | Unit and integration test runner |
| React Testing Library | Component rendering and interaction tests |
| @vitest/coverage-v8 | Code coverage reporting |
| jsdom | Simulated browser DOM for tests |

---

## File Structure

```
.
├── public/                    # Static assets (favicon, icons)
├── src/
│   ├── assets/                # Images and SVGs
│   ├── components/            # Reusable UI components
│   ├── context/               # Global state / context providers
│   │   └── AuthContext.tsx
│   ├── pages/                 # Page-level components
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── utils/                 # Utility functions
│   │   └── sanitize.ts
│   ├── api.ts                 # API client (fetch wrapper)
│   ├── App.tsx                # Root component
│   ├──  main.tsx               # Entry point
|   └──  __tests__/             # ★ All test files
│        ├── api.test.ts            # Tests for api.ts  (17 tests)
│        ├── components/            # Tests for components 
│        ├── context/               # Tests for context
|        ├── api.test.ts            # Tests for api.ts  (17 tests)
│        ├── utils/                 # Test for saitize.ts 
│        └── pages/
│
├── coverage/                  # Generated after running coverage
│   ├── index.html             # Visual report — open in browser
│   └── ...
│
├── .env                       # Environment variables
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite + Vitest configuration
└── README.md
```

### Key File Roles

| File | Responsibility |
|---|---|
| `src/api.ts` | Centralised fetch wrapper. Reads token fresh from `localStorage` on every request. |
| `src/context/AuthContext.tsx` | Provides `login` / `logout` state to the component tree via React Context. |
| `src/utils/sanitize.ts` | Input sanitisation and email validation helpers. |
| `src/pages/Login.tsx` | Login form — calls `sanitize` + `validateEmail`, then `api.auth.login`. |
| `src/__tests__/api.test.ts` | 17 tests covering all `api.ts` endpoints with mocked `fetch`. |
| `src/__tests__/pages/Login.test.tsx` | 6 tests covering Login component behaviour. |
| `vite.config.ts` | Vitest config: test environment, coverage provider, include globs. |

---

## Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Quantum_Cybersecurity_Network_Frontend.git
cd network_frontend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then edit .env and set VITE_API_BASE_URL (see below)
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

> If this variable is missing, `api.ts` falls back to an empty string and all requests are made to the same origin as the frontend.

---

## Usage

```bash
# Start the development server
npm run dev

# Create a production build
npm run build
```

---

## Testing

### Why We Test

| Purpose | Detail |
|---|---|
| Catch regressions | A change to `api.ts` or `Login.tsx` could silently break auth. Tests catch this immediately. |
| Document behaviour | Each test case is a precise, runnable specification of what the code must do. |
| Safe refactoring | Mock-based approach means tests run without a live backend — in CI or locally, any time. |

### Running Tests

```bash
# Run the full suite once
npm run test

# Watch mode — re-runs on every file save
npm run test -- --watch

# Run a single test file
npm run test -- src/__tests__/api.test.ts

# Filter by test name
npm run test -- --reporter=verbose -t "login"
```

---

## Coverage Report

```bash
npm run coverage
```

This generates two outputs:

- **Terminal summary** — printed immediately after tests finish
- **HTML report** — written to `coverage/index.html`; open in any browser for a line-by-line breakdown

### Reading the Terminal Summary

| Column | Meaning | Target |
|---|---|---|
| `% Stmts` | Statements executed | ≥ 80% |
| `% Branch` | if/else paths taken | ≥ 75% |
| `% Funcs` | Functions called | ≥ 80% |
| `% Lines` | Lines executed | ≥ 80% |
| `Uncovered Line #s` | Lines not hit by any test | Empty |

### Enforcing Thresholds in CI

Add this to `vite.config.ts` to fail the build when coverage drops:

```ts
// vite.config.ts
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    thresholds: {
      statements: 80,
      branches:   75,
      functions:  80,
      lines:      80,
    }
  }
}
```

---

## Test Cases

### `api.test.ts` — API Module (17 tests)

All tests mock `fetch` globally via `vi.stubGlobal` and replace `localStorage` with an in-memory store, so no real network or browser is needed.

#### Auth — Login

| Test | What it verifies | Pass condition |
|---|---|---|
| `login success` | Successful login stores token and returns data | `res.token === 'abc123'` and `localStorage` has the token |
| `login failure` | Non-ok response rejects with the right message | Throws `'Login failed'` |

#### Auth — Signup

| Test | What it verifies | Pass condition |
|---|---|---|
| `signup success` | Successful signup stores `Token` and returns data | `res.Token === 'xyz456'` and `localStorage` has the token |
| `signup failure` | Non-ok response rejects | Throws `'Signup failed'` |

#### Auth — Revoke

| Test | What it verifies | Pass condition |
|---|---|---|
| `revoke clears token` | Revoke call removes token from `localStorage` | Returns `true`; token is empty |
| `revoke without token` | No token means revoke short-circuits without a fetch | Returns `true` immediately |

#### Auth — Me

| Test | What it verifies | Pass condition |
|---|---|---|
| `me returns user data` | Valid token causes `me()` to fetch and return the user object | Returns `{ name: 'John' }` |
| `me clears token on failure` | Non-ok response wipes the token and returns null | Returns `null`; token is empty |

#### Dashboard

| Test | What it verifies | Pass condition |
|---|---|---|
| `getDashboard success` | Three parallel fetches merge into a stats object | `nodesAnalyzed === 1`; `threatDistribution.attack === 1` |
| `getDashboard failure` | Non-ok results response rejects the whole call | Throws `'Failed to fetch dashboard'` |

#### Logs

| Test | What it verifies | Pass condition |
|---|---|---|
| `getLogs success` | Ok response returns the parsed JSON array | `res.length === 1` |
| `getLogs unauthorized` | 401 response throws a session expiry error | Throws `'Session expired'` |

#### Threats

| Test | What it verifies | Pass condition |
|---|---|---|
| `getThreats success` | Ok response returns the parsed array | `res.length === 1` |

#### File Upload

| Test | What it verifies | Pass condition |
|---|---|---|
| `uploadFile success` | Ok response is returned directly | `res.ok === true` |
| `uploadFile failure` | Non-ok response rejects | Throws `'Upload failed'` |

#### Analyze

| Test | What it verifies | Pass condition |
|---|---|---|
| `analyze success` | Ok response is returned directly | `res.ok === true` |
| `analyze failure` | Non-ok response rejects | Throws `'Analysis failed'` |

---

## User Workflow

```
1. Upload   →  Drag-and-drop a CSV log on the Upload page
                └─ Calls api.uploadFile()  →  POST /Upload

2. Analyze  →  Click Analyze to trigger the backend pipeline
                └─ Calls api.analyze()     →  POST /Analyze

3. Monitor  →  View results on the Threat Dashboard
                └─ Calls api.getDashboard() →  GET /Results
                                               GET /Results/quantum-walk
                                               GET /Results/qft
```

---

## Quick Reference

| Command | What it does |
|---|---|
| `npm install` | Install all dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create an optimised production build |
| `npm run test` | Run the full test suite once |
| `npm run test -- --watch` | Run tests in watch mode |
| `npm run coverage` | Run tests and generate coverage report in `coverage/` |

---

[The backend github URL](https://github.com/goutam-tech/Quantum_Cybersecurity-Network-Analyzer_Backend.git)

---

Please ensure that this environment variable is set before running the application.