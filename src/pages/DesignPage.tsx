import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppContext'

type Localized = { ru: string; en: string }
type DesignChapter = { id: string; label: Localized }

const A = '/assets/design-page/'

const chapters: DesignChapter[] = [
  { id: 'design-hero', label: { ru: 'Hero', en: 'Hero' } },
  { id: 'design-directions', label: { ru: 'Направления', en: 'Capabilities' } },
  { id: 'design-fashion-system', label: { ru: 'Marketplace System', en: 'Marketplace System' } },
  { id: 'design-commerce', label: { ru: 'AI Production', en: 'AI Production' } },
  { id: 'design-brand-ux', label: { ru: 'Luxury и Brand', en: 'Luxury & Brand' } },
  { id: 'design-visual-system', label: { ru: 'Система', en: 'System Method' } },
  { id: 'design-marketplace', label: { ru: 'Коммерция', en: 'Commercial Studies' } },
  { id: 'design-motion', label: { ru: 'Motion', en: 'Motion' } },
  { id: 'design-principles', label: { ru: 'Принципы и процесс', en: 'Principles & Process' } },
  { id: 'design-contact', label: { ru: 'Контакт', en: 'Contact' } },
]

const ui = {
  ru: {
    eyebrow: 'DESIGN · VISUAL SYSTEMS',
    heroVerticalLabel: 'ART DIRECTION · DIGITAL · AI PRODUCTION',
    heroH1: 'Создаю визуальные\nсистемы, в которых\nэстетика работает\nна продукт.',
    heroSub: 'Соединяю UX/UI, арт-дирекцию, brand systems и AI-assisted production — от концепции и правил до готовой серии материалов.',
    ctaPrimary: 'Смотреть дизайн-кейсы ↓',
    ctaSecondary: 'Обсудить проект →',
    scrollHint: 'Прокрутите',
    capabilitiesHeading: 'Направления дизайна',
    capabilitiesSub: 'Работаю с визуалом как с системой: определяю логику, правила, компоненты и способы масштабирования на разные форматы.',
    viewCase: 'Открыть кейс →',
    railHeading: 'Как визуал становится системой',
    railSub: 'Сильный результат строится не с финальной картинки, а с понимания исходных данных, ограничений, правил и сценариев масштабирования.',
    railProjectLabel: 'ОДИН ПРОЕКТ · MARKETPLACE VISUAL SYSTEM',
    commercialHeading: 'Коммерческие marketplace-кейсы',
    commercialSub: 'Кейсы, где визуальное решение строится вокруг пользовательского выбора, конкурентной среды и коммерческой гипотезы.',
    motionThesis: 'ЭМОЦИЯ · КОНТРОЛЬ · МАСШТАБ',
    motionHeading: 'AI motion и серийный контент',
    motionSub: 'Системы для короткого видео, UGC и последовательного развития визуального персонажа.',
    principlesHeading: 'Принципы',
    principlesStatement: 'Система важнее отдельного визуального эффекта.',
    processHeading: 'Процесс',
    toolsHeading: 'Инструменты и результаты',
    outputsCol: 'Результаты',
    finalHeading: 'Нужна визуальная система, а не набор разрозненных макетов?',
    finalText: 'Опишите продукт, формат и задачу — я помогу выстроить визуальную логику и довести её до готового к использованию результата.',
    finalPrimary: 'Обсудить проект →',
    finalSecondary: 'Смотреть все кейсы',
    finalCapabilityLine: 'UX/UI · Brand · E-commerce · AI Production',
    backToTop: 'Наверх ↑',
    heroLabelCommerce: 'DIGITAL COMMERCE',
    heroLabelBrand: 'BRAND SYSTEM',
    heroLabelMobile: 'MOBILE EXPERIENCE',
    abImgAlt: 'A/B-тест карточки Eclipse Drape Gown',
    motionEmotionLabel: '01 · ЭМОЦИЯ',
    motionControlLabel: '02 · КОНТРОЛЬ',
    motionScaleLabel: '03 · МАСШТАБ',
    motionScenariosLabel: '5 SHORT-FORM СЦЕНАРИЕВ',
    motionEmotionTitle: 'UGC-ролики с виртуальной моделью',
    motionEmotionText: 'Серия коротких роликов для одного продукта: эмоциональный hero, примерка, посадка, движение ткани и close-up деталей.',
    motionControlTitle: 'Система консистентности AI-персонажа',
    motionControlText: 'Character sheet, правила внешности, света, костюма и ракурсов для сохранения узнаваемости между сценами.',
    motionScaleTitle: 'Сценарная система и адаптация форматов',
    motionScaleText: 'Одна визуальная идея превращается в серию роликов, кадров и публикаций для разных каналов.',
    motionOutputLine: 'OUTPUT: 5 СЦЕНАРИЕВ · 4 ФОРМАТА · 1 CONSISTENT CHARACTER',
  },
  en: {
    eyebrow: 'DESIGN · VISUAL SYSTEMS',
    heroVerticalLabel: 'ART DIRECTION · DIGITAL · AI PRODUCTION',
    heroH1: 'I create visual systems\nwhere aesthetics\nwork for the product.',
    heroSub: 'I combine UX/UI, art direction, brand systems, and AI-assisted production — from concept and governing rules to a complete visual output.',
    ctaPrimary: 'View design cases ↓',
    ctaSecondary: 'Discuss a project →',
    scrollHint: 'Scroll to explore',
    capabilitiesHeading: 'Design capabilities',
    capabilitiesSub: 'I approach design as a system by defining its logic, rules, components, and how it scales across formats.',
    viewCase: 'View case study →',
    railHeading: 'How a visual becomes a system',
    railSub: 'A strong result does not begin with the final image. It begins with source material, constraints, governing rules, and scaling scenarios.',
    railProjectLabel: 'ONE PROJECT · MARKETPLACE VISUAL SYSTEM',
    commercialHeading: 'Commercial marketplace studies',
    commercialSub: 'Cases where visual design is built around customer choice, competitive context, and commercial hypotheses.',
    motionThesis: 'EMOTION · CONTROL · SCALE',
    motionHeading: 'AI motion and serial content',
    motionSub: 'Systems for short-form video, UGC, and consistent visual character development.',
    principlesHeading: 'Design principles',
    principlesStatement: 'The system matters more than a single visual effect.',
    processHeading: 'Process',
    toolsHeading: 'Tools and outputs',
    outputsCol: 'Outputs',
    finalHeading: 'Need a visual system, not a collection of disconnected layouts?',
    finalText: 'Describe the product, format, and task, and I will help define the visual logic and turn it into a usable final system.',
    finalPrimary: 'Discuss a project →',
    finalSecondary: 'View all cases',
    finalCapabilityLine: 'UX/UI · Brand · E-commerce · AI Production',
    backToTop: 'Back to top ↑',
    heroLabelCommerce: 'DIGITAL COMMERCE',
    heroLabelBrand: 'BRAND SYSTEM',
    heroLabelMobile: 'MOBILE EXPERIENCE',
    abImgAlt: 'Eclipse Drape Gown A/B test card',
    motionEmotionLabel: '01 · EMOTION',
    motionControlLabel: '02 · CONTROL',
    motionScaleLabel: '03 · SCALE',
    motionScenariosLabel: '5 SHORT-FORM SCENARIOS',
    motionEmotionTitle: 'Virtual Model UGC Series',
    motionEmotionText: 'A short-form series for one product: emotional hero, try-on, fit, fabric movement and construction details.',
    motionControlTitle: 'AI Character Consistency System',
    motionControlText: 'A character sheet and appearance, lighting, wardrobe and camera rules that preserve identity across scenes.',
    motionScaleTitle: 'Scenario System & Format Adaptation',
    motionScaleText: 'One visual concept becomes a coordinated series of videos, stills and channel-ready formats.',
    motionOutputLine: 'OUTPUT: 5 SCENARIOS · 4 FORMATS · 1 CONSISTENT CHARACTER',
  },
} as const

