import { DESIGN_APPROVED_ASSETS as A } from './designApprovedAssets'
import type { DesignApprovedChapter, DesignApprovedDirection, DesignApprovedProofPoint } from './designApprovedTypes'

export const UI_TEXT = {
  ru: {
    skipLink: 'Перейти к содержимому',
    navProduct: 'Product', navDesign: 'Design', navAutomation: 'Automation', navAnalytics: 'Analytics', navContact: 'Контакты',
    resume: 'Резюме', resumeUnavailable: 'Резюме будет добавлено перед публикацией',
    language: 'Язык', themeToggle: 'Переключить тему',
    eyebrow: 'DESIGN · VISUAL SYSTEMS',
    heroVerticalLabel: 'ART DIRECTION · DIGITAL · AI PRODUCTION',
    heroH1: 'Создаю визуальные\nсистемы, в которых\nэстетика работает\nна продукт.',
    heroSub: 'Соединяю UX/UI, арт-дирекцию, brand systems и AI-assisted production — от концепции и правил до готовой серии материалов.',
    ctaPrimary: 'Смотреть дизайн-кейсы ↓', ctaSecondary: 'Обсудить проект →',
    scrollHint: 'Прокрутите',
    capabilitiesHeading: 'Направления дизайна',
    capabilitiesSub: 'Работаю с визуалом как с системой: определяю логику, правила, компоненты и способы масштабирования на разные форматы.',
    viewCase: 'Открыть кейс →',
    pipelineRow1: 'GHOST FRONT · BACK · DETAIL · MODEL', pipelineRow2: 'DESKTOP · MOBILE · SYSTEM',
    abLabelA: 'Technical benefit', abLabelB: 'User outcome',
    abTextA: 'Мощность · Производительность · Спецификация', abTextB: 'Результат · Комплект · Сценарий использования',
    abConcept: 'A/B CONCEPT', abImgAlt: 'A/B-тест Eclipse Drape Gown — вариант A on-model, вариант B ghost mannequin',
    railHeading: 'Как визуал становится системой',
    railSub: 'Сильный результат строится не с финальной картинки, а с понимания исходных данных, ограничений, правил и сценариев масштабирования.',
    railProjectLabel: 'ОДИН ПРОЕКТ · MARKETPLACE VISUAL SYSTEM',
    commercialHeading: 'Коммерческие marketplace-кейсы',
    commercialSub: 'Кейсы, где визуальное решение строится вокруг пользовательского выбора, конкурентной среды и коммерческой гипотезы.',
    recsLabel: 'Рекомендации',
    motionThesis: 'ЭМОЦИЯ · КОНТРОЛЬ · МАСШТАБ',
    motionHeading: 'AI motion и серийный контент',
    motionSub: 'Системы для короткого видео, UGC и последовательного развития визуального персонажа.',
    motionEmotionLabel: '01 · ЭМОЦИЯ', motionScenariosLabel: '5 SHORT-FORM СЦЕНАРИЕВ',
    motionEmotionTitle: 'UGC-ролики с виртуальной моделью',
    motionEmotionText: 'Серия коротких роликов для одного продукта: эмоциональный hero, примерка, посадка, движение ткани и close-up деталей.',
    motionControlLabel: '02 · КОНТРОЛЬ', motionControlTitle: 'Система консистентности AI-персонажа',
    motionControlText: 'Character sheet, правила внешности, света, костюма и ракурсов для сохранения узнаваемости между сценами.',
    motionScaleLabel: '03 · МАСШТАБ', motionScaleTitle: 'Сценарная система и адаптация форматов',
    motionScaleText: 'Одна визуальная идея превращается в серию роликов, кадров и публикаций для разных каналов.',
    motionOutputLine: 'OUTPUT: 5 СЦЕНАРИЕВ · 4 ФОРМАТА · 1 CONSISTENT CHARACTER', motionCtaLabel: 'VIEW PRODUCT',
    principlesHeading: 'Принципы', principlesStatement: 'Система важнее отдельного визуального эффекта.',
    processHeading: 'Процесс', toolsHeading: 'Инструменты и результаты', outputsCol: 'Результаты',
    finalHeading: 'Нужна визуальная система, а не набор разрозненных макетов?',
    finalText: 'Опишите продукт, формат и задачу — я помогу выстроить визуальную логику и довести её до готового к использованию результата.',
    finalPrimary: 'Обсудить проект →', finalSecondary: 'Смотреть все кейсы',
    finalCapabilityLine: 'UX/UI · Brand · E-commerce · AI Production',
    footer: '© 2026 Anna Gromyko · AI Product Builder', backToTop: 'Наверх ↑',
    ch1: '01 — Hero', ch2: '02 — Направления', ch3: '03 — Marketplace System', ch4: '04 — AI Production',
    ch5: '05 — Luxury и Brand', ch6: '06 — Система', ch7: '07 — Коммерция', ch8: '08 — Motion',
    ch9: '09 — Принципы и процесс', ch10: '10 — Контакт',
    heroLabelCommerce: 'DIGITAL COMMERCE', heroLabelBrand: 'BRAND SYSTEM', heroLabelMobile: 'MOBILE EXPERIENCE',
  },
  en: {
    skipLink: 'Skip to content',
    navProduct: 'Product', navDesign: 'Design', navAutomation: 'Automation', navAnalytics: 'Analytics', navContact: 'Contact',
    resume: 'Resume', resumeUnavailable: 'The resume will be added before launch',
    language: 'Language', themeToggle: 'Toggle theme',
    eyebrow: 'DESIGN · VISUAL SYSTEMS',
    heroVerticalLabel: 'ART DIRECTION · DIGITAL · AI PRODUCTION',
    heroH1: 'I create visual systems\nwhere aesthetics\nwork for the product.',
    heroSub: 'I combine UX/UI, art direction, brand systems, and AI-assisted production — from concept and governing rules to a complete visual output.',
    ctaPrimary: 'View design cases ↓', ctaSecondary: 'Discuss a project →',
    scrollHint: 'Scroll to explore',
    capabilitiesHeading: 'Design capabilities',
    capabilitiesSub: 'I approach design as a system by defining its logic, rules, components, and how it scales across formats.',
    viewCase: 'View case study →',
    pipelineRow1: 'GHOST FRONT · BACK · DETAIL · MODEL', pipelineRow2: 'DESKTOP · MOBILE · SYSTEM',
    abLabelA: 'Technical benefit', abLabelB: 'User outcome',
    abTextA: 'Power · Performance · Specification', abTextB: 'Result · Complete kit · Use case',
    abConcept: 'A/B CONCEPT', abImgAlt: 'A/B test Eclipse Drape Gown — variant A on-model hero, variant B ghost mannequin hero',
    railHeading: 'How a visual becomes a system',
    railSub: 'A strong result does not begin with the final image. It begins with source material, constraints, governing rules, and scaling scenarios.',
    railProjectLabel: 'ONE PROJECT · MARKETPLACE VISUAL SYSTEM',
    commercialHeading: 'Commercial marketplace studies',
    commercialSub: 'Cases where visual design is built around customer choice, competitive context, and commercial hypotheses.',
    recsLabel: 'Recommendations',
    motionThesis: 'EMOTION · CONTROL · SCALE',
    motionHeading: 'AI motion and serial content',
    motionSub: 'Systems for short-form video, UGC, and consistent visual character development.',
    motionEmotionLabel: '01 · EMOTION', motionScenariosLabel: '5 SHORT-FORM SCENARIOS',
    motionEmotionTitle: 'Virtual Model UGC Series',
    motionEmotionText: 'A short-form series for one product: emotional hero, try-on, fit, fabric movement and construction details.',
    motionControlLabel: '02 · CONTROL', motionControlTitle: 'AI Character Consistency System',
    motionControlText: 'A character sheet and appearance, lighting, wardrobe and camera rules that preserve identity across scenes.',
    motionScaleLabel: '03 · SCALE', motionScaleTitle: 'Scenario System & Format Adaptation',
    motionScaleText: 'One visual concept becomes a coordinated series of videos, stills and channel-ready formats.',
    motionOutputLine: 'OUTPUT: 5 SCENARIOS · 4 FORMATS · 1 CONSISTENT CHARACTER', motionCtaLabel: 'VIEW PRODUCT',
    principlesHeading: 'Design principles', principlesStatement: 'The system matters more than a single visual effect.',
    processHeading: 'Process', toolsHeading: 'Tools and outputs', outputsCol: 'Outputs',
    finalHeading: 'Need a visual system, not a collection of disconnected layouts?',
    finalText: 'Describe the product, format, and task, and I will help define the visual logic and turn it into a usable final system.',
    finalPrimary: 'Discuss a project →', finalSecondary: 'View all cases',
    finalCapabilityLine: 'UX/UI · Brand · E-commerce · AI Production',
    footer: '© 2026 Anna Gromyko · AI Product Builder', backToTop: 'Back to top ↑',
    ch1: '01 — Hero', ch2: '02 — Capabilities', ch3: '03 — Marketplace System', ch4: '04 — AI Production',
    ch5: '05 — Luxury & Brand', ch6: '06 — System Method', ch7: '07 — Commercial Studies', ch8: '08 — Motion',
    ch9: '09 — Principles & Process', ch10: '10 — Contact',
    heroLabelCommerce: 'DIGITAL COMMERCE', heroLabelBrand: 'BRAND SYSTEM', heroLabelMobile: 'MOBILE EXPERIENCE',
  },
} as const

