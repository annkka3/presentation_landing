import type { LocalizedItem, LocalizedText, Project } from '../types'

const l = (ru: string, en: string): LocalizedText => ({ ru, en })

export const heroModes = [
  { key: 'product', num: '01', title: 'PRODUCT', tag: l('Архитектура · UX', 'Architecture · UX'), image: '/assets/product.png', position: '48% 50%', accent: '#31b9cd' },
  { key: 'design', num: '02', title: 'DESIGN', tag: l('Визуальные системы', 'Visual systems'), image: '/assets/design.png', position: '55% 42%', accent: '#c6a467' },
  { key: 'automation', num: '03', title: 'AUTOMATION', tag: l('Процессы · AI', 'Processes · AI'), image: '/assets/automation.png', position: '50% 48%', accent: '#2fd9c9' },
  { key: 'analytics', num: '04', title: 'ANALYTICS', tag: l('SQL · Python', 'SQL · Python'), image: '/assets/analytics.png', position: '51% 50%', accent: '#2ea2ff' },
] as const

export const proofItems = [
  { stat: l('20+ лет', '20+ years'), label: l('коммерческого и управленческого опыта', 'of commercial and management experience') },
  { stat: l('10+ проектов', '10+ projects'), label: l('в продукте, дизайне, автоматизации и аналитике', 'across product, design, automation, and analytics') },
  { stat: l('Full-cycle delivery', 'Full-cycle delivery'), label: l('идея → UX → разработка → QA → релиз', 'idea → UX → development → QA → launch') },
  { stat: l('AI-native workflow', 'AI-native workflow'), label: l('Claude · Codex · Cursor · ChatGPT', 'Claude · Codex · Cursor · ChatGPT') },
]

