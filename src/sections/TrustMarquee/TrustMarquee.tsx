import { useApp } from '../../app/AppContext'
import { proofItems } from '../../data/portfolio'

export function TrustMarquee() {
  const { locale, t } = useApp()
  const groups = [0, 1]
  return <section className="proof-marquee" aria-label={t.facts}>
    <div className="marquee-track">
      {groups.map((group) => <div className="proof-group" key={group} aria-hidden={group === 1}>
        {proofItems.map((item) => <div className="proof-item" key={item.stat.en}><strong>{item.stat[locale]}</strong><span>{item.label[locale]}</span></div>)}
      </div>)}
    </div>
  </section>
}
