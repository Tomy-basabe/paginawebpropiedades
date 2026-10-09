# Graph Report - Venta Inmobiliaria  (2026-10-09)

## Corpus Check
- 44 files · ~140,891 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 192 nodes · 465 edges · 14 communities (7 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `659732e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- useData
- DataContext.tsx
- compilerOptions
- CLAUDE.md
- .claude/CLAUDE.md
- getWhatsAppUrl
- next.config.mjs
- postcss.config.mjs
- ÁUREA | Consultoría Inmobiliaria & Desarrollos
- auth.ts

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `WhatsAppIcon()` - 28 edges
3. `getWhatsAppUrl()` - 23 edges
4. `next` - 22 edges
5. `react` - 22 edges
6. `lucide-react` - 18 edges
7. `compilerOptions` - 15 edges
8. `Property` - 12 edges
9. `HomePage()` - 9 edges
10. `verifySessionToken()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminSecretPage()` --calls--> `BrandLogo()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/components/BrandLogo.tsx
- `AdminSecretPage()` --calls--> `useData()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/context/DataContext.tsx
- `GET()` --calls--> `verifySessionToken()`  [EXTRACTED]
  src/app/api/admin/me/route.ts → src/lib/auth.ts
- `HomePage()` --calls--> `getWhatsAppUrl()`  [EXTRACTED]
  src/app/page.tsx → src/lib/whatsapp.ts
- `PropertyDetailPage()` --calls--> `getWhatsAppUrl()`  [EXTRACTED]
  src/app/propiedades/[id]/page.tsx → src/lib/whatsapp.ts

## Import Cycles
- None detected.

## Communities (14 total, 7 thin omitted)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (37): dependencies, clsx, lucide-react, next, react, react-dom, @supabase/supabase-js, tailwind-merge (+29 more)

### Community 2 - "useData"
Cohesion: 0.18
Nodes (21): lucide-react, next, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), PropertyDetailPage(), PropiedadesContent() (+13 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.15
Nodes (22): AdminModule, AdminModuleConfig, AdminSecretPage(), AdminUser, ALL_ADMIN_MODULES, DEFAULT_ADMIN_USER, DataContext, DataContextType (+14 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "getWhatsAppUrl"
Cohesion: 0.19
Nodes (17): react, metadata, RootLayout(), BrandLogo(), BrandLogoProps, ClientShell(), Footer(), Header() (+9 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 14 - "auth.ts"
Cohesion: 0.14
Nodes (18): clearAttempts(), isRateLimited(), loginAttempts, POST(), recordFailedAttempt(), safeCompare(), GET(), checkAuth() (+10 more)

## Knowledge Gaps
- **70 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 84 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `useData` to `getWhatsAppUrl`, `package.json`, `DataContext.tsx`, `auth.ts`?**
  _High betweenness centrality (0.253) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Why does `react` connect `getWhatsAppUrl` to `package.json`, `useData`, `DataContext.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13666666666666666 - nodes in this community are weakly interconnected._