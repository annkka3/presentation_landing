import type { Locale } from '../types'

export const copy = {
  ru: {
    skip: 'Перейти к содержанию', contact: 'Контакты', resume: 'Резюме', resumeDownload: 'Скачать резюме', resumeUnavailable: 'Резюме будет добавлено перед публикацией', themeDark: 'Включить тёмную тему', themeLight: 'Включить светлую тему', language: 'Выбор языка',
    heroTitle: 'Проектирую и запускаю цифровые продукты на стыке бизнес-логики, UX, AI и данных.', heroSubtitle: 'Выберите профессиональный фокус', viewCases: 'Смотреть кейсы →',
    featured: 'Избранные кейсы', more: 'Ещё проекты', expertise: 'Компетенции', process: 'Процесс работы', experience: 'Опыт', education: 'Образование',
    openCase: 'Открыть кейс →', openProject: 'Смотреть проект →', back: '← Вернуться на главную', next: 'Следующий проект',
    challenge: 'Задача', scope: 'Объём работы', approach: 'Процесс', result: 'Текущий статус',
    contactHeading: 'Связаться', contactIntro: 'Открыта к проектам и ролям в продукте, дизайне и AI-автоматизации — на стыке UX, технологий и данных. Расскажите о задаче: обычно отвечаю в течение одного рабочего дня.',
    downloadResume: 'Скачать резюме (PDF) ↓', formHeading: 'Написать сообщение', formDescription: 'Коротко опишите проект, роль или задачу.',
    name: 'Имя', namePlaceholder: 'Как к вам обращаться', contactField: 'Email или Telegram', contactPlaceholder: 'email@example.com или @username', message: 'Сообщение', messagePlaceholder: 'Расскажите о проекте, роли или задаче', send: 'Отправить сообщение →', sending: 'Отправляю…',
    requiredName: 'Укажите имя.', requiredContact: 'Укажите email или Telegram.', requiredMessage: 'Добавьте сообщение.', tooLong: 'Текст слишком длинный.', success: 'Спасибо, сообщение отправлено.', configError: 'Отправка пока не настроена. Напишите мне в Telegram или на email.', sendError: 'Не удалось отправить сообщение. Напишите мне в Telegram или на email.',
    footer: '© 2026 Anna Gromyko · AI Product Builder', top: 'Наверх ↑', notFound: 'Страница не найдена', home: 'На главную', current: 'СЕЙЧАС', nav: 'Основная навигация', heroGroup: 'Профессиональные направления', facts: 'Ключевые факты',
  },
  en: {
    skip: 'Skip to content', contact: 'Contact', resume: 'Resume', resumeDownload: 'Download resume', resumeUnavailable: 'The resume will be added before launch', themeDark: 'Switch to dark theme', themeLight: 'Switch to light theme', language: 'Language selection',
    heroTitle: 'I design and ship digital products at the intersection of business logic, UX, AI and data.', heroSubtitle: 'Choose a professional focus', viewCases: 'View cases →',
    featured: 'Featured case studies', more: 'More projects', expertise: 'Expertise', process: 'Process', experience: 'Experience', education: 'Education',
    openCase: 'View case study →', openProject: 'View project →', back: '← Back to home', next: 'Next project',
    challenge: 'Challenge', scope: 'Scope', approach: 'Process', result: 'Current status',
    contactHeading: 'Let’s talk', contactIntro: 'Open to product, design, and AI automation projects and roles at the intersection of UX, technology, and data. Tell me about the opportunity — I usually reply within one business day.',
    downloadResume: 'Download resume (PDF) ↓', formHeading: 'Send a message', formDescription: 'Briefly describe the project, role, or task.',
    name: 'Name', namePlaceholder: 'How should I address you?', contactField: 'Email or Telegram', contactPlaceholder: 'email@example.com or @username', message: 'Message', messagePlaceholder: 'Tell me about the project, role, or task', send: 'Send message →', sending: 'Sending…',
    requiredName: 'Enter your name.', requiredContact: 'Enter an email or Telegram handle.', requiredMessage: 'Add a message.', tooLong: 'This text is too long.', success: 'Thank you — your message has been sent.', configError: 'Message delivery is not configured yet. Please use Telegram or email.', sendError: 'The message could not be sent. Please use Telegram or email.',
    footer: '© 2026 Anna Gromyko · AI Product Builder', top: 'Back to top ↑', notFound: 'Page not found', home: 'Go home', current: 'CURRENT', nav: 'Main navigation', heroGroup: 'Professional focus areas', facts: 'Key facts',
  },
} as const

export type Translation = (typeof copy)[Locale]
