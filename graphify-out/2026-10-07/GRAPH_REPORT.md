# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 48 files · ~146,008 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 208 nodes · 501 edges · 16 communities (9 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8a2f8445`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- GaussianSplatViewer.tsx
- package.json
- useData
- DataContext.tsx
- dependencies
- compilerOptions
- CLAUDE.md
- .claude/CLAUDE.md
- react
- next.config.mjs
- postcss.config.mjs
- declarations.d.ts
- ÁUREA | Consultoría Inmobiliaria & Desarrollos
- layout.tsx
- PropertyVirtualTourUploader.tsx

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `WhatsAppIcon()` - 28 edges
3. `react` - 28 edges
4. `getWhatsAppUrl()` - 23 edges
5. `lucide-react` - 20 edges
6. `next` - 18 edges
7. `compilerOptions` - 15 edges
8. `GaussianSplatViewer()` - 12 edges
9. `Property` - 12 edges
10. `getDeviceCapabilities()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GaussianSplatViewer()` --calls--> `ViewerControls()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerControls.tsx
- `GaussianSplatViewer()` --calls--> `ViewerFallback()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerFallback.tsx
- `GaussianSplatViewer()` --calls--> `ViewerLoader()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerLoader.tsx
- `PropertyCardProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyCard.tsx → src/lib/types.ts
- `PropertyDetailModalProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyDetailModal.tsx → src/lib/types.ts

## Import Cycles
- None detected.

## Communities (16 total, 7 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.09
Nodes (25): @mkkellogg/gaussian-splats-3d, GaussianSplatViewer(), GaussianSplatViewerProps, isEmbedViewer(), parseScaniverseUrl(), ViewerState, ViewerControls(), ViewerControlsProps (+17 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+19 more)

### Community 2 - "useData"
Cohesion: 0.24
Nodes (17): lucide-react, next, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), PropiedadesContent(), PropiedadesPage() (+9 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.12
Nodes (28): @supabase/supabase-js, supabase, AdminSecretPage(), AdminUser, DEFAULT_ADMIN_USER, GaussianSplatViewer, PropertyDetailPage(), PropertyCardProps (+20 more)

### Community 4 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, clsx, lucide-react, @mkkellogg/gaussian-splats-3d, next, react, react-dom, @supabase/supabase-js (+1 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "react"
Cohesion: 0.23
Nodes (15): react, BrandLogo(), BrandLogoProps, ClientShell(), Footer(), Header(), HeaderProps, MobileBottomNav() (+7 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 13 - "layout.tsx"
Cohesion: 0.50
Nodes (3): metadata, RootLayout(), DataProvider()

## Knowledge Gaps
- **74 isolated node(s):** `GaussianSplatViewerProps`, `ViewerState`, `WalkNavigationOverlayProps`, `UploadState`, `ViewerControlsProps` (+69 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 92 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `GaussianSplatViewer.tsx`, `package.json`, `useData`, `DataContext.tsx`, `PropertyVirtualTourUploader.tsx`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **What connects `GaussianSplatViewerProps`, `ViewerState`, `WalkNavigationOverlayProps` to the rest of the system?**
  _74 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Why does `next` connect `useData` to `package.json`, `DataContext.tsx`, `react`, `layout.tsx`, `route.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `DataContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11746031746031746 - nodes in this community are weakly interconnected._