export const PROOF_POINTS: readonly DesignApprovedProofPoint[] = [
  { stat: { ru: '20+ лет', en: '20+ years' }, label: { ru: 'в fashion, retail и коммерческом продукте', en: 'in fashion, retail, and commercial products' } },
  { stat: { ru: 'Design systems', en: 'Design systems' }, label: { ru: 'UX/UI · Brand · E-commerce', en: 'UX/UI · Brand · E-commerce' } },
  { stat: { ru: 'Full-cycle', en: 'Full-cycle' }, label: { ru: 'от концепции до production-ready системы', en: 'from concept to a production-ready system' } },
]

export const HERO_DIRECTIONS: readonly DesignApprovedDirection[] = [
  { num: '01', label: { ru: 'UX/UI', en: 'UX/UI' }, outcome: { ru: 'От flows к масштабируемым интерфейсам', en: 'From flows to scalable interfaces' } },
  { num: '02', label: { ru: 'ЛЕНДИНГИ', en: 'LANDING' }, outcome: { ru: 'От оффера к конверсии', en: 'From offer to conversion' } },
  { num: '03', label: { ru: 'COMMERCE', en: 'COMMERCE' }, outcome: { ru: 'От одного SKU к системе каталога', en: 'From one SKU to a catalog system' } },
  { num: '04', label: { ru: 'БРЕНД', en: 'BRAND' }, outcome: { ru: 'От идеи к узнаваемому языку', en: 'From idea to a recognisable language' } },
  { num: '05', label: { ru: 'MOTION', en: 'MOTION' }, outcome: { ru: 'От статики к серийному контенту', en: 'From static assets to serial content' } },
]

