# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 46 files · ~143,749 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 200 nodes · 489 edges · 15 communities (8 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ad89165`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- GaussianSplatViewer.tsx
- package.json
- useData
- DataContext.tsx
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
5. `next` - 18 edges
6. `lucide-react` - 18 edges
7. `compilerOptions` - 15 edges
8. `GaussianSplatViewer()` - 12 edges
9. `Property` - 12 edges
10. `getDeviceCapabilities()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GaussianSplatViewer()` --calls--> `ViewerFallback()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerFallback.tsx
- `GaussianSplatViewer()` --calls--> `ViewerLoader()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerLoader.tsx
- `PropertyCardProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyCard.tsx → src/lib/types.ts
- `PropertyDetailModalProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyDetailModal.tsx → src/lib/types.ts
- `RootLayout()` --calls--> `ClientShell()`  [EXTRACTED]
  src/app/layout.tsx → src/components/ClientShell.tsx

## Import Cycles
- None detected.

## Communities (15 total, 7 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.12
Nodes (20): GaussianSplatViewer(), GaussianSplatViewerProps, InteractionHint(), isEmbedViewer(), parseScaniverseUrl(), ViewerState, ViewerControls(), ViewerControlsProps (+12 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (39): dependencies, clsx, lucide-react, @mkkellogg/gaussian-splats-3d, next, react, react-dom, @supabase/supabase-js (+31 more)

### Community 2 - "useData"
Cohesion: 0.21
Nodes (25): lucide-react, next, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), SobreMiPage() (+17 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.17
Nodes (21): GaussianSplatViewer, PropertyDetailPage(), PropiedadesContent(), PropiedadesPage(), PropertyCardProps, GaussianSplatViewer, PropertyDetailModal(), PropertyDetailModalProps (+13 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "99propiedades/page.tsx"
Cohesion: 0.18
Nodes (14): AdminSecretPage(), AdminUser, DEFAULT_ADMIN_USER, BrandLogo(), BrandLogoProps, SPLAT_VIEWER_CONFIG, SplatFormat, compressVideoInBrowser() (+6 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 13 - "layout.tsx"
Cohesion: 0.50
Nodes (3): metadata, RootLayout(), DataProvider()

## Knowledge Gaps
- **72 isolated node(s):** `GaussianSplatViewerProps`, `ViewerState`, `ViewerControlsProps`, `SplatFormat`, `ViewerFallbackProps` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 87 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useData` to `99propiedades/page.tsx`, `package.json`, `DataContext.tsx`, `GaussianSplatViewer.tsx`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **What connects `GaussianSplatViewerProps`, `ViewerState`, `ViewerControlsProps` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1164021164021164 - nodes in this community are weakly interconnected._
- **Why does `next` connect `useData` to `package.json`, `DataContext.tsx`, `admin/page.tsx`, `99propiedades/page.tsx`, `layout.tsx`, `route.ts`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._