# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 51 files · ~147,551 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 2, .splat 2, .example 1)

## Summary
- 222 nodes · 531 edges · 18 communities (10 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ad7bbdee`
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
- 99propiedades/page.tsx

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `react` - 30 edges
3. `WhatsAppIcon()` - 27 edges
4. `getWhatsAppUrl()` - 23 edges
5. `lucide-react` - 21 edges
6. `next` - 20 edges
7. `compilerOptions` - 15 edges
8. `Property` - 12 edges
9. `GaussianSplatViewer()` - 12 edges
10. `PropertyDetailModal()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PropertyDetailModalProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyDetailModal.tsx → src/lib/types.ts
- `AdminSecretPage()` --calls--> `useData()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/context/DataContext.tsx
- `PropertyCardProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyCard.tsx → src/lib/types.ts
- `GaussianSplatViewer()` --calls--> `ViewerControls()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerControls.tsx
- `GaussianSplatViewer()` --calls--> `ViewerFallback()`  [EXTRACTED]
  src/components/3d/GaussianSplatViewer.tsx → src/components/3d/ViewerFallback.tsx

## Import Cycles
- None detected.

## Communities (18 total, 8 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.10
Nodes (23): @mkkellogg/gaussian-splats-3d, GaussianSplatViewer(), GaussianSplatViewerProps, isEmbedViewer(), parseScaniverseUrl(), ViewerState, ViewerControls(), ViewerControlsProps (+15 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (29): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+21 more)

### Community 2 - "useData"
Cohesion: 0.18
Nodes (30): lucide-react, next, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), GaussianSplatViewer (+22 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.21
Nodes (17): PropiedadesPage(), PropertyCardProps, GaussianSplatViewer, PropertyDetailModalProps, DataContext, DataContextType, INITIAL_AGENT_PROFILE, INITIAL_BANK_RATES (+9 more)

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

### Community 16 - "99propiedades/page.tsx"
Cohesion: 0.19
Nodes (13): AdminSecretPage(), AdminUser, DEFAULT_ADMIN_USER, BrandLogo(), BrandLogoProps, SPLAT_VIEWER_CONFIG, SplatFormat, compressVideoInBrowser() (+5 more)

## Knowledge Gaps
- **77 isolated node(s):** `DataContext`, `SplatFormat`, `GaussianSplatViewerProps`, `ViewerState`, `ViewerControlsProps` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 94 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useData` to `GaussianSplatViewer.tsx`, `package.json`, `DataContext.tsx`, `TourViewer.tsx`, `99propiedades/page.tsx`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **What connects `DataContext`, `SplatFormat`, `GaussianSplatViewerProps` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._
- **Why does `next` connect `useData` to `package.json`, `DataContext.tsx`, `layout.tsx`, `admin/page.tsx`, `route.ts`, `TourViewer.tsx`, `99propiedades/page.tsx`, `generate-tour/route.ts`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._