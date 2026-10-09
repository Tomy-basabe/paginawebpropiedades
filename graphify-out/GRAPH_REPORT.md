# Graph Report - Venta Inmobiliaria  (2026-10-09)

## Corpus Check
- 50 files · ~149,798 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 222 nodes · 547 edges · 14 communities (7 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5163f193`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- [id]/page.tsx
- 99propiedades/page.tsx
- compilerOptions
- CLAUDE.md
- .claude/CLAUDE.md
- DataContext.tsx
- next.config.mjs
- postcss.config.mjs
- ÁUREA | Consultoría Inmobiliaria & Desarrollos
- next

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `WhatsAppIcon()` - 28 edges
3. `next` - 25 edges
4. `getWhatsAppUrl()` - 23 edges
5. `react` - 22 edges
6. `lucide-react` - 18 edges
7. `compilerOptions` - 15 edges
8. `AdminSecretPage()` - 12 edges
9. `Property` - 12 edges
10. `PropertyCard()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `AdminSecretPage()` --calls--> `BrandLogo()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/components/BrandLogo.tsx
- `AdminSecretPage()` --calls--> `useData()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/context/DataContext.tsx
- `AdminSecretPage()` --calls--> `getGoogleMapsEmbedUrl()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/lib/maps.ts
- `AdminSecretPage()` --calls--> `getGoogleMapsExternalLink()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/lib/maps.ts
- `AdminSecretPage()` --calls--> `parseAndGeocodeLocation()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/lib/maps.ts

## Import Cycles
- None detected.

## Communities (14 total, 7 thin omitted)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (35): dependencies, clsx, lucide-react, next, react, react-dom, @supabase/supabase-js, tailwind-merge (+27 more)

### Community 2 - "[id]/page.tsx"
Cohesion: 0.21
Nodes (14): PropertyDetailPage(), PropiedadesContent(), PropiedadesPage(), PropertyCard(), PropertyCardProps, PropertyDetailModal(), PropertyDetailModalProps, formatCurrencyPrice() (+6 more)

### Community 3 - "99propiedades/page.tsx"
Cohesion: 0.10
Nodes (29): AdminModule, AdminModuleConfig, AdminSecretPage(), AdminUser, ALL_ADMIN_MODULES, DEFAULT_USERS, DataContextType, INITIAL_AGENT_PROFILE (+21 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "DataContext.tsx"
Cohesion: 0.19
Nodes (27): lucide-react, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), SobreMiPage(), BankRatesTable() (+19 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 14 - "next"
Cohesion: 0.07
Nodes (29): next, @supabase/supabase-js, supabase, clearAttempts(), isRateLimited(), loginAttempts, POST(), recordFailedAttempt() (+21 more)

## Knowledge Gaps
- **74 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+69 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 93 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `DataContext.tsx`, `package.json`, `[id]/page.tsx`, `99propiedades/page.tsx`?**
  _High betweenness centrality (0.261) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _74 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Why does `react` connect `DataContext.tsx` to `package.json`, `[id]/page.tsx`, `99propiedades/page.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `99propiedades/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.06753006475485661 - nodes in this community are weakly interconnected._