# Graph Report - Venta Inmobiliaria  (2026-10-09)

## Corpus Check
- 51 files · ~153,472 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 231 nodes · 568 edges · 15 communities (7 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2becf945`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- 99propiedades/page.tsx
- compilerOptions
- CLAUDE.md
- .claude/CLAUDE.md
- useData
- next.config.mjs
- postcss.config.mjs
- DataContext.tsx
- ÁUREA | Consultoría Inmobiliaria & Desarrollos
- auth.ts

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `WhatsAppIcon()` - 28 edges
3. `next` - 25 edges
4. `getWhatsAppUrl()` - 23 edges
5. `react` - 22 edges
6. `lucide-react` - 18 edges
7. `AdminSecretPage()` - 15 edges
8. `compilerOptions` - 15 edges
9. `Property` - 12 edges
10. `PropertyCard()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `AdminSecretPage()` --calls--> `BrandLogo()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/components/BrandLogo.tsx
- `AdminSecretPage()` --calls--> `useData()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/context/DataContext.tsx
- `GET()` --calls--> `verifySessionToken()`  [EXTRACTED]
  src/app/api/admin/me/route.ts → src/lib/auth.ts
- `RootLayout()` --calls--> `ClientShell()`  [EXTRACTED]
  src/app/layout.tsx → src/components/ClientShell.tsx
- `HomePage()` --calls--> `PropertyCard()`  [EXTRACTED]
  src/app/page.tsx → src/components/PropertyCard.tsx

## Import Cycles
- None detected.

## Communities (15 total, 8 thin omitted)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (35): dependencies, clsx, lucide-react, next, react, react-dom, @supabase/supabase-js, tailwind-merge (+27 more)

### Community 3 - "99propiedades/page.tsx"
Cohesion: 0.11
Nodes (31): AdminModule, AdminModuleConfig, AdminSecretPage(), AdminUser, ALL_ADMIN_MODULES, DEFAULT_USERS, PropertyDetailPage(), getGoogleMapsEmbedUrl() (+23 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "useData"
Cohesion: 0.19
Nodes (27): lucide-react, next, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), SobreMiPage() (+19 more)

### Community 11 - "DataContext.tsx"
Cohesion: 0.13
Nodes (24): metadata, RootLayout(), PropiedadesContent(), PropiedadesPage(), PropertyCard(), PropertyCardProps, PropertyDetailModal(), PropertyDetailModalProps (+16 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 14 - "auth.ts"
Cohesion: 0.09
Nodes (25): @supabase/supabase-js, supabase, clearAttempts(), isRateLimited(), loginAttempts, POST(), recordFailedAttempt(), safeCompare() (+17 more)

## Knowledge Gaps
- **75 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 94 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `useData` to `package.json`, `99propiedades/page.tsx`, `DataContext.tsx`, `admin/page.tsx`, `auth.ts`?**
  _High betweenness centrality (0.258) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Why does `react` connect `useData` to `DataContext.tsx`, `package.json`, `99propiedades/page.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `99propiedades/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10810810810810811 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `DataContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12762762762762764 - nodes in this community are weakly interconnected._