export const CAPABILITIES = [
  { num: '01', title: { ru: 'UX/UI и продуктовые интерфейсы', en: 'UX/UI & Product Interfaces' }, outcome: { ru: 'ОТ FLOWS К МАСШТАБИРУЕМЫМ ИНТЕРФЕЙСАМ', en: 'FROM FLOWS TO SCALABLE INTERFACES' }, desc: { ru: 'User flows, информационная архитектура, responsive UX, компоненты и состояния продукта.', en: 'User flows, information architecture, responsive UX, component systems, and product states.' }, sample: A.annaGromykoPortfolio, sampleObjectPosition: '50% 28%' },
  { num: '02', title: { ru: 'Лендинги и конверсионные воронки', en: 'Landing Pages & Conversion Funnels' }, outcome: { ru: 'ОТ ОФФЕРА К КОНВЕРСИИ', en: 'FROM OFFER TO CONVERSION' }, desc: { ru: 'Структура нарратива, ценностное предложение, иерархия CTA, формы и измеримые пути конверсии.', en: 'Narrative structure, value proposition, CTA hierarchy, forms, and measurable conversion paths.' }, sample: A.riskJournalAnalytics, sampleObjectPosition: '50% 40%' },
  { num: '03', title: { ru: 'Marketplace и commerce-системы', en: 'Marketplace & Commerce Systems' }, outcome: { ru: 'ОТ ОДНОГО SKU К МАСШТАБИРУЕМОЙ СИСТЕМЕ', en: 'FROM ONE SKU TO A SCALABLE SYSTEM' }, desc: { ru: 'Карточки товара, фотоворонки, rich-контент, AI-production и масштабирование каталога.', en: 'Product cards, visual funnels, rich content, AI-assisted production, and catalog scaling.' }, sample: A.marketplaceVisualSystems, sampleObjectPosition: '50% 12%' },
  { num: '04', title: { ru: 'Бренд и арт-дирекшн', en: 'Brand Identity & Art Direction' }, outcome: { ru: 'ОТ ИДЕИ К УЗНАВАЕМОМУ ЯЗЫКУ', en: 'FROM IDEA TO A RECOGNISABLE LANGUAGE' }, desc: { ru: 'Айдентика, типографика, цвет, кампании и визуальная система бренда для всех каналов.', en: 'Identity, typography, color, campaign direction, and a cross-channel visual language.' }, sample: A.theDaoWay, sampleObjectPosition: '50% 45%' },
  { num: '05', title: { ru: 'Motion и визуальный сторителлинг', en: 'Motion & Visual Storytelling' }, outcome: { ru: 'ОТ СТАТИКИ К СЕРИЙНОМУ КОНТЕНТУ', en: 'FROM STATIC ASSETS TO SERIAL CONTENT' }, desc: { ru: 'Motion-системы, AI-video, презентации и адаптация кампаний под форматы и каналы.', en: 'Motion systems, AI-assisted video, presentations, and campaign adaptation across formats.' }, sample: A.motionEmotionHero, sampleObjectPosition: '50% 15%' },
] as const