const proofPoints = [
  { stat: { ru: '20+ лет', en: '20+ years' }, label: { ru: 'в fashion, retail и коммерческом продукте', en: 'in fashion, retail, and commercial products' } },
  { stat: { ru: 'Design systems', en: 'Design systems' }, label: { ru: 'UX/UI · Brand · E-commerce', en: 'UX/UI · Brand · E-commerce' } },
  { stat: { ru: 'Full-cycle', en: 'Full-cycle' }, label: { ru: 'от концепции до production-ready системы', en: 'from concept to a production-ready system' } },
]

const heroDirections = [
  { num: '01', label: { ru: 'UX/UI', en: 'UX/UI' }, outcome: { ru: 'От flows к масштабируемым интерфейсам', en: 'From flows to scalable interfaces' } },
  { num: '02', label: { ru: 'ЛЕНДИНГИ', en: 'LANDING' }, outcome: { ru: 'От оффера к конверсии', en: 'From offer to conversion' } },
  { num: '03', label: { ru: 'COMMERCE', en: 'COMMERCE' }, outcome: { ru: 'От одного SKU к системе каталога', en: 'From one SKU to a catalog system' } },
  { num: '04', label: { ru: 'БРЕНД', en: 'BRAND' }, outcome: { ru: 'От идеи к узнаваемому языку', en: 'From idea to a recognisable language' } },
  { num: '05', label: { ru: 'MOTION', en: 'MOTION' }, outcome: { ru: 'От статики к серийному контенту', en: 'From static assets to serial content' } },
]

