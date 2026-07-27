# npm audit triage — Design release candidate

Audit date: 2026-07-26
Command: `npm audit --json`
Result: 3 high advisories, 0 critical.

No dependency was upgraded and `npm audit fix --force` was not run because routing behavior must remain frozen in Milestone D1.

## Findings

| Package | Installed | Dependency path | Scope | Affected code path in this SPA | Fixed version / action | Introduced by D1 |
| --- | --- | --- | --- | --- | --- | --- |
| `brace-expansion` | 5.0.7 | root → `eslint@10.7.0` → `minimatch@10.2.5` → `brace-expansion@5.0.7` (also reached through TypeScript ESLint tooling) | Transitive, development-only | Used by local lint/config glob processing. It is not bundled into the browser or exposed to remote input in the production SPA. Unbounded expansion can still affect developer/CI availability if an attacker controls lint glob input. | Advisory affects `<=5.0.7`; patched line begins after 5.0.7. `npm audit` reports a fix available. Handle as a separate non-routing dependency-maintenance commit after checking the resolved ESLint/minimatch tree. | No; present in the accepted Milestone C audit. |
| `react-router` | 7.18.1 | root → `react-router-dom@7.18.1` → `react-router@7.18.1` | Transitive production dependency | Client-side data-free browser routing is used. This SPA does not enable React Server Components or Router action endpoints, so the vulnerable RSC action-execution mode is not exercised. The package is nevertheless shipped and remains an audited production finding. | Advisory range `>=7.12.0 <8.3.0`. Current audit proposes `react-router-dom@7.11.0`, a behavior-changing downgrade marked SemVer-major by npm. Do not mix with D1; validate a fixed supported Router release separately. | No; present in the accepted Milestone C audit. |
| `react-router-dom` | 7.18.1 | Direct root production dependency; includes `react-router@7.18.1` | Direct production dependency | Provides `createBrowserRouter`, `Link`, lazy route navigation, hashes, and history used by homepage and Design. The advisory is inherited from the RSC-mode issue above; this application uses ordinary client-side SPA mode, not RSC actions. | Audit proposes 7.11.0 and marks the change SemVer-major. A routing upgrade/downgrade requires its own regression-tested follow-up commit. | No; present in the accepted Milestone C audit. |

## Follow-up recommendation

1. Update the ESLint/minimatch chain in a dedicated tooling-only commit if the lockfile resolves a patched `brace-expansion` without changing application dependencies.
2. Track the React Router advisory and move to a supported fixed release in a separate branch with the full route/history/CTA suite.
3. Keep the three findings visible until the lockfile is actually remediated; do not label them resolved merely because the current SPA does not use the vulnerable RSC mode.