export const MARKETPLACE_CASE = {
  num: '01',
  title: { ru: 'Визуальная система для fashion-бренда', en: 'Visual System for a Fashion Brand' },
  category: { ru: 'FASHION E-COMMERCE · DESIGN SYSTEM', en: 'FASHION E-COMMERCE · DESIGN SYSTEM' },
  role: { ru: 'Visual Strategy · Marketplace Design · Content System', en: 'Visual Strategy · Marketplace Design · Content System' },
  description: {
    ru: 'Масштабируемая система карточек и rich-контента для оформления большого каталога без потери узнаваемости, качества и мобильной читаемости.',
    en: 'A scalable product-card and rich-content system for building a large catalog without losing brand recognition, quality, or mobile readability.',
  },
  tags: { ru: 'Marketplace · Design system · SKU scaling', en: 'Marketplace · Design system · SKU scaling' },
  status: { ru: 'Концепт', en: 'Concept' },
  href: '/projects/marketplace-visual-systems',
} as const

export const LOOKBOOK_SLIDES = [
  A.case1Cover,
  A.lookbook1,
  A.lookbook2,
  A.lookbook3,
  A.lookbook4,
  A.lookbook5,
] as const

export const FASHION_PIPELINE_CASE = {
  num: '02',
  title: { ru: 'AI-Assisted Fashion Production Pipeline', en: 'AI-Assisted Fashion Production Pipeline' },
  category: { ru: 'AI PRODUCTION · APPAREL PIPELINE', en: 'AI PRODUCTION · APPAREL PIPELINE' },
  description: {
    ru: 'Один SKU, проведённый через полный конвейер: ghost mannequin спереди и сзади, деталь кроя, модель, десктоп и мобильная карточка.',
    en: 'One SKU carried through the full pipeline: front and back ghost mannequin, construction detail, on-model shot, desktop and mobile card.',
  },
  tags: { ru: 'AI production · Consistency', en: 'AI production · Consistency' },
  status: { ru: 'Концепт', en: 'Concept' },
  cover: A.case2Pipeline,
  href: '/projects/marketplace-visual-systems',
} as const

export const TECHNICAL_AB_CASE = {
  title: { ru: 'A/B-тест — Eclipse Drape Gown', en: 'A/B Test — Eclipse Drape Gown' },
  category: { ru: 'MAISON NOIREE · A/B ТЕСТ', en: 'MAISON NOIREE · A/B TEST' },
  description: {
    ru: 'Вариант A — editorial on-model hero: эмоциональная подача и контекст.\nВариант B — product-first composition: силуэт, конструкция и детали. Период теста — 14 дней.',
    en: 'Variant A — editorial on-model hero: emotional framing and context.\nVariant B — product-first composition: silhouette, construction and detail. 14-day test period.',
  },
  cover: A.abTestEclipse,
  href: '/projects/marketplace-visual-systems',
} as const

