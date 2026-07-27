# Design approved release candidate — Milestone D1

## Safety point

- Branch before promotion: `feature/design-approved-preview`
- Clean base HEAD / last known legacy live route commit: `a31dcfeece0e55298779a3eded4b99e0b1058a15`
- Legacy live component: `src/pages/DesignPage.tsx`
- Legacy global stylesheet: `src/styles/design.css`
- Canonical approved component: `src/features/design-approved/DesignApprovedPage.tsx`
- Route registration before promotion: `/design` → `DesignPage`; `/design-approved-preview` → `DesignApprovedPage`

## Approved milestones

- Milestone A implementation: `29f8c576046be783a0182b15def1da2532f49b40`
- Milestone A visual baseline: `d740392f0401b5caf2d4aeede0bd0bf716c8f6fa`
- Milestone B: `2bffe2aa1d54079db68fd0aa926cd524c1decd11`
- Milestone C: `a31dcfeece0e55298779a3eded4b99e0b1058a15`

## Release-candidate route map

| Environment | Route | Component |
| --- | --- | --- |
| Production build | `/design` | `DesignApprovedPage` |
| Production build | `/design-approved-preview` | Not registered; falls through to 404 |
| Development only | `/design-approved-preview` | `DesignApprovedPage` for local diagnostics |
| All environments | `/` | Existing lazy `HomePage` |

`DesignApprovedPage` remains route-level lazy-loaded. No approved component is copied into the legacy DOM and no production alias route is retained.

## Legacy disposition

`src/pages/DesignPage.tsx` and `src/styles/design.css` had no consumers after the route switch and were removed. Rollback remains available through Git history rather than a hidden runtime route.

## Resume exception

No Resume/CV asset or external Resume URL exists in the repository or its Git history. On 2026-07-26 the owner explicitly approved retaining the localized `будет добавлено / coming soon` placeholder while the Resume remains in development. The placeholder is reachable on desktop and as the compact `CV` control on mobile.

## Visual evidence

- Hero baseline: `qa/baselines/design-approved/hero-approved-1746x1406.png`
- Milestone B baselines: `qa/baselines/design-approved/milestone-b/`
- Milestone C baseline: `qa/baselines/design-approved/milestone-c/`
- D1 live-route results: `qa/results/design-approved/milestone-d1/`

## Rollback

1. Create a new rollback commit; do not rewrite history.
2. Restore `src/pages/DesignPage.tsx` and `src/styles/design.css` from `a31dcfeece0e55298779a3eded4b99e0b1058a15`.
3. Restore the `DesignPage` lazy import, `/design` route registration, and global `design.css` import from that commit.
4. Run lint, typecheck, unit, build, canonical route E2E, and homepage regression suites.
5. Keep the approved implementation and its QA artifacts in history for a later promotion.
