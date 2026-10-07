# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 44 files · ~141,250 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 185 nodes · 478 edges · 12 communities (7 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `715f8a38`
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
- layout.tsx
- next.config.mjs
- postcss.config.mjs
- declarations.d.ts

## God Nodes (most connected - your core abstractions)
1. `useData()` - 35 edges
2. `WhatsAppIcon()` - 29 edges
3. `react` - 26 edges
4. `getWhatsAppUrl()` - 24 edges
5. `lucide-react` - 18 edges
6. `next` - 16 edges
7. `compilerOptions` - 15 edges
8. `Property` - 12 edges
9. `GaussianSplatViewer()` - 10 edges
10. `getDeviceCapabilities()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `PropertyCardProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyCard.tsx → src/lib/types.ts
- `PropertyDetailModalProps` --references--> `Property`  [EXTRACTED]
  src/components/PropertyDetailModal.tsx → src/lib/types.ts
- `DataContextType` --references--> `Property`  [EXTRACTED]
  src/context/DataContext.tsx → src/lib/types.ts
- `AdminPage()` --calls--> `BrandLogo()`  [EXTRACTED]
  src/app/admin/page.tsx → src/components/BrandLogo.tsx
- `AdminPage()` --calls--> `WhatsAppIcon()`  [EXTRACTED]
  src/app/admin/page.tsx → src/components/WhatsAppIcon.tsx

## Import Cycles
- None detected.

## Communities (12 total, 5 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.11
Nodes (22): @mkkellogg/gaussian-splats-3d, GaussianSplatViewer(), GaussianSplatViewerProps, InteractionHint(), ViewerState, ViewerControls(), ViewerControlsProps, ViewerFallback() (+14 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (38): dependencies, clsx, lucide-react, @mkkellogg/gaussian-splats-3d, next, react, react-dom, @supabase/supabase-js (+30 more)

### Community 2 - "WhatsAppIcon"
Cohesion: 0.23
Nodes (16): GaussianSplatViewer, PropertyDetailPage(), BrandLogo(), BrandLogoProps, ClientShell(), Footer(), Header(), HeaderProps (+8 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.20
Nodes (19): AdminPage(), DataContext, DataContextType, INITIAL_AGENT_PROFILE, INITIAL_BANK_RATES, INITIAL_FEATURED_BANNERS, INITIAL_PROPERTIES, compressVideoInBrowser() (+11 more)

### Community 4 - "useData"
Cohesion: 0.23
Nodes (20): lucide-react, next, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), PropiedadesContent() (+12 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "layout.tsx"
Cohesion: 0.50
Nodes (3): metadata, RootLayout(), DataProvider()

## Knowledge Gaps
- **68 isolated node(s):** `graphify`, `graphify`, `GaussianSplatViewerProps`, `ViewerState`, `ViewerControlsProps` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 77 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useData` to `GaussianSplatViewer.tsx`, `package.json`, `WhatsAppIcon`, `DataContext.tsx`?**
  _High betweenness centrality (0.214) - this node is a cross-community bridge._
- **What connects `graphify`, `graphify`, `GaussianSplatViewerProps` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10804597701149425 - nodes in this community are weakly interconnected._
- **Why does `next` connect `useData` to `layout.tsx`, `package.json`, `WhatsAppIcon`, `DataContext.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._