export const EUFASHION_CASE = {
  num: '04',
  title: { ru: 'Eufashion Glasses — Luxury E-commerce System', en: 'Eufashion Glasses — Luxury E-commerce System' },
  category: { ru: 'LUXURY E-COMMERCE · AI ART DIRECTION', en: 'LUXURY E-COMMERCE · AI ART DIRECTION' },
  description: {
    ru: 'Премиальная digital-система для eyewear-бренда: карточки товаров, AI-визуалы и единая подача ассортимента без искажения геометрии оправы.',
    en: 'A premium digital system for an eyewear brand: product cards, AI visuals, and a consistent assortment presentation that preserves the frame’s real geometry.',
  },
  tags: { ru: 'Luxury · E-commerce · Consistency', en: 'Luxury · E-commerce · Consistency' },
  status: { ru: 'Исследование', en: 'Research' },
  cover: A.eufashionGlasses,
  objectPosition: '50% 30%',
  href: '/projects/eufashion-glasses',
} as const

export const DIGITAL_CASES = [
  {
    num: '01', title: { ru: 'Maison Noiree', en: 'Maison Noiree' },
    category: { ru: 'BRAND SYSTEM', en: 'BRAND SYSTEM' },
    tags: { ru: 'Identity · Typography · Guidelines', en: 'Identity · Typography · Guidelines' },
    cover: A.theDaoWay, objectPosition: '50% 45%', href: '/cases/the-dao-way',
    aspect: '16 / 10', titleSize: 'clamp(24px, 2.2vw, 30px)', fit: 'cover', dominant: true,
  },
  {
    num: '02', title: { ru: 'Anna Gromyko Portfolio', en: 'Anna Gromyko Portfolio' },
    category: { ru: 'UX/UI PORTFOLIO', en: 'UX/UI PORTFOLIO' },
    tags: { ru: 'UX/UI · Responsive · Motion', en: 'UX/UI · Responsive · Motion' },
    cover: A.annaPortfolio, objectPosition: '50% 100%', href: '/',
    aspect: '4 / 3.4', titleSize: 'clamp(20px, 1.8vw, 25px)', fit: 'contain', dominant: false,
  },
] as const

export const RAIL_STAGES = [
  { num: '01 SOURCE', title: { ru: 'Источник', en: 'Source' }, desc: { ru: 'Оригинальные фото платья, доступные ракурсы и исходная карточка листинга.', en: 'Original dress photography, available angles, and the original listing card.' }, thumb: A.railSource },
  { num: '02 ANALYSIS', title: { ru: 'Анализ и правила', en: 'Analysis & rules' }, desc: { ru: 'Конкурентный обзор, структура слайдов, типографика и правила мобильной читаемости.', en: 'Competitor review, slide structure, typography, and mobile-readability rules.' }, thumb: A.railAnalysis },
  { num: '03 PRODUCTION', title: { ru: 'Production', en: 'Production' }, desc: { ru: 'Обложка, посадка, деталь кроя, размерная сетка, модель и rich-контент.', en: 'Cover, fit, construction detail, sizing, model, and rich content.' }, thumb: A.railProduction },
  { num: '04 SYSTEM', title: { ru: 'Система', en: 'System' }, desc: { ru: 'Десктоп, мобильная версия, вариации SKU и масштабируемый шаблон каталога.', en: 'Desktop, mobile, SKU variations, and a scalable catalog template.' }, thumb: A.railSystem },
] as const

