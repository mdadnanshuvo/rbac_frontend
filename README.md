# RBAC Frontend — Dynamic Permissions Platform

A fully dynamic Role-Based Access Control (RBAC) web application built with **Next.js 14 App Router + TypeScript + Tailwind CSS**. Access is permission-driven — every page, every action is gated by a permission atom, not a role label.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand |
| HTTP Client | Axios (with auto token refresh) |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Auth | JWT Access Token (sessionStorage) + Refresh Token (httpOnly cookie) |

---

## Project Structure

```
rbac-frontend/
├── src/
│   ├── app/
│   │   ├── login/                  # Login page (public)
│   │   ├── dashboard/              # Dashboard (protected)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── users/                  # User management
│   │   │   └── page.tsx
│   │   ├── permissions/            # Permission editor
│   │   │   └── page.tsx
│   │   ├── audit/                  # Audit log viewer
│   │   │   └── page.tsx
│   │   ├── reports/                # Reports module
│   │   │   └── page.tsx
│   │   ├── leads/                  # Leads module
│   │   │   └── page.tsx
│   │   ├── tasks/                  # Tasks module
│   │   │   └── page.tsx
│   │   ├── customer-portal/        # Customer self-service portal
│   │   │   └── page.tsx
│   │   ├── settings/               # Settings module
│   │   │   └── page.tsx
│   │   ├── 403/                    # Access denied page
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Redirects to /login
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Dynamic permission-driven sidebar
│   │   │   ├── Header.tsx          # Top navigation bar
│   │   │   └── ProtectedLayout.tsx # Auth wrapper for protected pages
│   │   └── ui/
│   │       ├── Button.tsx          # Reusable button component
│   │       ├── Input.tsx           # Reusable input component
│   │       ├── Badge.tsx           # Status/role badge component
│   │       ├── Modal.tsx           # Reusable modal component
│   │       └── Spinner.tsx         # Loading spinner
│   ├── store/
│   │   └── auth.store.ts           # Zustand auth store
│   ├── lib/
│   │   ├── api.ts                  # Axios client with JWT auto-refresh
│   │   └── utils.ts                # Helper functions (cn, formatDate, etc.)
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces & types
│   ├── hooks/
│   │   └── usePermission.ts        # Permission helper hook
│   └── middleware.ts               # Next.js route protection middleware
├── public/
├── .env.local                      # Environment variables (not committed)
├── .env.local.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Backend API running on `http://localhost:4000` (see [rbac-backend](../rbac-backend))

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mdadnanshuvo/rbac_frontend.git
cd rbac_frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Login with the default admin account

```
Email:    admin@rbac.com
Password: Admin@1234
```

> ⚠️ Make sure the backend server is running before starting the frontend.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:4000/api` |

---

## Key Features

### 🔐 Authentication
- JWT access token stored in `sessionStorage` (in-memory, not localStorage)
- Refresh token stored in `httpOnly` cookie (secure, not accessible via JS)
- Automatic token refresh on 401 responses via Axios interceptor
- Auto-redirect to `/login` when session expires

### 🛡️ Dynamic Permission Routing
- `middleware.ts` protects all routes — redirects unauthenticated users to `/login`
- Every sidebar nav item is rendered only if the user holds the required permission atom
- Permission checks happen both on the client (`usePermission` hook) and the server (API)

### 👁️ Permission Editor
- Visual toggle UI for granting/revoking permission atoms per user
- **Grant ceiling enforced** — you cannot grant a permission you don't hold yourself
- Bulk sync via single API call (`PUT /permissions/user/:id/sync`)

### 📋 Audit Log
- Append-only log of every admin/manager action
- Searchable by action type or actor email
- Timestamped with actor info and IP address

### 📱 Fully Responsive
- Mobile-first design
- Collapsible sidebar with overlay on mobile
- All tables scroll horizontally on small screens

---

## Permission Atoms

| Atom | Grants Access To |
|------|-----------------|
| `page:dashboard` | Dashboard page |
| `page:users` | User management page |
| `page:leads` | Leads module |
| `page:tasks` | Tasks module |
| `page:reports` | Reports page |
| `page:audit` | Audit log page |
| `page:settings` | Settings page |
| `page:customer-portal` | Customer portal |
| `action:user.create` | Create new users |
| `action:user.edit` | Edit / suspend / ban users |
| `action:user.delete` | Delete users |
| `action:permission.view` | View user permissions |
| `action:permission.grant` | Grant permissions to users |
| `action:permission.revoke` | Revoke user permissions |

---

## Role Hierarchy

```
Admin
 └── Manager
      └── Agent
           └── Customer
```

- **Admin** — Full access to everything
- **Manager** — Can manage their team and configure agent permissions
- **Agent** — Can only access modules their manager has unlocked
- **Customer** — Self-service portal access only

> Grant ceiling rule: you can only grant permissions you already hold yourself.

---

## Pages Overview

| Route | Permission Required | Description |
|-------|-------------------|-------------|
| `/login` | Public | Login page |
| `/dashboard` | `page:dashboard` | Overview + stats |
| `/users` | `page:users` | User management with CRUD |
| `/permissions` | `action:permission.view` | Visual permission editor |
| `/audit` | `page:audit` | Audit log viewer |
| `/reports` | `page:reports` | Reports module |
| `/leads` | `page:leads` | Leads pipeline |
| `/tasks` | `page:tasks` | Tasks and assignments |
| `/customer-portal` | `page:customer-portal` | Customer self-service |
| `/settings` | Authenticated | System settings |
| `/403` | Public | Access denied page |

---

## API Integration

All API calls go through `src/lib/api.ts` which is an Axios instance with:

- **Base URL** — from `NEXT_PUBLIC_API_URL` env variable
- **Request interceptor** — attaches `Authorization: Bearer <token>` header
- **Response interceptor** — automatically refreshes token on 401 and retries the original request
- **Credentials** — `withCredentials: true` to send the refresh token cookie

### Example usage

```ts
import api from '@/lib/api'

// GET request
const { data } = await api.get('/users')

// POST request
const { data } = await api.post('/users', {
  email: 'user@example.com',
  password: 'Password123',
  firstName: 'John',
  lastName: 'Doe',
  role: 'agent',
})
```

---

## Auth Store

The Zustand auth store (`src/store/auth.store.ts`) exposes:

```ts
const { 
  user,             // Current authenticated user with permissions[]
  isAuthenticated,  // Boolean
  isLoading,        // Boolean
  login,            // (email, password) => Promise<void>
  logout,           // () => Promise<void>
  fetchMe,          // Fetch current user from API
  hasPermission,    // (atom: string) => boolean
} = useAuthStore()
```

### usePermission hook

```ts
const { can, canAny, canAll, isRole, isAnyRole } = usePermission()

can('page:users')                        // true/false
canAny('page:users', 'page:reports')     // true if holds any
canAll('page:users', 'action:user.edit') // true if holds all
isRole('admin')                          // true/false
isAnyRole('admin', 'manager')            // true if any role matches
```

---

## Deployment

### Build for production

```bash
npm run build
npm run start
```

### Deploy to Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Set the environment variable in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

### Deploy to any Node.js server

```bash
npm run build
node .next/standalone/server.js
```

---

## Related Repositories

- **Backend** — [rbac-backend](../rbac-backend) — Node.js + Express + PostgreSQL REST API

---

