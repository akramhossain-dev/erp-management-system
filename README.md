# ERP Management System

> A modern, production-ready Enterprise Resource Planning system built with React, TypeScript, Supabase, and an AI-assisted development workflow.

---

## Project Status

| Phase | Name                            | Status      |
|-------|---------------------------------|-------------|
| 0     | Planning & Design System        | ✅ Complete |
| 1     | Project Setup & Foundation      | 🔲 Pending  |
| 2     | Authentication Module           | 🔲 Pending  |
| 3     | Product / Customer / Supplier   | 🔲 Pending  |
| 4     | Purchase & Sales Transactions   | 🔲 Pending  |
| 5     | Dashboard & Reports             | 🔲 Pending  |
| 6     | Polish, Testing & Deploy        | 🔲 Pending  |

---

## Tech Stack

| Layer          | Technology                                                |
|----------------|-----------------------------------------------------------|
| Framework      | React 18 + Vite + TypeScript                              |
| UI             | Tailwind CSS + Shadcn UI                                  |
| State / Data   | TanStack Query (React Query v5)                           |
| Forms          | React Hook Form + Zod                                     |
| Backend        | Supabase (Auth + PostgreSQL + PostgREST + Realtime)       |
| Hosting        | Vercel (Frontend) + Supabase (Backend)                    |

---

## Modules

| Module              | Features                                                       |
|---------------------|----------------------------------------------------------------|
| Authentication      | Register, Login, Logout, Protected Routes, Session Management  |
| Dashboard           | Live KPI Cards: Products, Customers, Suppliers, Revenue        |
| Products            | Full CRUD + Search + Filtering + Auto-stock management          |
| Customers           | Full CRUD                                                      |
| Suppliers           | Full CRUD                                                      |
| Purchases           | Create Purchase Orders + Line Items + Stock auto-increase       |
| Sales               | Create Sales + Stock Validation + Stock auto-decrease           |
| Reports             | Product, Customer, Supplier, Purchase, Sales Reports            |

---

## Documentation

| Document                               | Description                                           |
|----------------------------------------|-------------------------------------------------------|
| [PROJECT_PLAN.md](docs/PROJECT_PLAN.md) | Requirements, module dependencies, sprint plan, scalability |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Frontend + backend architecture, folder structure     |
| [DATABASE.md](docs/DATABASE.md)         | Database schema, relationships, RLS, inventory logic  |
| [UI_GUIDE.md](docs/UI_GUIDE.md)         | Complete design system: colors, typography, components|
| [AI_WORKFLOW.md](docs/AI_WORKFLOW.md)   | AI-assisted development methodology and workflows     |
| [PROMPTS.md](docs/PROMPTS.md)           | Ready-to-use AI prompts for every development stage   |

---

## Design System

**Theme:** Modern Glass ERP  
**Style:** Dark professional SaaS + Glassmorphism  
**Primary Color:** `#3B82F6` (Blue 500)  
**Background:** `#080C14` (Deep Navy)  
**Font:** Inter (UI) + JetBrains Mono (data values)  

See [UI_GUIDE.md](docs/UI_GUIDE.md) for the complete design specification.

---

## Getting Started (Phase 1+)

```bash
# Clone the repository
git clone https://github.com/[username]/erp-management-system.git
cd erp-management-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase URL and ANON_KEY

# Start development server
npm run dev
```

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

> ⚠️ Never commit `.env.local` to version control. It is gitignored by default.

---

## Project Structure

```
erp-management-system/
├── docs/                    # Phase 0 planning documentation
│   ├── PROJECT_PLAN.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── UI_GUIDE.md
│   ├── AI_WORKFLOW.md
│   └── PROMPTS.md
├── src/
│   ├── assets/              # Static media
│   ├── components/          # Shared UI components
│   ├── context/             # React contexts (auth, etc.)
│   ├── features/            # Feature modules (domain-organized)
│   ├── hooks/               # Global custom hooks
│   ├── lib/                 # Library configuration
│   ├── pages/               # Route-level page components
│   ├── routes/              # React Router configuration
│   ├── services/            # Cross-feature services
│   ├── types/               # TypeScript definitions
│   └── utils/               # Utility functions
├── .env.example
├── .gitignore
├── components.json          # Shadcn UI config
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## License

This project is created for AI Developer Assessment purposes.