const capabilities = [
  { num: '01', title: { ru: 'UX/UI и продуктовые интерфейсы', en: 'UX/UI & Product Interfaces' }, outcome: { ru: 'ОТ FLOWS К МАСШТАБИРУЕМЫМ ИНТЕРФЕЙСАМ', en: 'FROM FLOWS TO SCALABLE INTERFACES' }, desc: { ru: 'User flows, информационная архитектура, responsive UX, компоненты и состояния продукта.', en: 'User flows, information architecture, responsive UX, component systems, and product states.' }, sample: 'case-anna-gromyko-portfolio.png', pos: '50% 28%' },
  { num: '02', title: { ru: 'Лендинги и конверсионные воронки', en: 'Landing Pages & Conversion Funnels' }, outcome: { ru: 'ОТ ОФФЕРА К КОНВЕРСИИ', en: 'FROM OFFER TO CONVERSION' }, desc: { ru: 'Структура нарратива, ценностное предложение, иерархия CTA, формы и измеримые пути конверсии.', en: 'Narrative structure, value proposition, CTA hierarchy, forms, and measurable conversion paths.' }, sample: 'case-risk-journal-analytics.png', pos: '50% 40%' },
  { num: '03', title: { ru: 'Marketplace и commerce-системы', en: 'Marketplace & Commerce Systems' }, outcome: { ru: 'ОТ ОДНОГО SKU К МАСШТАБИРУЕМОЙ СИСТЕМЕ', en: 'FROM ONE SKU TO A SCALABLE SYSTEM' }, desc: { ru: 'Карточки товара, фотоворонки, rich-контент, AI-production и масштабирование каталога.', en: 'Product cards, visual funnels, rich content, AI-assisted production, and catalog scaling.' }, sample: 'case-marketplace-visual-systems.png', pos: '50% 12%' },
  { num: '04', title: { ru: 'Бренд и арт-дирекшн', en: 'Brand Identity & Art Direction' }, outcome: { ru: 'ОТ ИДЕИ К УЗНАВАЕМОМУ ЯЗЫКУ', en: 'FROM IDEA TO A RECOGNISABLE LANGUAGE' }, desc: { ru: 'Айдентика, типографика, цвет, кампании и визуальная система бренда для всех каналов.', en: 'Identity, typography, color, campaign direction, and a cross-channel visual language.' }, sample: 'case-the-dao-way.png', pos: '50% 45%' },
  { num: '05', title: { ru: 'Motion и визуальный сторителлинг', en: 'Motion & Visual Storytelling' }, outcome: { ru: 'ОТ СТАТИКИ К СЕРИЙНОМУ КОНТЕНТУ', en: 'FROM STATIC ASSETS TO SERIAL CONTENT' }, desc: { ru: 'Motion-системы, AI-video, презентации и адаптация кампаний под форматы и каналы.', en: 'Motion systems, AI-assisted video, presentations, and campaign adaptation across formats.' }, sample: 'motion-emotion-01-hero.png', pos: '50% 15%' },
]

const lookbook = ['case1-cover.png', 'lookbook-1.png', 'lookbook-2.png', 'lookbook-3.png', 'lookbook-4.png', 'lookbook-5.png']

const cases = {
  fashion: { title: { ru: 'Визуальная система для fashion-бренда', en: 'Visual System for a Fashion Brand' }, category: { ru: 'FASHION E-COMMERCE · DESIGN SYSTEM', en: 'FASHION E-COMMERCE · DESIGN SYSTEM' }, role: { ru: 'Visual Strategy · Marketplace Design · Content System', en: 'Visual Strategy · Marketplace Design · Content System' }, description: { ru: 'Масштабируемая система карточек и rich-контента для оформления большого каталога без потери узнаваемости, качества и мобильной читаемости.', en: 'A scalable product-card and rich-content system for building a large catalog without losing brand recognition, quality, or mobile readability.' }, tags: { ru: 'Marketplace · Design system · SKU scaling', en: 'Marketplace · Design system · SKU scaling' } },
  pipeline: { title: { ru: 'AI-Assisted Fashion Production Pipeline', en: 'AI-Assisted Fashion Production Pipeline' }, category: { ru: 'AI PRODUCTION · APPAREL PIPELINE', en: 'AI PRODUCTION · APPAREL PIPELINE' }, description: { ru: 'Один SKU, проведённый через полный конвейер: ghost mannequin спереди и сзади, деталь кроя, модель, десктоп и мобильная карточка.', en: 'One SKU carried through the full pipeline: front and back ghost mannequin, construction detail, on-model shot, desktop and mobile card.' }, tags: { ru: 'AI production · Consistency', en: 'AI production · Consistency' } },
  ab: { title: { ru: 'A/B-тест — Eclipse Drape Gown', en: 'A/B Test — Eclipse Drape Gown' }, category: { ru: 'MAISON NOIREE · A/B ТЕСТ', en: 'MAISON NOIREE · A/B TEST' }, description: { ru: 'Вариант A — editorial on-model hero: эмоциональная подача и контекст.\nВариант B — product-first composition: силуэт, конструкция и детали. Период теста — 14 дней.', en: 'Variant A — editorial on-model hero: emotional framing and context.\nVariant B — product-first composition: silhouette, construction and detail. 14-day test period.' } },
  eyewear: { title: { ru: 'Eufashion Glasses — Luxury E-commerce System', en: 'Eufashion Glasses — Luxury E-commerce System' }, category: { ru: 'LUXURY E-COMMERCE · AI ART DIRECTION', en: 'LUXURY E-COMMERCE · AI ART DIRECTION' }, description: { ru: 'Премиальная digital-система для eyewear-бренда: карточки товаров, AI-визуалы и единая подача ассортимента без искажения геометрии оправы.', en: 'A premium digital system for an eyewear brand: product cards, AI visuals, and a consistent assortment presentation that preserves the frame’s real geometry.' }, tags: { ru: 'Luxury · E-commerce · Consistency', en: 'Luxury · E-commerce · Consistency' } },
}