export const COMMERCIAL_CASES = [
  { num: '01', title: { ru: 'Редизайн карточки женской одежды', en: 'Women’s Fashion Listing Redesign' }, category: { ru: 'MARKETPLACE REDESIGN', en: 'MARKETPLACE REDESIGN' }, role: { ru: 'Audit · Visual Funnel · A/B', en: 'Audit · Visual Funnel · A/B' }, description: { ru: 'Аудит текущей карточки и новая фотоворонка из 10 слайдов с адаптацией под WB, Ozon и Lamoda.', en: 'An audit of the current listing and a new 10-slide visual funnel adapted for WB, Ozon, and Lamoda.' }, cover: A.commercialCase1 },
  { num: '02', title: { ru: 'Аналитика карточек и конкурентов', en: 'Marketplace Competitor & Card Analytics' }, category: { ru: 'MARKETPLACE ANALYTICS', en: 'MARKETPLACE ANALYTICS' }, role: { ru: 'Competitor Analysis · Recommendations', en: 'Competitor Analysis · Recommendations' }, description: { ru: 'Структурированный анализ 10–20 конкурентов и рекомендации по продукту, упаковке и фотоворонке.', en: 'A structured analysis of 10–20 competitors with recommendations on product, packaging, and visual funnel.' }, cover: A.commercialCase2Ru, coverEn: A.commercialCase2En },
  { num: '03', title: { ru: 'AI-кампания для fashion-бренда', en: 'AI Campaign for a Fashion Brand' }, category: { ru: 'CAMPAIGN SYSTEM', en: 'CAMPAIGN SYSTEM' }, role: { ru: 'Campaign Concept · Channel Adaptation', en: 'Campaign Concept · Channel Adaptation' }, description: { ru: 'Одна рекламная идея, масштабированная на баннер, Stories, Reels и карточку товара.', en: 'One visual idea scaled across a banner, Stories, Reels, and product card.' }, cover: A.commercialCase3 },
] as const

export const MOTION_DATA = {
  filmstrip: [
    { src: A.motionEmotionHero, label: { ru: 'HERO', en: 'HERO' } },
    { src: A.motionEmotionTryOn, label: { ru: 'ПРИМЕРКА', en: 'TRY-ON' } },
    { src: A.motionEmotionFit, label: { ru: 'ПОСАДКА', en: 'FIT' } },
    { src: A.motionEmotionFabric, label: { ru: 'ТКАНЬ', en: 'FABRIC' } },
    { src: A.motionEmotionDetail, label: { ru: 'ДЕТАЛЬ', en: 'DETAIL' } },
  ],
  angles: [A.motionControl07, A.motionControl09, A.motionControl10, A.motionControl12],
  tokens: { ru: ['ЛИЦО', 'ВОЛОСЫ', 'КОСТЮМ', 'СВЕТ', 'КАМЕРА', 'НЕ МЕНЯТЬ'], en: ['FACE', 'HAIR', 'WARDROBE', 'LIGHT', 'CAMERA', 'DO NOT CHANGE'] },
  scenarios: [
    { num: '01', label: { ru: 'HERO', en: 'HERO' } },
    { num: '02', label: { ru: 'ПРИМЕРКА', en: 'TRY-ON' } },
    { num: '03', label: { ru: 'ПОСАДКА', en: 'FIT & SILHOUETTE' } },
    { num: '04', label: { ru: 'ТКАНЬ В ДВИЖЕНИИ', en: 'MATERIAL IN MOTION' } },
    { num: '05', label: { ru: 'ДЕТАЛЬ И CTA', en: 'DETAIL & CTA' } },
  ],
  pipeline: {
    ru: ['ИСТОЧНИК', '→', 'ЛОК ПЕРСОНАЖА', '→', 'ШОТ-ПЛАН', '→', 'MOTION', '→', 'QC', '→', 'ЭКСПОРТ'],
    en: ['SOURCE', '→', 'CHARACTER LOCK', '→', 'SHOT PLAN', '→', 'MOTION', '→', 'QC', '→', 'EXPORT'],
  },
} as const

export const PRINCIPLES = [
  { ru: 'Сначала функция, затем эффект.', en: 'Function before effect.' },
  { ru: 'Один визуальный язык на всех носителях.', en: 'One visual language across every touchpoint.' },
  { ru: 'AI не должен изменять реальный продукт.', en: 'AI must not alter the real product.' },
  { ru: 'Система должна масштабироваться.', en: 'The system must scale.' },
  { ru: 'Motion объясняет структуру, а не украшает её.', en: 'Motion should explain structure, not decorate it.' },
  { ru: 'Дизайн должен работать в реальном формате публикации.', en: 'Design must work in its real publishing format.' },
] as const

