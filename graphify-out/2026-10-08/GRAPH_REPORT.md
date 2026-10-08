# Graph Report - Venta Inmobiliaria  (2026-10-08)

## Corpus Check
- 58 files · ~151,496 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 2, .splat 2, .example 1)

## Summary
- 257 nodes · 605 edges · 16 communities (10 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `15116cee`
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
- next

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `react` - 31 edges
3. `WhatsAppIcon()` - 28 edges
4. `next` - 25 edges
5. `getWhatsAppUrl()` - 23 edges
6. `lucide-react` - 22 edges
7. `compilerOptions` - 15 edges
8. `GaussianSplatViewer()` - 14 edges
9. `verifySessionToken()` - 13 edges
10. `Property` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AdminSecretPage()` --calls--> `BrandLogo()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/components/BrandLogo.tsx
- `AdminSecretPage()` --calls--> `useData()`  [EXTRACTED]
  src/app/99propiedades/page.tsx → src/context/DataContext.tsx
- `GET()` --calls--> `verifySessionToken()`  [EXTRACTED]
  src/app/api/admin/me/route.ts → src/lib/auth.ts
- `POST()` --calls--> `verifySessionToken()`  [EXTRACTED]
  src/app/api/upload-model/route.ts → src/lib/auth.ts
- `RootLayout()` --calls--> `ClientShell()`  [EXTRACTED]
  src/app/layout.tsx → src/components/ClientShell.tsx

## Import Cycles
- None detected.

## Communities (16 total, 6 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.09
Nodes (25): @mkkellogg/gaussian-splats-3d, GaussianSplatViewer(), GaussianSplatViewerProps, isEmbedViewer(), parseScaniverseUrl(), ViewerState, ViewerControls(), ViewerControlsProps (+17 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (29): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+21 more)

### Community 2 - "useData"
Cohesion: 0.16
Nodes (32): lucide-react, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), GaussianSplatViewer, PropertyDetailPage() (+24 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.13
Nodes (27): AdminSecretPage(), AdminUser, DEFAULT_ADMIN_USER, CameraCalibrationModal(), CameraCalibrationModalProps, PropertyCardProps, GaussianSplatViewer, PropertyDetailModalProps (+19 more)

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

### Community 13 - "TourViewer.tsx"
Cohesion: 0.24
Nodes (10): @lumaai/luma-web, @react-three/fiber, three, TourDemoPage(), PropertyVirtualTourUploader(), UploadState, Controls(), GaussianSplatViewer (+2 more)

### Community 14 - "next"
Cohesion: 0.09
Nodes (23): next, clearAttempts(), isRateLimited(), loginAttempts, POST(), recordFailedAttempt(), safeCompare(), GET() (+15 more)

## Knowledge Gaps
- **83 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 102 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `package.json`, `useData`, `DataContext.tsx`, `layout.tsx`, `TourViewer.tsx`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09047619047619047 - nodes in this community are weakly interconnected._
- **Why does `react` connect `useData` to `GaussianSplatViewer.tsx`, `package.json`, `DataContext.tsx`, `TourViewer.tsx`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `DataContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13109243697478992 - nodes in this community are weakly interconnected._