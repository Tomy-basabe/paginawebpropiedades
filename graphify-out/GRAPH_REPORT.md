# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 51 files · ~147,731 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .splat 2, .example 1)

## Summary
- 223 nodes · 532 edges · 16 communities (9 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `085c2f57`
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
- layout.tsx
- next.config.mjs
- postcss.config.mjs
- declarations.d.ts
- ÁUREA | Consultoría Inmobiliaria & Desarrollos
- TourViewer.tsx

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `react` - 30 edges
3. `WhatsAppIcon()` - 27 edges
4. `getWhatsAppUrl()` - 23 edges
5. `lucide-react` - 21 edges
6. `next` - 20 edges
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
- `GaussianSplatViewer()` --calls--> `WalkNavigationOverlay()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/WalkNavigationOverlay.tsx
- `PropertyCardProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyCard.tsx → src/lib/types.ts

## Import Cycles
- None detected.

## Communities (16 total, 7 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.08
Nodes (25): @mkkellogg/gaussian-splats-3d, GaussianSplatViewer(), GaussianSplatViewerProps, isEmbedViewer(), parseScaniverseUrl(), ViewerState, ViewerControls(), ViewerControlsProps (+17 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (27): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+19 more)

### Community 2 - "useData"
Cohesion: 0.18
Nodes (30): lucide-react, next, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), GaussianSplatViewer (+22 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.12
Nodes (30): @supabase/supabase-js, supabase, AdminSecretPage(), AdminUser, DEFAULT_ADMIN_USER, PropiedadesContent(), PropiedadesPage(), PropertyCardProps (+22 more)

### Community 4 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, clsx, lucide-react, @lumaai/luma-web, @mkkellogg/gaussian-splats-3d, next, react, react-dom (+4 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "layout.tsx"
Cohesion: 0.50
Nodes (3): metadata, RootLayout(), DataProvider()

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

### Community 15 - "TourViewer.tsx"
Cohesion: 0.22
Nodes (10): @lumaai/luma-web, @react-three/fiber, three, TourDemoPage(), PropertyVirtualTourUploader(), UploadState, Controls(), GaussianSplatViewer (+2 more)

## Knowledge Gaps
- **77 isolated node(s):** `GaussianSplatViewerProps`, `ViewerState`, `ViewerControlsProps`, `ViewerFallbackProps`, `ViewerLoaderProps` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 95 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useData` to `GaussianSplatViewer.tsx`, `package.json`, `DataContext.tsx`, `TourViewer.tsx`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **What connects `GaussianSplatViewerProps`, `ViewerState`, `ViewerControlsProps` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08412698412698413 - nodes in this community are weakly interconnected._
- **Why does `next` connect `useData` to `package.json`, `DataContext.tsx`, `layout.tsx`, `upload-model/route.ts`, `TourViewer.tsx`, `generate-tour/route.ts`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `DataContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11605937921727395 - nodes in this community are weakly interconnected._