const digitalCases = [
  { num: '01', title: 'Maison Noiree', category: 'BRAND SYSTEM', tags: 'Identity · Typography · Guidelines', cover: 'case-the-dao-way.png', fit: 'cover', pos: '50% 45%' },
  { num: '02', title: 'Anna Gromyko Portfolio', category: 'UX/UI PORTFOLIO', tags: 'UX/UI · Responsive · Motion', cover: 'case-anna-portfolio.png', fit: 'contain', pos: '50% 100%' },
]

const railStages = [
  { num: '01 SOURCE', title: { ru: 'Источник', en: 'Source' }, desc: { ru: 'Оригинальные фото платья, доступные ракурсы и исходная карточка листинга.', en: 'Original dress photography, available angles, and the original listing card.' }, thumb: 'rail-01-source.png', pos: '50% 25%' },
  { num: '02 ANALYSIS', title: { ru: 'Анализ и правила', en: 'Analysis & rules' }, desc: { ru: 'Конкурентный обзор, структура слайдов, типографика и правила мобильной читаемости.', en: 'Competitor review, slide structure, typography, and mobile-readability rules.' }, thumb: 'rail-02-analysis.png', pos: '0% 0%' },
  { num: '03 PRODUCTION', title: { ru: 'Production', en: 'Production' }, desc: { ru: 'Обложка, посадка, деталь кроя, размерная сетка, модель и rich-контент.', en: 'Cover, fit, construction detail, sizing, model, and rich content.' }, thumb: 'rail-03-production.png', pos: '50% 8%' },
  { num: '04 SYSTEM', title: { ru: 'Система', en: 'System' }, desc: { ru: 'Десктоп, мобильная версия, вариации SKU и масштабируемый шаблон каталога.', en: 'Desktop, mobile, SKU variations, and a scalable catalog template.' }, thumb: 'rail-04-system.png', pos: '50% 0%' },
]

const commercialCases = [
  { cover: 'case7-1-cover.png', title: { ru: 'Редизайн карточки женской одежды', en: 'Women’s Fashion Listing Redesign' }, category: { ru: 'MARKETPLACE REDESIGN', en: 'MARKETPLACE REDESIGN' }, role: { ru: 'Audit · Visual Funnel · A/B', en: 'Audit · Visual Funnel · A/B' }, description: { ru: 'Аудит текущей карточки и новая фотоворонка из 10 слайдов с адаптацией под WB, Ozon и Lamoda.', en: 'An audit of the current listing and a new 10-slide visual funnel adapted for WB, Ozon, and Lamoda.' }, status: { ru: 'Концепт', en: 'Concept' } },
  { cover: 'case7-2-cover-ru.png', coverEn: 'case7-2-cover-en.png', title: { ru: 'Аналитика карточек и конкурентов', en: 'Marketplace Competitor & Card Analytics' }, category: { ru: 'MARKETPLACE ANALYTICS', en: 'MARKETPLACE ANALYTICS' }, role: { ru: 'Competitor Analysis · Recommendations', en: 'Competitor Analysis · Recommendations' }, description: { ru: 'Структурированный анализ 10–20 конкурентов и рекомендации по продукту, упаковке и фотоворонке.', en: 'A structured analysis of 10–20 competitors with recommendations on product, packaging, and visual funnel.' }, status: { ru: 'Исследование', en: 'Research' } },
  { cover: 'case7-3-cover.png', title: { ru: 'AI-кампания для fashion-бренда', en: 'AI Campaign for a Fashion Brand' }, category: { ru: 'CAMPAIGN SYSTEM', en: 'CAMPAIGN SYSTEM' }, role: { ru: 'Campaign Concept · Channel Adaptation', en: 'Campaign Concept · Channel Adaptation' }, description: { ru: 'Одна рекламная идея, масштабированная на баннер, Stories, Reels и карточку товара.', en: 'One visual idea scaled across a banner, Stories, Reels, and product card.' }, status: { ru: 'Концепт', en: 'Concept' } },
]

const motionFilmstrip = [
  { src: 'motion-emotion-01-hero.png', label: { ru: 'HERO', en: 'HERO' } },
  { src: 'motion-emotion-02-tryon.png', label: { ru: 'ПРИМЕРКА', en: 'TRY-ON' } },
  { src: 'motion-emotion-03-fit.png', label: { ru: 'ПОСАДКА', en: 'FIT' } },
  { src: 'motion-emotion-04-fabric.png', label: { ru: 'ТКАНЬ', en: 'FABRIC' } },
  { src: 'motion-emotion-05-detail.png', label: { ru: 'ДЕТАЛЬ', en: 'DETAIL' } },
]

const motionAngles = ['motion-control-07.png', 'motion-control-09.png', 'motion-control-10.png', 'motion-control-12.png']
const motionTokens = { ru: ['ЛИЦО', 'ВОЛОСЫ', 'КОСТЮМ', 'СВЕТ', 'КАМЕРА', 'НЕ МЕНЯТЬ'], en: ['FACE', 'HAIR', 'WARDROBE', 'LIGHT', 'CAMERA', 'DO NOT CHANGE'] }
const storyboard = ['motion-scale-format-34.png', 'motion-scale-format-916.png', 'motion-scale-format-11.png', 'motion-scale-format-169.png', 'motion-scale-format-45.png']

