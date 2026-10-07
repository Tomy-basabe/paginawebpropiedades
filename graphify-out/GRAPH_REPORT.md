# Graph Report - Venta Inmobiliaria  (2026-10-07)

## Corpus Check
- 45 files · ~142,932 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 197 nodes · 487 edges · 14 communities (8 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `805a59a6`
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
9. `GaussianSplatViewer()` - 11 edges
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

## Communities (14 total, 6 thin omitted)

### Community 0 - "GaussianSplatViewer.tsx"
Cohesion: 0.10
Nodes (23): GaussianSplatViewer, GaussianSplatViewer(), GaussianSplatViewerProps, InteractionHint(), isEmbedViewer(), ViewerState, ViewerControls(), ViewerControlsProps (+15 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (28): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+20 more)

### Community 2 - "getWhatsAppUrl"
Cohesion: 0.18
Nodes (16): metadata, RootLayout(), BrandLogo(), BrandLogoProps, ClientShell(), Footer(), Header(), HeaderProps (+8 more)

### Community 3 - "DataContext.tsx"
Cohesion: 0.14
Nodes (23): @supabase/supabase-js, supabase, AdminSecretPage(), AdminUser, DEFAULT_ADMIN_USER, DataContext, DataContextType, INITIAL_AGENT_PROFILE (+15 more)

### Community 4 - "useData"
Cohesion: 0.23
Nodes (22): lucide-react, next, react, ContactoContent(), ContactoPage(), FinanciamientoPage(), HomePage(), PropertyDetailPage() (+14 more)

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
- **72 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+67 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 84 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `useData` to `GaussianSplatViewer.tsx`, `package.json`, `getWhatsAppUrl`, `DataContext.tsx`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _72 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GaussianSplatViewer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10080645161290322 - nodes in this community are weakly interconnected._
- **Why does `next` connect `useData` to `package.json`, `getWhatsAppUrl`, `DataContext.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `DataContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._