export const PROCESS_STEPS = [
  { num: '01', title: { ru: 'Контекст', en: 'Context' }, desc: { ru: 'Задача, аудитория, ограничения и критерии результата.', en: 'Task, audience, constraints, and success criteria.' }, items: { ru: ['Бизнес-задача', 'Аудитория', 'Ограничения', 'Критерии результата'], en: ['Business task', 'Audience', 'Constraints', 'Success criteria'] } },
  { num: '02', title: { ru: 'Исследование', en: 'Research' }, desc: { ru: 'Конкуренты, визуальные паттерны, контекст категории.', en: 'Competitors, visual patterns, category context.' }, items: { ru: ['Конкуренты', 'Визуальные паттерны', 'Контекст категории', 'Возможности'], en: ['Competitors', 'Visual patterns', 'Category context', 'Opportunities'] } },
  { num: '03', title: { ru: 'Структура', en: 'Structure' }, desc: { ru: 'Иерархия, фотоворонка, user flows.', en: 'Hierarchy, visual funnel, user flows.' }, items: { ru: ['Иерархия', 'Фотоворонка', 'User flows', 'Информационная структура'], en: ['Hierarchy', 'Visual funnel', 'User flows', 'Information structure'] } },
  { num: '04', title: { ru: 'Направление', en: 'Direction' }, desc: { ru: 'Визуальная концепция, типографика, цвет.', en: 'Visual direction, typography, color.' }, items: { ru: ['Визуальная концепция', 'Типографика', 'Цвет', 'Композиционные правила'], en: ['Visual concept', 'Typography', 'Color', 'Composition rules'] } },
  { num: '05', title: { ru: 'Production', en: 'Production' }, desc: { ru: 'Компоненты, экраны, сцены, слайды, motion.', en: 'Components, screens, scenes, slides, motion.' }, items: { ru: ['Компоненты', 'Экраны и сцены', 'Слайды', 'Motion'], en: ['Components', 'Screens & scenes', 'Slides', 'Motion'] } },
  { num: '06', title: { ru: 'Проверка', en: 'Validation' }, desc: { ru: 'Читаемость, mobile UX, консистентность.', en: 'Readability, mobile UX, consistency.' }, items: { ru: ['Читаемость', 'Mobile UX', 'Консистентность', 'QC-чеклист'], en: ['Readability', 'Mobile UX', 'Consistency', 'QC checklist'] } },
  { num: '07', title: { ru: 'Передача', en: 'Handoff' }, desc: { ru: 'Правила, шаблоны, исходники, требования.', en: 'Rules, templates, source files, requirements.' }, items: { ru: ['Правила', 'Шаблоны', 'Исходники', 'Требования к production'], en: ['Rules', 'Templates', 'Source files', 'Production requirements'] } },
] as const

export const TOOL_GROUPS = [
  { label: { ru: 'STRATEGY & UX', en: 'STRATEGY & UX' }, line: 'Figma · Claude · ChatGPT' },
  { label: { ru: 'AI PRODUCTION', en: 'AI PRODUCTION' }, line: 'Midjourney · Krea · Higgsfield · Photoshop' },
  { label: { ru: 'DELIVERY', en: 'DELIVERY' }, line: 'Codex · Cursor · React/CSS' },
  { label: { ru: 'DATA', en: 'DATA' }, line: 'Python · SQL' },
] as const

export const OUTPUTS = ['Design systems', 'UX/UI', 'Brand systems', 'Marketplace systems', 'Rich content', 'Motion specifications', 'Quality-control checklists', 'Production handoff'] as const

export const DESIGN_APPROVED_CHAPTERS: readonly DesignApprovedChapter[] = [
  { id: 'design-approved-hero', label: { ru: 'Hero', en: 'Hero' } },
  { id: 'design-directions', label: { ru: 'Направления', en: 'Capabilities' } },
  { id: 'design-fashion-system', label: { ru: 'Marketplace System', en: 'Marketplace System' } },
  { id: 'design-fashion-pipeline', label: { ru: 'AI Production', en: 'AI Production' } },
  { id: 'design-brand-systems', label: { ru: 'Luxury и Brand', en: 'Luxury & Brand' } },
  { id: 'design-approved-system-method', label: { ru: 'Система', en: 'System Method' } },
  { id: 'design-approved-commercial', label: { ru: 'Коммерция', en: 'Commercial Studies' } },
  { id: 'design-approved-motion', label: { ru: 'Motion', en: 'Motion' } },
  { id: 'design-approved-principles', label: { ru: 'Принципы и процесс', en: 'Principles & Process' } },
  { id: 'design-approved-contact', label: { ru: 'Контакт', en: 'Contact' } },
]
