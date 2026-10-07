# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 46 files · ~143,581 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 202 nodes · 493 edges · 15 communities (9 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `012a1bc4`
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
- 99propiedades/page.tsx
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
6. `next` - 18 edges
7. `compilerOptions` - 15 edges
8. `GaussianSplatViewer()` - 12 edges
9. `Property` - 12 edges
10. `HomePage()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PropertyDetailModalProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyDetailModal.tsx → src/lib/types.ts
- `AdminSecretPage()` --calls--> `BrandLogo()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/components/BrandLogo.tsx
- `AdminSecretPage()` --calls--> `useData()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/context/DataContext.tsx
- `ContactoContent()` --calls--> `useData()`  [EXTRACTED]
  src/app/contacto/page.tsx → src/context/DataContext.tsx
- `FinanciamientoPage()` --calls--> `WhatsAppIcon()`  [EXTRACTED]
  src/app/financiamiento/page.tsx → src/components/WhatsAppIcon.tsx

## Import Cycles
- None detected.

## Communities (15 total, 6 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.12
Nodes (20): GaussianSplatViewer(), GaussianSplatViewerProps, InteractionHint(), isEmbedViewer(), parseScaniverseUrl(), ViewerState, ViewerControls(), ViewerControlsProps (+12 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (37): dependencies, clsx, lucide-react, @mkkellogg/gaussian-splats-3d, next, react, react-dom, @supabase/supabase-js (+29 more)

### Community 2 - "WhatsAppIcon"
Cohesion: 0.18
Nodes (20): next, react, ContactoContent(), ContactoPage(), SobreMiPage(), BrandLogo(), BrandLogoProps, ClientShell() (+12 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.25
Nodes (14): GaussianSplatViewer, PropertyDetailPage(), PropertyCardProps, DataContext, DataContextType, INITIAL_AGENT_PROFILE, INITIAL_BANK_RATES, INITIAL_FEATURED_BANNERS (+6 more)

### Community 4 - "useData"
Cohesion: 0.26
Nodes (15): lucide-react, FinanciamientoPage(), HomePage(), PropiedadesContent(), PropiedadesPage(), BankRatesTable(), BannerHero(), MortgageCalculator() (+7 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "99propiedades/page.tsx"
Cohesion: 0.16
Nodes (13): @supabase/supabase-js, supabase, AdminSecretPage(), AdminUser, DEFAULT_ADMIN_USER, SPLAT_VIEWER_CONFIG, SplatFormat, compressVideoInBrowser() (+5 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 13 - "layout.tsx"
Cohesion: 0.50
Nodes (3): metadata, RootLayout(), DataProvider()

## Knowledge Gaps
- **72 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 87 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `WhatsAppIcon` to `GaussianSplatViewer.tsx`, `package.json`, `DataContext.tsx`, `useData`, `99propiedades/page.tsx`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12169312169312169 - nodes in this community are weakly interconnected._
- **Why does `next` connect `WhatsAppIcon` to `package.json`, `DataContext.tsx`, `useData`, `99propiedades/page.tsx`, `layout.tsx`, `route.ts`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._