export const projects: Project[] = [
  {
    id: 'dao-system', slug: 'dao-system', title: l('DAO SYSTEM', 'DAO SYSTEM'), featured: true, accent: 'teal', span: 7, route: '/cases/dao-system', status: 'in-development', statusLabel: l('В разработке', 'In development'),
    category: l('AI-NATIVE PRODUCT ECOSYSTEM', 'AI-NATIVE PRODUCT ECOSYSTEM'), role: l('Product Architecture · UX Strategy · AI-assisted Delivery', 'Product Architecture · UX Strategy · AI-assisted Delivery'),
    description: l('Главный системный продукт: архитектура экосистемы, информационная архитектура, UX-сценарии, требования, дизайн-система и release gates.', 'The core system product: ecosystem architecture, information architecture, user flows, requirements, design system, and release gates.'),
    tags: [l('Архитектура', 'Architecture'), l('Дизайн-система', 'Design system'), l('Release gates', 'Release gates')], coverSrc: '/assets/case-dao-system.png', coverAlt: l('Интерфейсы экосистемы DAO SYSTEM с центральным модулем и мобильными экранами', 'DAO SYSTEM ecosystem interfaces with a central module and mobile screens'), coverPosition: '50% 50%',
  },
  {
    id: 'crypto-reality', slug: 'crypto-reality', title: l('Crypto Reality', 'Crypto Reality'), featured: true, accent: 'teal', span: 5, route: '/cases/crypto-reality', status: 'closed-testing', statusLabel: l('Закрытое тестирование', 'Closed testing'),
    category: l('TELEGRAM MINI APP · GAME PRODUCT', 'TELEGRAM MINI APP · GAME PRODUCT'), role: l('Product Owner · UX/Product Design · AI-assisted Development', 'Product Owner · UX/Product Design · AI-assisted Development'), description: l('Семидневная игра в формате Telegram Mini App с комнатами, событиями, архетипами, leaderboard и системой достижений.', 'A seven-day game built as a Telegram Mini App, featuring rooms, events, character archetypes, a leaderboard, and an achievement system.'), tags: [l('Onboarding', 'Onboarding'), l('Leaderboard', 'Leaderboard'), l('Достижения', 'Achievements')], coverSrc: '/assets/case-crypto-reality.png', coverAlt: l('Игровые экраны Telegram Mini App Crypto Reality', 'Crypto Reality Telegram Mini App game screens'), coverPosition: '50% 50%',
  },
  {
    id: 'the-dao-way', slug: 'the-dao-way', title: l('The DAO Way', 'The DAO Way'), featured: true, accent: 'gold', span: 5, route: '/cases/the-dao-way', status: 'own-project', statusLabel: l('Собственный проект', 'Own project'),
    category: l('BRAND SYSTEM / VISUAL DIRECTION', 'BRAND SYSTEM / VISUAL DIRECTION'), role: l('Brand Strategy · Art Direction · Design System', 'Brand Strategy · Art Direction · Design System'), description: l('Айдентика и визуальная система продуктовой экосистемы: логотип, типографика, цвет, презентационные шаблоны и правила применения.', 'A brand identity and visual system for a digital product ecosystem, including the logo, typography, color system, presentation templates, and usage guidelines.'), tags: [l('Айдентика', 'Identity'), l('Типографика', 'Typography'), l('Гайдлайны', 'Guidelines')], coverSrc: '/assets/case-the-dao-way.png', coverAlt: l('Светлая редакционная система бренда The DAO Way', 'The DAO Way warm editorial brand system'), coverPosition: '50% 50%',
  },
  {
    id: 'risk-journal-analytics', slug: 'risk-journal-analytics', title: l('Risk Journal Analytics', 'Risk Journal Analytics'), featured: true, accent: 'blue', span: 7, route: '/cases/risk-journal-analytics', status: 'research', statusLabel: l('Исследование', 'Research'),
    category: l('PRODUCT ANALYTICS · SQL · PYTHON', 'PRODUCT ANALYTICS · SQL · PYTHON'), role: l('Product Analytics · Data Visualization · UX', 'Product Analytics · Data Visualization · UX'), description: l('Аналитическая система для контроля торгового риска: risk scoring, дисциплина, продуктовая воронка, журнал сделок и проверка гипотез.', 'A product analytics system for trading-risk control, combining risk scoring, discipline metrics, funnel analysis, trade journaling, and hypothesis testing.'), tags: [l('Risk scoring', 'Risk scoring'), l('Воронки', 'Funnels'), l('A/B testing', 'A/B testing')], coverSrc: '/assets/case-risk-journal-analytics.png', coverAlt: l('Аналитический дашборд журнала торгового риска', 'Trading risk journal analytics dashboard'), coverPosition: '50% 50%',
  },
  {
    id: 'anna-gromyko-portfolio', slug: 'anna-gromyko-portfolio', title: l('Anna Gromyko Portfolio', 'Anna Gromyko Portfolio'), featured: false, accent: 'teal', route: '/projects/anna-gromyko-portfolio', status: 'in-development', statusLabel: l('В разработке', 'In development'), category: l('PERSONAL BRAND · INTERACTIVE PORTFOLIO', 'PERSONAL BRAND · INTERACTIVE PORTFOLIO'), role: l('Product Strategy · UX/UI · AI-assisted Development', 'Product Strategy · UX/UI · AI-assisted Development'), description: l('Двуязычный интерактивный портфолио-сайт: позиционирование, информационная архитектура, визуальная система, motion design, адаптивный интерфейс и подготовка к деплою на Vercel.', 'A bilingual interactive portfolio website covering positioning, information architecture, visual systems, motion design, responsive UX, and preparation for deployment on Vercel.'), tags: [l('Product strategy', 'Product strategy'), l('Motion', 'Motion'), l('Responsive', 'Responsive')], coverSrc: '/assets/case-anna-gromyko-portfolio.png', coverAlt: l('Интерактивный портфолио-сайт Anna Gromyko в светлой и тёмной темах', 'Anna Gromyko interactive portfolio in light and dark themes'),
  },
  {
    id: 'marketplace-visual-systems', slug: 'marketplace-visual-systems', title: l('Marketplace Visual Systems', 'Marketplace Visual Systems'), featured: false, accent: 'gold', route: '/projects/marketplace-visual-systems', status: 'concept', statusLabel: l('Концепт', 'Concept'), category: l('E-COMMERCE · AI ART DIRECTION', 'E-COMMERCE · AI ART DIRECTION'), role: l('Visual Strategy · AI Content · Product Presentation', 'Visual Strategy · AI Content · Product Presentation'), description: l('Система визуального контента для fashion e-commerce: структура товарных серий, ghost mannequin, студийные сцены и единые правила сохранения продукта.', 'A visual content system for fashion e-commerce, covering product-series structure, ghost mannequin imagery, studio scenes, and consistent product-preservation rules.'), tags: [l('Visual strategy', 'Visual strategy'), l('AI content', 'AI content'), l('Концепт', 'Concept')], coverSrc: '/assets/case-marketplace-visual-systems.png', coverAlt: l('Система fashion e-commerce контента с desktop и mobile товарными интерфейсами', 'Fashion e-commerce content system with desktop and mobile product interfaces'),
  },
  {
    id: 'lte-pro', slug: 'lte-pro', title: l('LTE PRO', 'LTE PRO'), featured: false, accent: 'blue', route: '/projects/lte-pro', status: 'live', statusLabel: l('Live', 'Live'), category: l('TRADING TOOL · PINE SCRIPT', 'TRADING TOOL · PINE SCRIPT'), role: l('Product Logic · Indicator Design · Data Visualization', 'Product Logic · Indicator Design · Data Visualization'), description: l('Многоуровневый TradingView-индикатор с несколькими логическими движками, рыночным контекстом и визуальной системой сигналов.', 'A multi-layer TradingView indicator with several logic engines, market context, and a structured signal-visualization system.'), tags: [l('Pine Script', 'Pine Script'), l('Индикаторы', 'Indicators'), l('Live', 'Live')], coverSrc: '/assets/case-lte-pro.png', coverAlt: l('TradingView-график с многоуровневым индикатором LTE PRO', 'TradingView chart with the multi-layer LTE PRO indicator'),
  },
  {
    id: 'youpumpy-product-audit', slug: 'youpumpy-product-audit', title: l('YouPumpy Product Audit', 'YouPumpy Product Audit'), featured: false, accent: 'neutral', route: '/projects/youpumpy-product-audit', status: 'client-work', statusLabel: l('Клиентский проект', 'Client work'), category: l('TECHNICAL · UX · CONTENT AUDIT', 'TECHNICAL · UX · CONTENT AUDIT'), role: l('Technical QA · UX Review · Content Audit', 'Technical QA · UX Review · Content Audit'), description: l('Комплексный аудит продукта: 4 воспроизводимых бага, 8 технических проблем и 8 языковых ошибок — с приоритетами и оценкой трудозатрат.', 'A comprehensive product audit identifying 4 reproducible bugs, 8 technical issues, and 8 language issues, with priorities and effort estimates.'), tags: [l('QA', 'QA'), l('Content audit', 'Content audit'), l('Клиентский проект', 'Client work')], coverSrc: '/assets/case-youpumpy-audit.png', coverAlt: l('Аудит продукта YouPumpy с перечнем UX и технических проблем', 'YouPumpy product audit showing UX and technical findings'),
  },
  {
    id: 'tsvetimir', slug: 'tsvetimir', title: l('ЦветиМир', 'TsvetiMir'), featured: false, accent: 'teal', route: '/projects/tsvetimir', status: 'client-work', statusLabel: l('Клиентский проект', 'Client work'), category: l('LANDING · E-COMMERCE', 'LANDING · E-COMMERCE'), role: l('UX · Visual Concept · Product Presentation', 'UX · Visual Concept · Product Presentation'), description: l('Структура лендинга, пользовательские сценарии, визуальная концепция и коммерческая подача продукта.', 'Landing-page structure, user flows, visual concept, and commercial product presentation.'), tags: [l('UX', 'UX'), l('Landing', 'Landing'), l('Клиентский проект', 'Client work')], coverSrc: '/assets/case-tsvetimir.png', coverAlt: l('Лендинг интернет-магазина цветов ЦветиМир', 'TsvetiMir flower e-commerce landing page'),
  },
  {
    id: 'eufashion-glasses', slug: 'eufashion-glasses', title: l('Eufashion Glasses', 'Eufashion Glasses'), featured: false, accent: 'gold', route: '/projects/eufashion-glasses', status: 'research', statusLabel: l('Исследование', 'Research'), category: l('MARKETPLACE · AI ART DIRECTION', 'MARKETPLACE · AI ART DIRECTION'), role: l('Series Design · AI Production · Product Consistency', 'Series Design · AI Production · Product Consistency'), description: l('Визуальная система товарной серии и AI-assisted production с правилами сохранения геометрии, материалов и отличительных деталей продукта.', 'A product-series visual system and AI-assisted production workflow with rules for preserving geometry, materials, and distinctive product details.'), tags: [l('AI production', 'AI production'), l('Series design', 'Series design'), l('Исследование', 'Research')], coverSrc: '/assets/case-eufashion-glasses.png', coverAlt: l('Серия изображений очков Eufashion для маркетплейса', 'Eufashion glasses product image series for a marketplace'),
  },
]

