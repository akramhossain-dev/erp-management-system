# ERP Management System — AI Development Workflow

> **Version:** 1.0.0  
> **Phase:** 0 — Planning & Design  
> **Status:** Draft  
> **Last Updated:** 2026-07-07

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [AI-Assisted Architecture Planning](#2-ai-assisted-architecture-planning)
3. [Prompt Engineering Strategy](#3-prompt-engineering-strategy)
4. [Code Generation Workflow](#4-code-generation-workflow)
5. [Debugging Workflow](#5-debugging-workflow)
6. [Code Review Workflow](#6-code-review-workflow)
7. [Documentation Workflow](#7-documentation-workflow)
8. [Quality Gates](#8-quality-gates)

---

## 1. Philosophy

AI tools are **accelerators**, not replacements for engineering judgment.

The workflow below treats AI as a skilled pair programmer that:
- Generates boilerplate fast
- Explains unfamiliar patterns
- Suggests alternatives
- Catches common mistakes

But the **engineer** is responsible for:
- Architecture decisions and their tradeoffs
- Security review and validation
- Business logic correctness
- Code that goes to production

```
AI is to engineering what autocomplete is to writing:
it speeds up expression, but clarity of thought comes from you.
```

---

## 2. AI-Assisted Architecture Planning

### Stage: Before Writing Any Code

Use AI to validate and pressure-test your architectural decisions — not to make them.

#### Step 1 — Describe the domain, ask for gaps
```
Prompt pattern:
"I'm building an ERP system with these modules: [list].
My tech stack is [stack].
Here is my planned database schema: [schema summary].
What architectural concerns or edge cases am I likely missing?"
```

#### Step 2 — Validate schema decisions
```
Prompt pattern:
"Review this database table design: [table description with fields].
Identify: normalization issues, missing constraints, performance concerns,
RLS compatibility issues in Supabase."
```

#### Step 3 — Explore alternatives
```
Prompt pattern:
"I'm deciding between [Option A] and [Option B] for [concern].
My constraints are [constraints].
What are the tradeoffs? Which would you recommend for a team of [size] 
maintaining this for [timeframe]?"
```

#### Step 4 — Document the decisions
After each major architectural decision:
```
Prompt pattern:
"Summarize this architecture decision as an ADR (Architecture Decision Record):
Context: [what problem we're solving]
Decision: [what we chose]
Consequences: [what this means for the system]"
```

---

## 3. Prompt Engineering Strategy

### 3.1 The PRECISE Prompt Framework

Every AI prompt for code generation should include:

| Element     | Description                                         | Example                                |
|-------------|-----------------------------------------------------|----------------------------------------|
| **P**urpose | What this code does                                 | "A React hook to fetch products"       |
| **R**oles   | Tech stack and context                              | "Using TanStack Query + Supabase JS"   |
| **E**xample | Input/output or interface expected                  | "Returns { data, isLoading, error }"   |
| **C**onstraints | What to avoid or require                       | "TypeScript strict, no any types"      |
| **I**nput   | Data shape / types coming in                        | "Product type from database.types.ts"  |
| **S**tyle   | Code style / patterns to follow                     | "Follow existing useCustomers pattern" |
| **E**rrors  | How errors should be handled                        | "Toast on error, return undefined"     |

### 3.2 Context Loading Pattern

Before generating code in any session, load context:

```
Step 1 — Load project context:
"I'm working on erp-management-system. 
Tech stack: React 18 + TypeScript + Tailwind + Shadcn UI + Supabase.
Folder structure: [paste relevant section from ARCHITECTURE.md]
Database types: [paste relevant types from database.types.ts]"

Step 2 — Load feature context:
"I'm implementing the [Products] module.
Here's the existing code for a similar module: [paste Customers service/hook]
Follow the same patterns."

Step 3 — Request code:
"Now generate [specific task] following the same patterns."
```

### 3.3 Prompt Templates by Task

#### For a new Service Function
```
Generate a TypeScript service function for Supabase with these specs:
- Function name: [name]
- Table: [table name]
- Operation: [SELECT / INSERT / UPDATE / DELETE]
- Filters: [filters to apply]
- Returns: [return type]
- Error handling: throw error, let TanStack Query handle it
- TypeScript: strict, use Database['public']['Tables']['[table]']['Row'] type
```

#### For a new Custom Hook
```
Generate a TanStack Query hook with these specs:
- Hook name: use[Entity]
- Query key: [key array]
- Service call: [service function name] from [service file]
- Select transform: [any data transformation needed, or 'none']
- Stale time: [X minutes]
- Include: useQuery for read, useMutation for write
- Return: { data, isLoading, isError, [mutation functions] }
```

#### For a new Form Component
```
Generate a React form component with:
- Form library: React Hook Form + zodResolver
- Schema: [Zod schema name] from [schema file]
- Fields: [list each field: name, type, label, placeholder, validation]
- Submit handler: calls [mutationFunction] from [hook]
- On success: [action - navigate/close/reset]
- On error: display field-level errors using FormMessage
- Styling: Shadcn UI Form, FormField, FormItem, FormLabel, FormControl components
```

#### For a new Data Table
```
Generate a TanStack Table v8 column definition array for [Entity] with:
- Columns: [list each: field name, header text, cell render type]
- Sortable columns: [list]
- Actions column: [Edit button linking to /entity/:id/edit, Delete button with confirm dialog]
- Status column (if applicable): StatusBadge component
- Monetary columns: right-aligned, JetBrains Mono, formatted with currency formatter
```

---

## 4. Code Generation Workflow

### Phase 1 — Schema First

Before generating any component or hook, generate TypeScript types from the Supabase schema.

```
Step 1: Push database schema to Supabase
Step 2: Run: npx supabase gen types typescript --project-id [id] > src/types/database.types.ts
Step 3: Create entity interfaces in src/types/entities.ts
        (Cleaner aliases over generated types)
Step 4: AI prompt: "Based on these generated types, create the entities.ts file 
        with cleaner Product, Customer, Supplier, Purchase, Sale interfaces"
```

### Phase 2 — Service Layer First

Generate the service (data access) layer before UI.

```
For each feature, generate in this order:
1. Feature Zod schema (validation)
2. Feature service (Supabase queries)
3. Feature hooks (TanStack Query wrappers)
4. Feature form component
5. Feature table component
6. Page component (compose above)
```

### Phase 3 — Module-by-Module

```
Implementation sequence (follow sprint order from PROJECT_PLAN.md):

[Sprint 1] Auth Module
  ├── authSchemas.ts (Zod)
  ├── authService.ts (Supabase)
  ├── useAuth.ts (hook)
  ├── AuthContext.tsx (context)
  ├── LoginForm.tsx
  ├── RegisterForm.tsx
  └── ProtectedRoute.tsx

[Sprint 2] Products Module (template for all entity modules)
  ├── productSchemas.ts
  ├── productService.ts
  ├── useProducts.ts
  ├── useProductMutations.ts
  ├── ProductTable.tsx
  ├── ProductForm.tsx
  ├── ProductFilters.tsx
  └── Pages: ProductsPage, ProductNewPage, ProductEditPage

[Sprint 2] Customers Module (same pattern as Products)
[Sprint 2] Suppliers Module (same pattern as Products)

[Sprint 3] Purchases Module
  ├── purchaseSchemas.ts
  ├── purchaseService.ts
  ├── usePurchases.ts
  ├── usePurchaseMutations.ts
  ├── PurchaseTable.tsx
  ├── PurchaseForm.tsx (complex: line items)
  ├── PurchaseItemRow.tsx
  └── Pages: PurchasesPage, PurchaseNewPage, PurchaseDetailPage

[Sprint 3] Sales Module (same pattern as Purchases)

[Sprint 4] Dashboard
  ├── dashboardService.ts
  ├── useDashboardStats.ts
  └── DashboardStats.tsx (KPI cards grid)

[Sprint 4] Reports
  ├── reportService.ts
  └── [5 report pages]
```

### Code Generation Checklist

After each AI-generated file, verify:
- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] Types match database.types.ts
- [ ] No `any` types (ESLint: `@typescript-eslint/no-explicit-any`)
- [ ] Error handling present in service functions
- [ ] Loading states handled in components
- [ ] Empty states handled in tables/lists
- [ ] Mobile responsive (check Tailwind classes)
- [ ] Follows naming conventions from existing files
- [ ] Export added to feature `index.ts`

---

## 5. Debugging Workflow

### Step 1 — Isolate the Problem

```
Prompt pattern:
"I have a bug: [describe symptom].
Relevant code: [paste the minimal failing code].
Error message: [paste exact error].
Expected: [what should happen].
Actual: [what actually happens].
What are the most likely causes?"
```

### Step 2 — Supabase-Specific Debugging

```
For RLS issues:
"My Supabase query returns empty data but I know records exist.
My RLS policy is: [paste policy].
My auth.uid() is: [value from client].
The user_id on the records is: [value].
Why might RLS be blocking this?"

For query issues:
"My Supabase query is: [paste query builder code].
The generated SQL logged by PostgREST is: [paste from network tab].
I expected it to return: [expected data].
What's wrong with the query?"

For trigger issues:
"My database trigger [name] is not firing as expected.
Trigger definition: [paste].
Test case: [describe the action that should trigger it].
Expected behavior: [describe].
Actual behavior: [describe]."
```

### Step 3 — React / TanStack Query Debugging

```
Common issues to check with AI assistance:
1. "Stale closure in useEffect capturing old state"
   → Prompt: "Review this useEffect for stale closure issues: [code]"

2. "Infinite refetch loop"
   → Prompt: "Why might this TanStack Query hook cause infinite refetches? [code]"

3. "Mutation not invalidating cache"
   → Prompt: "After my createProduct mutation, the products list doesn't refresh.
              Here's my mutation config: [code]. What's missing?"

4. "Form not submitting / not calling onSubmit"
   → Prompt: "My React Hook Form onSubmit is not called. 
              Form component: [code]. Zod schema: [schema].
              What validation might be silently failing?"
```

### Step 4 — Systematic Resolution

```
1. Add console.log at each layer (component → hook → service → Supabase)
2. Check browser Network tab for the actual HTTP request/response
3. Check Supabase Dashboard → Logs for database-level errors
4. Simplify: comment out parts until bug disappears → narrow root cause
5. Ask AI: paste minimal reproduction + error + what you've tried
```

---

## 6. Code Review Workflow

### Pre-Review Checklist (Self-Review Before AI)

Run this before asking AI to review:
- [ ] Code compiles: `tsc --noEmit`
- [ ] Lint passes: `npm run lint`
- [ ] Feature works end-to-end manually (create, read, update, delete)
- [ ] Mobile view tested (browser DevTools → responsive mode)
- [ ] Error states tested (bad network, empty data)
- [ ] Loading states present and look correct

### AI Code Review Prompts

#### Security Review
```
"Review this Supabase service function for security issues:
[paste code]

Check for:
1. SQL injection vulnerabilities (even with ORM)
2. Missing auth checks
3. Exposed sensitive data in return
4. Missing input sanitization
5. Any operations that bypass RLS unintentionally"
```

#### Performance Review
```
"Review this React component and its data fetching for performance issues:
[paste component + hook code]

Check for:
1. Unnecessary re-renders
2. Missing memoization (useMemo, useCallback)
3. N+1 query patterns
4. Missing TanStack Query stale time / cache configuration
5. Large payloads being fetched when only a subset is needed"
```

#### TypeScript Strictness Review
```
"Review this TypeScript code for type safety issues:
[paste code]

Check for:
1. use of 'any' type
2. Non-null assertions (!) that could fail at runtime
3. Type assertions (as Type) that are unsafe
4. Missing error type narrowing
5. Return types that should be more specific"
```

#### Business Logic Review
```
"Review this purchase/sale completion logic for business rule correctness:
[paste code]

Business rules to verify:
1. Stock cannot go negative
2. Completed transactions cannot be modified
3. Cancelled transactions don't affect stock
4. Total amounts are computed correctly from line items
5. Historical prices are preserved in line items"
```

---

## 7. Documentation Workflow

### Inline Code Documentation

Use AI to generate JSDoc comments for complex functions:
```
"Generate a JSDoc comment for this TypeScript function:
[paste function]
Include: @param descriptions, @returns description, @throws conditions, @example usage"
```

### README Generation

After each sprint:
```
"Update this README section to reflect the new features added:
[paste current README section]
New features added in this sprint: [list features]
Keep the same format and tone."
```

### API Documentation

For each service module:
```
"Generate a markdown API reference for these Supabase service functions:
[paste service file]
Format: function name, description, parameters, return type, example usage.
Target audience: other developers on the team."
```

### Commit Message Generation

```
"Generate a conventional commit message for these changes:
[paste git diff or description of changes]
Format: type(scope): description
Types: feat, fix, refactor, docs, style, test, chore"
```

---

## 8. Quality Gates

### Gate 1 — Feature Development
Before marking any feature as complete:

```
✓ TypeScript: tsc --noEmit (zero errors)
✓ Lint: npm run lint (zero warnings)
✓ Manual test: CRUD flow verified
✓ Error handling: tested with network error simulation
✓ Loading states: skeleton shown during fetch
✓ Empty state: shown when no records exist
✓ Form validation: all required fields validated
✓ Mobile: tested at 375px width
```

### Gate 2 — Module Completion
Before moving to next sprint:

```
✓ All features in sprint marked complete
✓ Business logic tested (stock increase/decrease)
✓ AI code review completed (security + performance)
✓ Documentation updated
✓ Git commits organized and descriptive
```

### Gate 3 — Pre-Deploy
Before pushing to production:

```
✓ Production build succeeds: npm run build
✓ No console.log statements left in code
✓ Environment variables verified in Vercel dashboard
✓ Supabase RLS policies audited
✓ All routes tested in production build
✓ Performance check: no obvious N+1 queries
```