const principles = [
  { ru: 'Сначала функция, затем эффект.', en: 'Function before effect.' },
  { ru: 'Один визуальный язык на всех носителях.', en: 'One visual language across every touchpoint.' },
  { ru: 'AI не должен изменять реальный продукт.', en: 'AI must not alter the real product.' },
  { ru: 'Система должна масштабироваться.', en: 'The system must scale.' },
  { ru: 'Motion объясняет структуру, а не украшает её.', en: 'Motion should explain structure, not decorate it.' },
  { ru: 'Дизайн должен работать в реальном формате публикации.', en: 'Design must work in its real publishing format.' },
]

const processSteps = [
  { num: '01', title: { ru: 'Контекст', en: 'Context' }, desc: { ru: 'Задача, аудитория, ограничения и критерии результата.', en: 'Task, audience, constraints, and success criteria.' } },
  { num: '02', title: { ru: 'Исследование', en: 'Research' }, desc: { ru: 'Конкуренты, визуальные паттерны, контекст категории.', en: 'Competitors, visual patterns, category context.' } },
  { num: '03', title: { ru: 'Структура', en: 'Structure' }, desc: { ru: 'Иерархия, фотоворонка, user flows.', en: 'Hierarchy, visual funnel, user flows.' } },
  { num: '04', title: { ru: 'Направление', en: 'Direction' }, desc: { ru: 'Визуальная концепция, типографика, цвет.', en: 'Visual direction, typography, color.' } },
  { num: '05', title: { ru: 'Production', en: 'Production' }, desc: { ru: 'Компоненты, экраны, сцены, слайды, motion.', en: 'Components, screens, scenes, slides, motion.' } },
  { num: '06', title: { ru: 'Проверка', en: 'Validation' }, desc: { ru: 'Читаемость, mobile UX, консистентность.', en: 'Readability, mobile UX, consistency.' } },
  { num: '07', title: { ru: 'Передача', en: 'Handoff' }, desc: { ru: 'Правила, шаблоны, исходники, требования.', en: 'Rules, templates, source files, requirements.' } },
]

const tools = [
  { label: 'STRATEGY & UX', line: 'Figma · Claude · ChatGPT' },
  { label: 'AI PRODUCTION', line: 'Midjourney · Krea · Higgsfield · Photoshop' },
  { label: 'DELIVERY', line: 'Codex · Cursor · React/CSS' },
  { label: 'DATA', line: 'Python · SQL' },
]
const outputs = ['Design systems', 'UX/UI', 'Brand systems', 'Marketplace systems', 'Rich content', 'Motion specifications', 'Quality-control checklists', 'Production handoff']

function src(file: string) {
  return `${A}${file}`
}

function DesignCase({ title, meta, text, img, alt }: { title: string; meta: string; text: string; img: string; alt: string }) {
  return <article className="design-case-card">
    <img src={src(img)} alt={alt} width="1536" height="1024" loading="lazy" decoding="async" />
    <span>{meta}</span>
    <h3>{title}</h3>
    <p>{text}</p>
  </article>
}