export const skills: LocalizedItem[] = [
  { title: l('Product & Systems', 'Product & Systems'), description: l('Product architecture · IA · user flows · roadmap · требования', 'Product architecture · IA · user flows · roadmap · requirements') },
  { title: l('AI-assisted Development', 'AI-assisted Development'), description: l('Claude · Codex · Cursor · React/TypeScript · Python/FastAPI', 'Claude · Codex · Cursor · React/TypeScript · Python/FastAPI') },
  { title: l('UX/UI & Design Systems', 'UX/UI & Design Systems'), description: l('Mobile UX · компоненты · состояния · Figma · AI art direction', 'Mobile UX · components · states · Figma · AI art direction') },
  { title: l('Automation & Operations', 'Automation & Operations'), description: l('Process mapping · спецификации · документация · API/CRM workflows', 'Process mapping · specifications · documentation · API/CRM workflows') },
  { title: l('Data & Analytics', 'Data & Analytics'), description: l('SQL · pandas · A/B testing · продуктовые воронки · data quality', 'SQL · pandas · A/B testing · product funnels · data quality') },
  { title: l('QA & Delivery', 'QA & Delivery'), description: l('Functional QA · responsive QA · release gates · аудит · handoff', 'Functional QA · responsive QA · release gates · audit · handoff') },
]

