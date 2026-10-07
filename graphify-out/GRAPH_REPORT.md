# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 51 files · ~146,875 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 217 nodes · 516 edges · 16 communities (9 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fa7f82d8`
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
- getWhatsAppUrl
- next.config.mjs
- postcss.config.mjs
- declarations.d.ts
- ÁUREA | Consultoría Inmobiliaria & Desarrollos
- devDependencies
- PropertyVirtualTourUploader.tsx

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `react` - 29 edges
3. `WhatsAppIcon()` - 28 edges
4. `getWhatsAppUrl()` - 23 edges
5. `lucide-react` - 21 edges
6. `next` - 18 edges
7. `compilerOptions` - 15 edges
8. `Property` - 12 edges
9. `GaussianSplatViewer()` - 12 edges
10. `getDeviceCapabilities()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PropertyCardProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyCard.tsx → src/lib/types.ts
- `PropertyDetailModalProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyDetailModal.tsx → src/lib/types.ts
- `GaussianSplatViewer()` --calls--> `ViewerControls()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerControls.tsx
- `GaussianSplatViewer()` --calls--> `ViewerFallback()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerFallback.tsx
- `GaussianSplatViewer()` --calls--> `ViewerLoader()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerLoader.tsx

## Import Cycles
- None detected.

## Communities (16 total, 7 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.09
Nodes (25): @mkkellogg/gaussian-splats-3d, GaussianSplatViewer(), GaussianSplatViewerProps, isEmbedViewer(), parseScaniverseUrl(), ViewerState, ViewerControls(), ViewerControlsProps (+17 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (27): name, private, scripts, build, dev, lint, start, version (+19 more)

### Community 2 - "useData"
Cohesion: 0.24
Nodes (19): lucide-react, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), GaussianSplatViewer, PropertyDetailPage() (+11 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.15
Nodes (25): AdminSecretPage(), AdminUser, DEFAULT_ADMIN_USER, PropiedadesContent(), PropiedadesPage(), PropertyCardProps, PropertyDetailModalProps, DataContext (+17 more)

### Community 4 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, clsx, lucide-react, @lumaai/luma-web, @mkkellogg/gaussian-splats-3d, next, react, react-dom (+4 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "getWhatsAppUrl"
Cohesion: 0.16
Nodes (17): next, metadata, RootLayout(), BrandLogo(), BrandLogoProps, ClientShell(), Footer(), Header() (+9 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 13 - "devDependencies"
Cohesion: 0.25
Nodes (8): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript

## Knowledge Gaps
- **77 isolated node(s):** `name`, `version`, `private`, `dev`, `build` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 94 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useData` to `GaussianSplatViewer.tsx`, `package.json`, `DataContext.tsx`, `getWhatsAppUrl`, `PropertyVirtualTourUploader.tsx`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08907563025210084 - nodes in this community are weakly interconnected._
- **Why does `next` connect `getWhatsAppUrl` to `package.json`, `useData`, `DataContext.tsx`, `route.ts`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07056451612903226 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `DataContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14838709677419354 - nodes in this community are weakly interconnected._