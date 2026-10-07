# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 45 files · ~140,805 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 194 nodes · 483 edges · 13 communities (8 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `715f8a38`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- GaussianSplatViewer.tsx
- package.json
- getWhatsAppUrl
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
- `HomePage()` --calls--> `getWhatsAppUrl()`  [EXTRACTED]
  src/app/page.tsx → src/lib/whatsapp.ts
- `PropertyDetailPage()` --calls--> `getWhatsAppUrl()`  [EXTRACTED]
  src/app/propiedades/[id]/page.tsx → src/lib/whatsapp.ts
- `Footer()` --calls--> `WhatsAppIcon()`  [EXTRACTED]
  src/components/Footer.tsx → src/components/WhatsAppIcon.tsx

## Import Cycles
- None detected.

## Communities (13 total, 5 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.10
Nodes (22): @mkkellogg/gaussian-splats-3d, GaussianSplatViewer(), GaussianSplatViewerProps, InteractionHint(), ViewerState, ViewerControls(), ViewerControlsProps, ViewerFallback() (+14 more)

### Community 1 - "package.json"
Cohesion: 0.06
Nodes (29): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+21 more)

### Community 2 - "getWhatsAppUrl"
Cohesion: 0.16
Nodes (17): next, metadata, RootLayout(), BrandLogo(), BrandLogoProps, ClientShell(), Footer(), Header() (+9 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.17
Nodes (23): AdminSecretPage(), PropiedadesPage(), PropertyCardProps, PropertyDetailModalProps, DataContext, DataContextType, INITIAL_AGENT_PROFILE, INITIAL_BANK_RATES (+15 more)

### Community 4 - "useData"
Cohesion: 0.26
Nodes (18): lucide-react, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), GaussianSplatViewer, PropertyDetailPage() (+10 more)

### Community 5 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+9 more)

### Community 8 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, clsx, lucide-react, @mkkellogg/gaussian-splats-3d, next, react, react-dom, @supabase/supabase-js (+1 more)

### Community 12 - "ÁUREA | Consultoría Inmobiliaria & Desarrollos"
Cohesion: 0.50
Nodes (3): 🏛️ Características Principales, 🚀 Puesta en Marcha, ÁUREA | Consultoría Inmobiliaria & Desarrollos

## Knowledge Gaps
- **70 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 82 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useData` to `GaussianSplatViewer.tsx`, `package.json`, `getWhatsAppUrl`, `DataContext.tsx`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1032258064516129 - nodes in this community are weakly interconnected._
- **Why does `next` connect `getWhatsAppUrl` to `package.json`, `DataContext.tsx`, `useData`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._