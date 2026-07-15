type Mode = 'product' | 'design' | 'automation' | 'analytics'

export function HeroOverlay({ mode }: { mode: Mode }) {
  if (mode === 'product') return <svg className="hero-overlay" data-hero-overlay="product" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <g transform="translate(32,-4)">
      <path className="pd-conn pd-conn-1" d="M52 38 L96 58" />
      <path className="pd-conn pd-conn-2" d="M150 34 L96 58" />
      <path className="pd-conn pd-conn-3" d="M96 58 L96 92" />
      <circle className="pd-marker pd-marker-1" cx="52" cy="38" r="3" />
      <circle className="pd-marker pd-marker-2" cx="150" cy="34" r="3" />
      <circle className="pd-marker pd-marker-3" cx="96" cy="92" r="3" />
      <circle className="pd-marker pd-marker-4" cx="70" cy="86" r="3" />
      <circle className="pd-central" cx="96" cy="58" r="4" />
      <circle className="pd-hi" cx="52" cy="38" r="6" fill="none" stroke="rgba(49,213,205,0.5)" strokeWidth="1" />
      <circle className="pd-hi" cx="150" cy="34" r="6" fill="none" stroke="rgba(49,213,205,0.5)" strokeWidth="1" />
      <circle className="pd-signal" r="2.2" />
    </g>
  </svg>
  if (mode === 'design') return <svg className="hero-overlay" data-hero-overlay="design" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <rect className="ds-mask" x="0" y="0" width="200" height="120" fill="rgba(253,250,243,0.06)" />
    <path className="ds-line" d="M20 95 C 70 70, 120 100, 180 60" stroke="#c6a467" strokeWidth="1.3" fill="none" opacity="0.8" />
    <ellipse className="ds-light" cx="60" cy="40" rx="70" ry="30" fill="rgba(255,246,225,0.12)" />
  </svg>
  if (mode === 'automation') return <svg className="hero-overlay" data-hero-overlay="automation" viewBox="0 0 200 130" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <g transform="translate(38,-14)">
      <path className="au-glow" d="M28 22 L70 22 L100 50" />
      <path className="au-flow" d="M28 22 L70 22 L100 50" />
      <circle className="au-ring" cx="100" cy="50" r="10" />
      <path className="au-branch au-branch-1" d="M100 50 L100 85 L122 100" transform="rotate(45 100 50)" />
      <path className="au-branch au-branch-2" d="M100 50 L128 68 L150 92" />
      <circle className="au-complete" cx="150" cy="92" r="3.4" />
    </g>
  </svg>
  return <svg className="hero-overlay" data-hero-overlay="analytics" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <rect className="an-bar an-bar-1" x="30" y="55" width="10" height="30" fill="#2ea2ff" opacity="0.55" />
    <rect className="an-bar an-bar-2" x="55" y="40" width="10" height="45" fill="#2ea2ff" opacity="0.55" />
    <rect className="an-bar an-bar-3" x="80" y="50" width="10" height="35" fill="#2ea2ff" opacity="0.55" />
    <rect className="an-bar an-bar-4" x="105" y="25" width="10" height="60" fill="#2ea2ff" opacity="0.55" />
    <path className="an-line" d="M25 70 L60 45 L90 55 L120 20 L155 30" stroke="#8fbfff" strokeWidth="1.4" fill="none" />
    <circle className="an-point an-point-1" cx="60" cy="45" r="2.6" fill="#eef2ff" />
    <circle className="an-point an-point-2" cx="90" cy="55" r="2.6" fill="#eef2ff" />
    <circle className="an-point an-point-3" cx="120" cy="20" r="2.6" fill="#eef2ff" />
    <circle className="an-insight" cx="120" cy="20" r="5" fill="none" stroke="#8fbfff" strokeWidth="1.2" />
  </svg>
}