export default function DesignPage() {
  const { locale, setLocale, theme, toggleTheme } = useApp()
  const text = ui[locale]
  const containerRef = useRef<HTMLElement>(null)
  const emotionVideoRef = useRef<HTMLVideoElement>(null)
  const [activeChapter, setActiveChapter] = useState(() => {
    const index = chapters.findIndex((chapter) => chapter.id === window.location.hash.slice(1))
    return index >= 0 ? index : 0
  })
  const [lookbookIndex, setLookbookIndex] = useState(0)
  const [activeDirection, setActiveDirection] = useState(0)
  const [heroDirection, setHeroDirection] = useState<number | null>(null)
  const [activePrinciple, setActivePrinciple] = useState(0)
  const [activeProcess, setActiveProcess] = useState(0)
  const activeCapability = capabilities[activeDirection]
  const process = processSteps[activeProcess]

  useEffect(() => {
    document.documentElement.dataset.page = 'design'
    document.title = locale === 'ru' ? 'Дизайн и визуальные системы — Anna Gromyko' : 'Design & Visual Systems — Anna Gromyko'
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = locale === 'ru'
      ? 'UX/UI, лендинги, конверсионные воронки, marketplace и commerce-системы, brand identity, art direction, AI motion и visual storytelling.'
      : 'UX/UI, landing pages, conversion funnels, marketplace and commerce systems, brand identity, art direction, AI motion, and visual storytelling.'
    return () => {
      if (document.documentElement.dataset.page === 'design') delete document.documentElement.dataset.page
    }
  }, [locale])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const nearest = chapters.reduce((best, chapter, index) => {
          const node = document.getElementById(chapter.id)
          if (!node) return best
          const distance = Math.abs(node.offsetTop - container.scrollTop)
          return distance < best.distance ? { index, distance } : best
        }, { index: 0, distance: Number.POSITIVE_INFINITY })
        setActiveChapter((current) => current === nearest.index ? current : nearest.index)
      })
    }
    const goHash = () => {
      const id = window.location.hash.slice(1)
      const index = chapters.findIndex((chapter) => chapter.id === id)
      const target = index >= 0 ? document.getElementById(chapters[index].id) : document.getElementById(chapters[0].id)
      if (index >= 0) setActiveChapter(index)
      if (target) container.scrollTo({ top: target.offsetTop, behavior: 'auto' })
      update()
    }
    container.addEventListener('scroll', update, { passive: true })
    addEventListener('hashchange', goHash)
    goHash()
    return () => {
      cancelAnimationFrame(frame)
      container.removeEventListener('scroll', update)
      removeEventListener('hashchange', goHash)
    }
  }, [])

  useEffect(() => {
    const video = emotionVideoRef.current
    if (!video || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause()
    }, { threshold: 0.1 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const goToChapter = (index: number) => {
    const target = chapters[index]
    if (!target) return
    history.pushState(history.state, '', `/design#${target.id}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  return <main id="main" className={`design-page design-page--${theme}`} ref={containerRef} aria-label="Design portfolio route">
    <nav className="design-rail" aria-label={locale === 'ru' ? 'Навигация Design Page' : 'Design page navigation'}>
      <span>{String(activeChapter + 1).padStart(2, '0')}</span>
      <div className="design-rail-track"><i style={{ top: `${(activeChapter / 9) * 100}%` }} />
        {chapters.map((chapter, index) => <button key={chapter.id} type="button" aria-label={`${index + 1}: ${chapter.label[locale]}`} aria-current={activeChapter === index ? 'step' : undefined} onClick={() => goToChapter(index)}><em>{chapter.label[locale]}</em></button>)}
      </div>
      <span>10</span>
    </nav>

    <section id="design-hero" className="design-chapter design-hero" aria-labelledby="design-hero-title">
      <header className="design-hero-header">
        <Link className="design-hero-brandmark" to="/">
          <span>ANNA GROMYKO</span>
          <small>AI PRODUCT BUILDER</small>
        </Link>
        <nav aria-label={locale === 'ru' ? 'Основная навигация' : 'Primary navigation'}>
          <button type="button" onClick={() => goToChapter(2)}>Product</button>
          <button type="button" className="is-active" onClick={() => goToChapter(1)}>Design</button>
          <button type="button" onClick={() => goToChapter(3)}>Automation</button>
          <button type="button" onClick={() => goToChapter(6)}>Analytics</button>
          <Link to="/#contact">{locale === 'ru' ? 'Контакты' : 'Contact'}</Link>
        </nav>
        <div className="design-hero-controls">
          <div className="design-hero-language" role="group" aria-label={locale === 'ru' ? 'Язык' : 'Language'}>
            <button type="button" aria-pressed={locale === 'ru'} onClick={() => setLocale('ru')}>RU</button>
            <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>EN</button>
          </div>
          <button className="design-hero-theme" type="button" onClick={toggleTheme} aria-label={locale === 'ru' ? 'Переключить тему' : 'Toggle theme'}>
            <span aria-hidden="true">{theme === 'light' ? '◐' : '☀'}</span>
          </button>
          <button className="design-hero-resume" type="button">{locale === 'ru' ? 'Резюме' : 'Résumé'}</button>
        </div>
      </header>
      <div className="design-hero-media">
        <picture><img src={src('hero-fashion.png')} alt="" width="1600" height="1200" loading="eager" fetchPriority="high" decoding="async" /></picture>
        <video src={src('case1-hover.mp4')} muted loop playsInline preload="metadata" aria-hidden="true" />
      </div>
      <div className="design-hero-copy">
        <span className="design-kicker">{text.eyebrow}</span>
        <h1 id="design-hero-title">{text.heroH1}</h1>
        <p>{text.heroSub}</p>
        <div className="design-hero-index" aria-label={locale === 'ru' ? 'Дизайн направления' : 'Design directions'}>
          {heroDirections.map((direction, index) => <button key={direction.num} type="button" onPointerEnter={() => setHeroDirection(index)} onFocus={() => setHeroDirection(index)} onBlur={() => setHeroDirection(null)}>
            <span>{direction.num}</span>{direction.label[locale]}
          </button>)}
          <small>{heroDirection === null ? '' : heroDirections[heroDirection].outcome[locale]}</small>
        </div>
        <div className="design-hero-actions">
          <a href="#design-fashion-system">{text.ctaPrimary}</a>
          <Link to="/#contact">{text.ctaSecondary}</Link>
        </div>
        <dl className="design-proof">
          {proofPoints.map((point) => <div key={point.stat.en}><dt>{point.stat[locale]}</dt><dd>{point.label[locale]}</dd></div>)}
        </dl>
      </div>
      <div className="design-hero-axis"><span>01</span><i>{text.heroVerticalLabel}</i></div>
      <div className="design-hero-installation">
        <figure><img src={src('hero-eyewear.png')} alt={text.heroLabelCommerce} width="1000" height="700" decoding="async" /><figcaption>{text.heroLabelCommerce}</figcaption></figure>
        <figure><img src={src('hero-brand.png')} alt={text.heroLabelBrand} width="1000" height="700" decoding="async" /><figcaption>{text.heroLabelBrand}</figcaption></figure>
        <figure><img src={src('hero-mobile.png')} alt={text.heroLabelMobile} width="600" height="900" decoding="async" /><figcaption>{text.heroLabelMobile}</figcaption></figure>
      </div>
      <button className="design-scroll-cue" type="button" onClick={() => goToChapter(1)}>01 / 10 · {text.scrollHint} ↓</button>
    </section>

    <section id="design-directions" className="design-chapter design-directions" aria-labelledby="design-directions-title">
      <header><span className="design-kicker">02 · INDEX</span><h2 id="design-directions-title">{text.capabilitiesHeading}</h2><p>{text.capabilitiesSub}</p></header>
      <div className="design-directions-grid">
        <div className="design-direction-list" role="tablist" aria-label={text.capabilitiesHeading}>
          {capabilities.map((item, index) => <button key={item.num} type="button" role="tab" aria-selected={activeDirection === index} onPointerEnter={() => setActiveDirection(index)} onFocus={() => setActiveDirection(index)} onClick={() => setActiveDirection(index)}>
            <span>{item.num}</span><strong>{item.title[locale]}</strong><small>{item.outcome[locale]}</small>
          </button>)}
        </div>
        <aside className="design-direction-preview">
          <img key={activeCapability.sample} src={src(activeCapability.sample)} alt={activeCapability.title[locale]} width="1600" height="1000" loading="lazy" decoding="async" style={{ objectPosition: activeCapability.pos }} />
          <span>{activeCapability.outcome[locale]}</span>
          <h3>{activeCapability.title[locale]}</h3>
          <p>{activeCapability.desc[locale]}</p>
        </aside>
      </div>
    </section>

    <section id="design-fashion-system" className="design-chapter design-case-feature" aria-labelledby="design-fashion-title">
      <div className="design-lookbook">
        <img src={src(lookbook[lookbookIndex])} alt={`Maison Noiree lookbook ${lookbookIndex + 1}`} width="1600" height="1000" loading="eager" decoding="async" />
        <div><button type="button" onClick={() => setLookbookIndex((index) => (index + lookbook.length - 1) % lookbook.length)} aria-label="Previous lookbook slide">←</button><button type="button" onClick={() => setLookbookIndex((index) => (index + 1) % lookbook.length)} aria-label="Next lookbook slide">→</button></div>
      </div>
      <article>
        <span className="design-kicker">03 · {cases.fashion.category[locale]}</span>
        <h2 id="design-fashion-title">{cases.fashion.title[locale]}</h2>
        <p>{cases.fashion.description[locale]}</p>
        <small>{cases.fashion.role[locale]} · {cases.fashion.tags[locale]}</small>
        <Link to="/projects/marketplace-visual-systems">{text.viewCase}</Link>
      </article>
    </section>

    <section id="design-commerce" className="design-chapter design-commerce" aria-labelledby="design-commerce-title">
      <DesignCase title={cases.pipeline.title[locale]} meta={`04 · ${cases.pipeline.category[locale]}`} text={cases.pipeline.description[locale]} img="case2-ai-pipeline.png" alt={cases.pipeline.title[locale]} />
      <article className="design-ab-card">
        <img src={src('ab-test-eclipse.png')} alt={text.abImgAlt} width="1024" height="1024" loading="lazy" decoding="async" />
        <span>{cases.ab.category[locale]}</span>
        <h3 id="design-commerce-title">{cases.ab.title[locale]}</h3>
        <p>{cases.ab.description[locale]}</p>
      </article>
    </section>

    <section id="design-brand-ux" className="design-chapter design-brand" aria-labelledby="design-brand-title">
      <article className="design-brand-hero">
        <img src={src('case-eufashion-glasses.png')} alt={cases.eyewear.title[locale]} width="1600" height="940" loading="lazy" decoding="async" />
        <div><span className="design-kicker">05 · {cases.eyewear.category[locale]}</span><h2 id="design-brand-title">{cases.eyewear.title[locale]}</h2><p>{cases.eyewear.description[locale]}</p><small>{cases.eyewear.tags[locale]}</small></div>
      </article>
      <div className="design-digital-cases">
        {digitalCases.map((item) => <article key={item.title}>
          <img src={src(item.cover)} alt={item.title} width="1200" height="900" loading="lazy" decoding="async" style={{ objectFit: item.fit, objectPosition: item.pos } as CSSProperties} />
          <span>{item.num} · {item.category}</span><h3>{item.title}</h3><p>{item.tags}</p>
        </article>)}
      </div>
    </section>

    <section id="design-visual-system" className="design-chapter design-system-rail" aria-labelledby="design-system-title">
      <h2 id="design-system-title">{text.railHeading}</h2><p>{text.railSub}</p><span className="design-kicker">{text.railProjectLabel}</span>
      <div>{railStages.map((stage) => <article key={stage.num}><span>{stage.num}</span><img src={src(stage.thumb)} alt="" width="683" height="1000" loading="lazy" decoding="async" style={{ objectPosition: stage.pos }} /><h3>{stage.title[locale]}</h3><p>{stage.desc[locale]}</p></article>)}</div>
    </section>

    <section id="design-marketplace" className="design-chapter design-marketplace" aria-labelledby="design-marketplace-title">
      <header><h2 id="design-marketplace-title">{text.commercialHeading}</h2><p>{text.commercialSub}</p></header>
      <div>{commercialCases.map((item) => <DesignCase key={item.title.en} title={item.title[locale]} meta={item.category[locale]} text={item.description[locale]} img={locale === 'en' && item.coverEn ? item.coverEn : item.cover} alt={item.title[locale]} />)}</div>
    </section>

    <section id="design-motion" className="design-chapter design-motion" aria-labelledby="design-motion-title">
      <span className="design-kicker">{text.motionThesis}</span><h2 id="design-motion-title">{text.motionHeading}</h2><p>{text.motionSub}</p>
      <div className="design-motion-grid">
        <article className="design-motion-emotion">
          <span>{text.motionEmotionLabel}</span>
          <div onPointerEnter={() => emotionVideoRef.current?.play().catch(() => undefined)} onPointerLeave={() => emotionVideoRef.current?.pause()}>
            <img src={src('motion-emotion-01-hero.png')} alt={text.motionEmotionTitle} width="1080" height="1350" loading="lazy" decoding="async" />
            <video ref={emotionVideoRef} src={src('motion-emotion-01-hero.mp4')} muted loop playsInline preload="metadata" poster={src('motion-emotion-01-hero.png')} />
          </div>
          <div className="design-filmstrip">{motionFilmstrip.map((frame) => <figure key={frame.src}><img src={src(frame.src)} alt="" width="500" height="500" loading="lazy" decoding="async" /><figcaption>{frame.label[locale]}</figcaption></figure>)}</div>
          <h3>{text.motionEmotionTitle}</h3><p>{text.motionEmotionText}</p>
        </article>
        <div className="design-motion-stack">
          <article><span>{text.motionControlLabel}</span><div className="design-control-board"><img src={src('motion-control-01.png')} alt={text.motionControlTitle} width="900" height="1200" loading="lazy" decoding="async" /><div>{motionAngles.map((image) => <img key={image} src={src(image)} alt="" width="500" height="500" loading="lazy" decoding="async" />)}</div></div><h3>{text.motionControlTitle}</h3><p>{text.motionControlText}</p><ul>{motionTokens[locale].map((token) => <li key={token}>{token}</li>)}</ul></article>
          <article><span>{text.motionScaleLabel}</span><div className="design-storyboard">{storyboard.map((image, index) => <img key={image} src={src(image)} alt={`Motion format ${index + 1}`} width="700" height="900" loading="lazy" decoding="async" />)}</div><h3>{text.motionScaleTitle}</h3><p>{text.motionScaleText}</p><small>{text.motionOutputLine}</small></article>
        </div>
      </div>
    </section>

    <section id="design-principles" className="design-chapter design-principles" aria-labelledby="design-principles-title">
      <div className="design-principle-board"><span className="design-kicker">09 · {text.principlesHeading}</span><h2 id="design-principles-title">{text.principlesStatement}</h2><strong>{String(activePrinciple + 1).padStart(2, '0')}</strong><p>{principles[activePrinciple][locale]}</p></div>
      <div className="design-principle-list">{principles.map((item, index) => <button key={item.en} type="button" aria-pressed={activePrinciple === index} onPointerEnter={() => setActivePrinciple(index)} onFocus={() => setActivePrinciple(index)} onClick={() => setActivePrinciple(index)}><span>{String(index + 1).padStart(2, '0')}</span>{item[locale]}</button>)}</div>
      <div className="design-process"><h3>{text.processHeading}</h3><div className="design-process-track">{processSteps.map((step, index) => <button key={step.num} type="button" aria-pressed={activeProcess === index} onPointerEnter={() => setActiveProcess(index)} onFocus={() => setActiveProcess(index)} onClick={() => setActiveProcess(index)}><span>{step.num}</span>{step.title[locale]}</button>)}</div><article><span>{process.num}</span><h4>{process.title[locale]}</h4><p>{process.desc[locale]}</p></article></div>
    </section>

    <section id="design-contact" className="design-chapter design-final" aria-labelledby="design-final-title">
      <div className="design-tools"><h2>{text.toolsHeading}</h2><div>{tools.map((tool) => <article key={tool.label}><span>{tool.label}</span><p>{tool.line}</p></article>)}</div><aside><span>{text.outputsCol}</span>{outputs.map((output) => <p key={output}>{output}</p>)}</aside></div>
      <div className="design-final-cta"><h2 id="design-final-title">{text.finalHeading}</h2><p>{text.finalText}</p><div><Link to="/#contact">{text.finalPrimary}</Link><Link to="/#featured">{text.finalSecondary}</Link></div><small>{text.finalCapabilityLine}</small></div>
      <button className="design-scroll-cue is-final" type="button" onClick={() => goToChapter(0)}>10 / 10 · {text.backToTop}</button>
    </section>
  </main>
}
