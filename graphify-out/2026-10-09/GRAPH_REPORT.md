# Graph Report - Venta Inmobiliaria  (2026-10-09)

## Corpus Check
- 51 files · ~153,031 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 229 nodes · 564 edges · 17 communities (8 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d52f724b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- PropertyCard.tsx
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

## Communities (17 total, 9 thin omitted)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (35): dependencies, clsx, lucide-react, next, react, react-dom, @supabase/supabase-js, tailwind-merge (+27 more)

### Community 2 - "PropertyCard.tsx"
Cohesion: 0.33
Nodes (9): PropiedadesContent(), PropiedadesPage(), PropertyCard(), PropertyCardProps, PropertyDetailModal(), PropertyDetailModalProps, formatCurrencyPrice(), formatPropertyRef() (+1 more)

### Community 3 - "99propiedades/page.tsx"
Cohesion: 0.11
Nodes (32): AdminModule, AdminModuleConfig, AdminSecretPage(), AdminUser, ALL_ADMIN_MODULES, DEFAULT_USERS, PropertyDetailPage(), getGoogleMapsEmbedUrl() (+24 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "useData"
Cohesion: 0.19
Nodes (27): lucide-react, next, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), SobreMiPage() (+19 more)

### Community 11 - "DataContext.tsx"
Cohesion: 0.20
Nodes (12): metadata, RootLayout(), DataContext, DataContextType, DataProvider(), INITIAL_AGENT_PROFILE, INITIAL_BANK_RATES, INITIAL_FEATURED_BANNERS (+4 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 14 - "auth.ts"
Cohesion: 0.09
Nodes (25): @supabase/supabase-js, supabase, clearAttempts(), isRateLimited(), loginAttempts, POST(), recordFailedAttempt(), safeCompare() (+17 more)

## Knowledge Gaps
- **75 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 94 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `useData` to `package.json`, `PropertyCard.tsx`, `99propiedades/page.tsx`, `DataContext.tsx`, `logout/route.ts`, `auth.ts`, `admin/page.tsx`?**
  _High betweenness centrality (0.259) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Why does `react` connect `useData` to `DataContext.tsx`, `package.json`, `PropertyCard.tsx`, `99propiedades/page.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `99propiedades/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10512820512820513 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09411764705882353 - nodes in this community are weakly interconnected._