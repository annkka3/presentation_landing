# Milestone D1 production build and asset-request comparison

## Build chunks

| Artifact | Milestone C | Milestone D1 | Result |
| --- | ---: | ---: | --- |
| Homepage lazy JS | 43.04 kB / 11.21 kB gzip | 43.04 kB / 11.21 kB gzip | Unchanged |
| Approved Design lazy JS | 56.82 kB / 15.92 kB gzip | 59.50 kB / 16.65 kB gzip | +2.68 kB raw for route metadata, focus/history synchronization, and release media lifecycle |
| Legacy Design lazy JS | 37.65 kB / 11.39 kB gzip | Absent | Removed |
| Global CSS | 156.28 kB / 28.61 kB gzip | 112.52 kB / 21.33 kB gzip | Legacy global Design CSS removed |
| Main application JS | 305.26 kB / 97.60 kB gzip | 305.10 kB / 97.59 kB gzip | Effectively unchanged |

The canonical Design implementation remains a separate route-level lazy chunk. Homepage navigation does not import it eagerly.

## Asset requests

The D1 Playwright release test records network requests across homepage → Design navigation:

- Homepage after `networkidle`: **0** requests under `/assets/design-approved/`.
- After navigating to `/design`: approved assets are requested from the lazy Design subtree.
- Homepage initial JS remains unchanged.
- Hero image retains `fetchpriority="high"` and fixed intrinsic dimensions.
- Chapters 2–10 images retain `loading="lazy"` and fixed dimensions.
- Motion video is inserted only when Chapter 08 is the direct/current chapter or its poster approaches the viewport, uses metadata preload, and is unloaded after leaving the chapter.

No duplicate legacy Design chunk is emitted. The production build does not register `/design-approved-preview`.

## Layout stability

All canonical images carry explicit width and height attributes, the Hero has fixed viewport geometry, and the full desktop/mobile screenshot matrix completed without horizontal overflow or blank route-loader captures. No CLS-producing wrapper was added during promotion.
