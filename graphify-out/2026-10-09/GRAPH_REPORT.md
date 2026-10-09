# Graph Report - Venta Inmobiliaria  (2026-10-09)

## Corpus Check
- 53 files · ~161,747 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 238 nodes · 596 edges · 15 communities (8 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ad68483`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- [id]/page.tsx
- 99propiedades/page.tsx
- compilerOptions
- CLAUDE.md
- .claude/CLAUDE.md
- useData
- next.config.mjs
- postcss.config.mjs
- DataContext.tsx
- ÁUREA | Consultoría Inmobiliaria & Desarrollos
- next

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `next` - 25 edges
3. `WhatsAppIcon()` - 24 edges
4. `getWhatsAppUrl()` - 23 edges
5. `react` - 23 edges
6. `lucide-react` - 19 edges
7. `AdminSecretPage()` - 15 edges
8. `compilerOptions` - 15 edges
9. `PropertyCard()` - 13 edges
10. `PropertyDetailModal()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `ClientShell()`  [EXTRACTED]
  src/app/layout.tsx → src/components/ClientShell.tsx
- `PropertyDetailPage()` --calls--> `WhatsAppIcon()`  [EXTRACTED]
  src/app/propiedades/[id]/page.tsx → src/components/WhatsAppIcon.tsx
- `PropertyDetailPage()` --calls--> `useData()`  [EXTRACTED]
  src/app/propiedades/[id]/page.tsx → src/context/DataContext.tsx
- `PropertyDetailPage()` --calls--> `getGoogleMapsEmbedUrl()`  [EXTRACTED]
  src/app/propiedades/[id]/page.tsx → src/lib/maps.ts
- `PropertyDetailPage()` --calls--> `getGoogleMapsExternalLink()`  [EXTRACTED]
  src/app/propiedades/[id]/page.tsx → src/lib/maps.ts

## Import Cycles
- None detected.

## Communities (15 total, 7 thin omitted)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (35): dependencies, clsx, lucide-react, next, react, react-dom, @supabase/supabase-js, tailwind-merge (+27 more)

### Community 2 - "[id]/page.tsx"
Cohesion: 0.33
Nodes (10): PropertyDetailPage(), PropiedadesContent(), PropiedadesPage(), PropertyCard(), PropertyDetailModal(), formatCurrencyPrice(), formatPropertyRef(), getPropertyShareData() (+2 more)

### Community 3 - "99propiedades/page.tsx"
Cohesion: 0.11
Nodes (32): AdminModule, AdminModuleConfig, AdminSecretPage(), AdminUser, ALL_ADMIN_MODULES, DEFAULT_USERS, BrandLogo(), BrandLogoProps (+24 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "useData"
Cohesion: 0.18
Nodes (27): lucide-react, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), SobreMiPage(), BankRatesTable() (+19 more)

### Community 11 - "DataContext.tsx"
Cohesion: 0.15
Nodes (18): metadata, RootLayout(), PropertyCardProps, PropertyDetailModalProps, DataContext, DataContextType, DataProvider(), INITIAL_AGENT_PROFILE (+10 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 14 - "next"
Cohesion: 0.08
Nodes (27): next, @supabase/supabase-js, supabase, clearAttempts(), isRateLimited(), loginAttempts, POST(), recordFailedAttempt() (+19 more)

## Knowledge Gaps
- **77 isolated node(s):** `serverSupabase`, `inMemoryPayments`, `metadata`, `ShareSiteModalProps`, `ShareDataResult` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 96 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `[id]/page.tsx`, `99propiedades/page.tsx`, `useData`, `DataContext.tsx`?**
  _High betweenness centrality (0.257) - this node is a cross-community bridge._
- **What connects `serverSupabase`, `inMemoryPayments`, `metadata` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Why does `react` connect `useData` to `DataContext.tsx`, `package.json`, `[id]/page.tsx`, `99propiedades/page.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `99propiedades/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `useData` to `package.json`, `[id]/page.tsx`, `99propiedades/page.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._