export const processSteps = [
  { num: '01', title: l('Разбираю бизнес-задачу', 'Frame the business problem'), description: l('Определяю цель, ограничения и критерии результата.', 'Define the goal, constraints, and success criteria.') },
  { num: '02', title: l('Проектирую структуру', 'Design the structure'), description: l('Формирую архитектуру, user flows и ключевые состояния.', 'Define the architecture, user flows, and key states.') },
  { num: '03', title: l('Готовлю спецификацию', 'Write the specification'), description: l('Фиксирую требования, edge cases и критерии готовности.', 'Capture requirements, edge cases, and the definition of done.') },
  { num: '04', title: l('Собираю прототип или MVP', 'Build a prototype or MVP'), description: l('Проектирую интерфейс и веду AI-assisted реализацию.', 'Design the interface and lead AI-assisted implementation.') },
  { num: '05', title: l('Проверяю результат', 'Validate the result'), description: l('Тестирую логику, UX, адаптивность и критические сценарии.', 'Test the logic, UX, responsive behavior, and critical scenarios.') },
  { num: '06', title: l('Документирую решение', 'Document the solution'), description: l('Готовлю handoff, release notes и план следующей итерации.', 'Prepare the handoff, release notes, and a plan for the next iteration.') },
]

export const experience = [
  { dates: l('2024—н.в.', '2024–present'), role: l('Independent AI Product Builder', 'Independent AI Product Builder'), description: l('Собственные и клиентские цифровые продукты: product architecture, UX/UI, AI-assisted development, QA и документация.', 'Independent and client digital products covering product architecture, UX/UI, AI-assisted development, QA, and documentation.'), current: true },
  { dates: l('2019–2022', '2019–2022'), role: l('Farfetch Marketplace Partner / E-commerce Operations', 'Farfetch Marketplace Partner / E-commerce Operations'), description: l('Каталог, товарные фиды, ассортимент, ценообразование, промо и аналитика.', 'Catalog operations, product feeds, assortment, pricing, promotions, and analytics.'), current: false },
  { dates: l('2005–2019', '2005–2019'), role: l('Luxury Retail / Buying / Commercial Management', 'Luxury Retail / Buying / Commercial Management'), description: l('Закупки, ассортимент, продажи, онлайн-витрина и управление коммерческими процессами.', 'Buying, assortment planning, sales, online storefront operations, and commercial process management.'), current: false },
]

export const education = [
  { school: l('БГТУ / Bryansk State Technical University — BSTU', 'Bryansk State Technical University — BSTU'), detail: l('Квалификация: инженер-менеджер', 'Degree in Engineering and Management') },
  { school: l('ИТМО / ITMO', 'ITMO'), detail: l('Дополнительное образование — ML Engineering. Сертификатная программа: Python · SQL · анализ данных', 'Continuing education — ML Engineering. Certificate program: Python · SQL · data analysis') },
]
