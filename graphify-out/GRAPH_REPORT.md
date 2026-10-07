# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 45 files · ~142,329 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 196 nodes · 485 edges · 14 communities (9 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `48c14010`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- GaussianSplatViewer.tsx
- package.json
- WhatsAppIcon
- DataContext.tsx
- useData
- compilerOptions
- CLAUDE.md
- .claude/CLAUDE.md
- dependencies
- next.config.mjs
- postcss.config.mjs
- declarations.d.ts
- ÁUREA | Consultoría Inmobiliaria & Desarrollos
- layout.tsx

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `WhatsAppIcon()` - 28 edges
3. `react` - 26 edges
4. `getWhatsAppUrl()` - 23 edges
5. `lucide-react` - 18 edges
6. `next` - 17 edges
7. `compilerOptions` - 15 edges
8. `Property` - 12 edges
9. `GaussianSplatViewer()` - 10 edges
10. `HomePage()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminSecretPage()` --calls--> `BrandLogo()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/components/BrandLogo.tsx
- `AdminSecretPage()` --calls--> `useData()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/context/DataContext.tsx
- `ContactoContent()` --calls--> `useData()`  [EXTRACTED]
  src/app/contacto/page.tsx → src/context/DataContext.tsx
- `FinanciamientoPage()` --calls--> `WhatsAppIcon()`  [EXTRACTED]
  src/app/financiamiento/page.tsx → src/components/WhatsAppIcon.tsx
- `RootLayout()` --calls--> `ClientShell()`  [EXTRACTED]
  src/app/layout.tsx → src/components/ClientShell.tsx

## Import Cycles
- None detected.

## Communities (14 total, 5 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.11
Nodes (21): @mkkellogg/gaussian-splats-3d, GaussianSplatViewer(), GaussianSplatViewerProps, InteractionHint(), ViewerState, ViewerControls(), ViewerControlsProps, ViewerFallback() (+13 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+19 more)

### Community 2 - "WhatsAppIcon"
Cohesion: 0.17
Nodes (22): next, react, ContactoContent(), ContactoPage(), GaussianSplatViewer, PropertyDetailPage(), SobreMiPage(), BrandLogo() (+14 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.14
Nodes (23): @supabase/supabase-js, supabase, AdminSecretPage(), AdminUser, DEFAULT_ADMIN_USER, DataContext, DataContextType, INITIAL_AGENT_PROFILE (+15 more)

### Community 4 - "useData"
Cohesion: 0.28
Nodes (15): lucide-react, FinanciamientoPage(), HomePage(), PropiedadesContent(), PropiedadesPage(), BankRatesTable(), BannerHero(), MortgageCalculator() (+7 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, clsx, lucide-react, @mkkellogg/gaussian-splats-3d, next, react, react-dom, @supabase/supabase-js (+1 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 13 - "layout.tsx"
Cohesion: 0.50
Nodes (3): metadata, RootLayout(), DataProvider()

## Knowledge Gaps
- **72 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 84 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `WhatsAppIcon` to `GaussianSplatViewer.tsx`, `package.json`, `DataContext.tsx`, `useData`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10804597701149425 - nodes in this community are weakly interconnected._
- **Why does `next` connect `WhatsAppIcon` to `package.json`, `DataContext.tsx`, `useData`, `layout.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `DataContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._