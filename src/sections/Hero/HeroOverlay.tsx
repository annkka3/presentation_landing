type Mode = 'product' | 'design' | 'automation' | 'analytics'

export function HeroOverlay({ mode }: { mode: Mode }) {
  if (mode === 'product') return <svg className="hero-overlay product-overlay" viewBox="0 0 300 520" aria-hidden="true" focusable="false">
    <g fill="none"><path className="overlay-path path-1" d="M42 164 116 202 178 168"/><path className="overlay-path path-2" d="m116 202 12 88 82 38"/><path className="overlay-path path-3" d="m128 290-66 52"/></g>
    <g fill="#5be0cf"><circle className="marker m1" cx="42" cy="164" r="3"/><circle className="marker m2" cx="116" cy="202" r="3"/><circle className="marker m3" cx="178" cy="168" r="3"/><circle className="marker m4" cx="128" cy="290" r="3"/><circle className="marker m5" cx="210" cy="328" r="3"/></g>
  </svg>
  if (mode === 'design') return <svg className="hero-overlay design-overlay" viewBox="0 0 300 520" aria-hidden="true" focusable="false">
    <defs><linearGradient id="design-light" x1="0" x2="1"><stop stopColor="#e2cf9d" stopOpacity="0"/><stop offset=".5" stopColor="#e2cf9d" stopOpacity=".28"/><stop offset="1" stopColor="#e2cf9d" stopOpacity="0"/></linearGradient></defs>
    <ellipse className="design-light" cx="150" cy="250" rx="116" ry="210" fill="url(#design-light)"/><path className="design-line" d="M28 358C82 286 170 398 272 276" fill="none" stroke="#e2cf9d" strokeWidth="1.2"/>
  </svg>
  if (mode === 'automation') return <svg className="hero-overlay automation-overlay" viewBox="0 0 300 520" aria-hidden="true" focusable="false">
    <g fill="none" strokeLinecap="round"><path className="automation-glow" d="M34 146C70 146 82 178 104 210C119 232 139 245 154 262"/><path className="automation-flow" d="M34 146C70 146 82 178 104 210C119 232 139 245 154 262"/><circle className="automation-ring" cx="154" cy="262" r="13"/><path className="automation-branch branch-1" d="M166 265C202 269 222 252 258 246"/><path className="automation-branch branch-2" d="M158 275C164 312 184 339 202 378"/></g><circle className="automation-signal" r="3.5"><animateMotion dur=".72s" path="M34 146C70 146 82 178 104 210C119 232 139 245 154 262" fill="freeze"/></circle><circle className="automation-complete" cx="202" cy="378" r="3.5"/>
  </svg>
  return <svg className="hero-overlay analytics-overlay" viewBox="0 0 300 520" aria-hidden="true" focusable="false">
    <g fill="#2ea2ff" opacity=".45"><rect className="bar b1" x="62" y="290" width="13" height="50"/><rect className="bar b2" x="90" y="260" width="13" height="80"/><rect className="bar b3" x="118" y="276" width="13" height="64"/><rect className="bar b4" x="146" y="226" width="13" height="114"/></g><path className="analytics-line" d="m40 318 55-52 44 14 48-72 64 20" fill="none" stroke="#79c6ff" strokeWidth="1.3"/><g fill="#79c6ff"><circle className="data-point p1" cx="95" cy="266" r="3"/><circle className="data-point p2" cx="139" cy="280" r="3"/><circle className="data-point p3" cx="187" cy="208" r="3"/></g><circle className="insight-ring" cx="187" cy="208" r="10" fill="none" stroke="#79c6ff" strokeWidth="1"/>
  </svg>
}
