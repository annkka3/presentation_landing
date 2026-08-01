import type { LocalizedText } from '../types'

const l = (ru: string, en: string): LocalizedText => ({ ru, en })

export type CryptoScreenKey =
  | 'profile'
  | 'achievements'
  | 'seasonVictory'
  | 'seasonDynamics'
  | 'lobbyFinale'
  | 'leaderboard'
  | 'createRoom'
  | 'archetypeRisk'
  | 'eventRoom'
  | 'memeEvent'
  | 'memeChoices'
  | 'riskyResult'
  | 'resultDetail'
  | 'roomState'
  | 'gameStats'
  | 'statsList'
  | 'invite'
  | 'marketFrames'
  | 'marketSkins'
  | 'fundingEvent'
  | 'goodResult'
  | 'goodResultDetail'

export interface CryptoScreen {
  key: CryptoScreenKey
  src: string
  srcSet: string
  alt: LocalizedText
}

const screen = (key: CryptoScreenKey, file: string, altRu: string, altEn: string): CryptoScreen => ({
  key,
  src: `/assets/crypto-reality/${file}-660.webp`,
  srcSet: `/assets/crypto-reality/${file}-660.webp 660w, /assets/crypto-reality/${file}-1320.webp 1320w`,
  alt: l(altRu, altEn),
})

export const cryptoScreens: Record<CryptoScreenKey, CryptoScreen> = {
  profile: screen('profile', 'profile', 'Экран профиля Crypto Reality со статистикой сезонов, рейтингом, инвентарём и любимым архетипом.', 'Crypto Reality profile screen with season stats, rank, inventory, and favorite archetype.'),
  achievements: screen('achievements', 'achievements', 'Экран достижений Crypto Reality с категориями, редкостью, прогрессом и открытыми наградами.', 'Crypto Reality achievements screen with categories, rarity, progress, and unlocked rewards.'),
  seasonVictory: screen('seasonVictory', 'season-victory', 'Экран финала сезона с победой, первым местом, бонусами и сезонным титулом.', 'Season finale screen with victory, first place, bonuses, and a seasonal title.'),
  seasonDynamics: screen('seasonDynamics', 'season-dynamics', 'Экран динамики сезона с топом игроков, дневными результатами и итоговыми действиями.', 'Season dynamics screen with player ranking, daily results, and final actions.'),
  lobbyFinale: screen('lobbyFinale', 'lobby-finale', 'Экран лобби с завершённым сезоном, визуализацией позиции игрока и таблицей лидеров.', 'Lobby screen with a completed season, player position visualization, and leaderboard.'),
  leaderboard: screen('leaderboard', 'leaderboard', 'Экран таблицы лидеров с первым местом игрока, топом комнаты и лентой событий.', 'Leaderboard screen with the player in first place, room ranking, and event feed.'),
  createRoom: screen('createRoom', 'create-room', 'Экран создания или входа в комнату с режимом игры, часовым поясом и кодом приглашения.', 'Room creation and join screen with game mode, timezone, and invite code.'),
  archetypeRisk: screen('archetypeRisk', 'archetype-risk', 'Экран выбора архетипа Risk Manager с описанием поведения и ключевыми навыками.', 'Archetype selection screen for Risk Manager with behavior description and key skills.'),
  eventRoom: screen('eventRoom', 'event-room', 'Экран активного события комнаты с таймером, игровым состоянием и лидербордом.', 'Active room event screen with timer, game state, and leaderboard.'),
  memeEvent: screen('memeEvent', 'meme-event', 'Экран игрового события с изображением ситуации, таймером и вариантами решения.', 'Game event screen with situation image, timer, and decision options.'),
  memeChoices: screen('memeChoices', 'meme-choices', 'Экран выбора решения с четырьмя вариантами и компактной панелью профиля игрока.', 'Decision screen with four options and a compact player profile panel.'),
  riskyResult: screen('riskyResult', 'risky-result', 'Экран результата рискованного решения с изменением очков и поведенческих показателей.', 'Risky decision result screen with score and behavioral stat changes.'),
  resultDetail: screen('resultDetail', 'result-detail', 'Детальный экран результата решения с итогом влияния, сезонным счётом и действиями после выбора.', 'Detailed decision result screen with impact, season score, and post-choice actions.'),
  roomState: screen('roomState', 'room-state', 'Экран комнаты с прогрессом сезона, текущим событием, распределением ответов и показателями игрока.', 'Room state screen with season progress, current event, response distribution, and player stats.'),
  gameStats: screen('gameStats', 'game-stats', 'Экран игровых показателей, окон дня и результатов по дням.', 'Game stats screen with player indicators, day windows, and day results.'),
  statsList: screen('statsList', 'stats-list', 'Экран списка игровых показателей: банкролл, репутация, альфа, стресс, FOMO и дисциплина.', 'Stats list screen with bankroll, reputation, alpha, stress, FOMO, and discipline.'),
  invite: screen('invite', 'invite', 'Экран приглашения игроков с кодом комнаты, Telegram share и ссылкой-приглашением.', 'Invite players screen with room code, Telegram share, and invite link.'),
  marketFrames: screen('marketFrames', 'market-frames', 'Экран DAO Market с валютой Sparks и каталогом рамок профиля.', 'DAO Market screen with Sparks currency and profile frame catalog.'),
  marketSkins: screen('marketSkins', 'market-skins', 'Экран DAO Market с каталогом скинов персонажа.', 'DAO Market screen with character skin catalog.'),
  fundingEvent: screen('fundingEvent', 'funding-event', 'Экран события про funding с таймером и переходом к выбору решения.', 'Funding event screen with timer and decision entry point.'),
  goodResult: screen('goodResult', 'good-result', 'Экран хорошего решения с положительным результатом и изменением показателей.', 'Good decision result screen with positive outcome and stat changes.'),
  goodResultDetail: screen('goodResultDetail', 'good-result-detail', 'Детальный экран хорошего результата с сезонным счётом и действиями после решения.', 'Detailed good result screen with season score and post-decision actions.'),
}

export const cryptoReality = {
  back: l('← На главную', '← Back home'),
  hero: {
    eyebrow: 'TELEGRAM MINI APP · GAME SYSTEM · PRODUCT DESIGN',
    title: 'Crypto Reality',
    subtitle: l('Семидневная социальная игра о поведении на крипторынке', 'A seven-day social game about behavior in crypto markets'),
    description: l('Игроки объединяются в комнаты, принимают решения в рыночных ситуациях и наблюдают, как выбор влияет на дисциплину, FOMO, стресс, репутацию и итог сезона.', 'Players join rooms, make decisions in market situations, and see how each choice changes discipline, FOMO, stress, reputation, and the season outcome.'),
    role: 'Product ownership · UX architecture · Game systems · Visual direction · AI-assisted development',
    status: 'CLOSED BETA · 2026',
    facts: [l('7-дневный сезон', '7-day season'), l('8 архетипов', '8 archetypes'), l('комнатная механика', 'room mechanics'), l('событийные окна', 'event windows'), l('достижения и рейтинг', 'achievements and leaderboard')],
  },
  snapshot: {
    items: [
      { title: l('Формат', 'Format'), text: l('Telegram Mini App\nСезонная multiplayer-игра', 'Telegram Mini App\nSeasonal multiplayer game') },
      { title: l('Роль', 'Role'), text: l('Владелец продукта\nUX и продуктовая архитектура\nВизуальное направление', 'Product owner\nUX and product architecture\nVisual direction') },
      { title: l('Реализация', 'Implementation'), text: l('React · TypeScript · FastAPI\nPostgreSQL · Telegram Bot API', 'React · TypeScript · FastAPI\nPostgreSQL · Telegram Bot API') },
      { title: l('Статус', 'Status'), text: l('Закрытое тестирование\nProduct beta', 'Closed testing\nProduct beta') },
    ],
    note: l('От идеи и игровых правил до работающей системы, backend-логики, интерфейсов, QA и подготовки к закрытому запуску.', 'From concept and game rules to a working system, backend logic, interfaces, QA, and preparation for a closed launch.'),
  },
  sections: {
    problem: {
      title: l('Как превратить рыночное поведение в игровой опыт', 'Turning market behavior into a game experience'),
      problemTitle: l('Проблема', 'Problem'),
      problemText: l('Большинство криптоигр фокусируются на угадывании цены, симуляции торговли или абстрактных наградах. При этом реальные поведенческие паттерны — FOMO, дисциплина, стресс, склонность к риску и влияние толпы — остаются за пределами игрового опыта.', 'Most crypto games focus on price guessing, trading simulation, or abstract rewards. Real behavioral patterns — FOMO, discipline, stress, risk appetite, and crowd influence — often remain outside the experience.'),
      hypothesisTitle: l('Гипотеза', 'Hypothesis'),
      hypothesisText: l('Вместо симулятора сделки Crypto Reality моделирует процесс принятия решений. Игрок не выбирает «правильную цену», а реагирует на ситуации, сравнивает свой выбор с комнатой и постепенно формирует поведенческий профиль.', 'Instead of simulating trades, Crypto Reality models the decision-making process. The player does not choose the “right price”; they react to situations, compare their choice with the room, and gradually build a behavioral profile.'),
      statement: l('Не предсказать рынок, а увидеть собственное поведение внутри него.', 'Not to predict the market, but to see your own behavior inside it.'),
      signal: ['Market signal', 'Choice', 'Consequence', 'Profile', 'Season result'],
    },
    loop: {
      title: l('Семь дней решений', 'Seven days of decisions'),
      subtitle: l('Один сезон превращает отдельные выборы в понятную историю поведения.', 'One season turns individual choices into a readable behavioral story.'),
      steps: [
        { label: 'Room', title: l('Создать или войти в комнату', 'Create or join a room'), text: l('Игрок создаёт комнату или присоединяется по коду и проходит сезон вместе с другими участниками.', 'The player creates a room or joins by code, then goes through the season with other participants.') },
        { label: 'Archetype', title: l('Выбрать архетип', 'Choose an archetype'), text: l('Архетип задаёт стартовый образ и игровую рамку, но итоговый профиль формируется реальными решениями.', 'The archetype sets an initial identity and frame, while the final profile is shaped by actual decisions.') },
        { label: 'Event', title: l('Получить событие', 'Receive an event'), text: l('События открываются в утреннем, дневном и бонусном вечернем окне.', 'Events open in morning, day, and bonus evening windows.') },
        { label: 'Choice', title: l('Принять решение', 'Make a choice'), text: l('Каждое событие предлагает несколько стратегий без заранее очевидного «правильного» ответа.', 'Each event offers several strategies without an obvious “correct” answer upfront.') },
        { label: 'Consequence', title: l('Увидеть последствия', 'See consequences'), text: l('Решение влияет на очки сезона и набор поведенческих показателей.', 'The decision affects season points and a set of behavioral indicators.') },
        { label: 'Final', title: l('Завершить сезон', 'Finish the season'), text: l('В финале игрок получает место, титул, аналитику сезона, достижения и награды.', 'At the finale, the player receives a placement, title, season analysis, achievements, and rewards.') },
      ],
      captions: [l('Создание комнаты', 'Room creation'), l('Выбор архетипа', 'Archetype selection'), l('Событие и варианты', 'Event and choices'), l('Итог сезона', 'Season result')],
    },
    rooms: {
      title: l('Решение становится социальным', 'A decision becomes social'),
      text: l('Комната связывает индивидуальный выбор с поведением группы. Игрок видит, как распределились ответы, отслеживает динамику участников и сравнивает итог сезона без прямой торговли и денежных ставок.', 'A room connects individual decisions with group behavior. The player sees how answers are distributed, follows participant dynamics, and compares season outcomes without direct trading or real-money stakes.'),
      groups: [l('Room setup', 'Room setup'), l('Shared season', 'Shared season')],
      flow: ['Host', 'Invite', 'Shared timeline', 'Final leaderboard'],
    },
    decisions: {
      title: l('Выбор без очевидного правильного ответа', 'Choice without an obvious correct answer'),
      text: l('Ситуации построены вокруг неоднозначных рыночных и социальных сигналов. Варианты ответа отражают разные модели поведения: осторожность, проверку данных, делегирование, импульсивный риск или отказ от действия.', 'Situations are built around ambiguous market and social signals. Answer options reflect different behavior models: caution, data checking, delegation, impulsive risk, or refusal to act.'),
      annotations: [
        { title: 'Context', text: l('Ситуация задаёт рыночный, социальный или эмоциональный контекст.', 'The situation sets a market, social, or emotional context.') },
        { title: 'Time pressure', text: l('Окно ограничивает время ответа, но не требует постоянного присутствия в приложении.', 'The window limits response time without requiring constant presence in the app.') },
        { title: 'Choice architecture', text: l('Варианты различаются по логике, риску и мотивации, а не только по формулировке.', 'Options differ by logic, risk, and motivation — not only wording.') },
        { title: 'Delayed feedback', text: l('Последствия раскрываются после выбора, чтобы не превращать игру в тест с подсказкой.', 'Consequences are revealed after selection, so the game does not become a hinted quiz.') },
      ],
      transition: 'DECISION → CONSEQUENCE',
    },
    behavior: {
      title: l('Поведение как система показателей', 'Behavior as a system of indicators'),
      text: l('Один выбор может одновременно повысить FOMO, стресс и альфу, но снизить банкролл. Система избегает одномерной оценки и показывает компромиссы между импульсом, дисциплиной, ресурсами и социальной репутацией.', 'One choice can increase FOMO, stress, and alpha while reducing bankroll. The system avoids one-dimensional scoring and shows trade-offs between impulse, discipline, resources, and social reputation.'),
      example: l('Решение принесло −2 очка, но изменило сразу несколько характеристик: FOMO, стресс, репутацию, банкролл и Degen Index.', 'The decision brought −2 points but changed several characteristics at once: FOMO, stress, reputation, bankroll, and Degen Index.'),
      note: 'Example player profile',
      stats: [
        { label: l('Банкролл', 'Bankroll'), value: 59 },
        { label: l('Репутация', 'Reputation'), value: 59 },
        { label: l('Альфа', 'Alpha'), value: 50 },
        { label: l('Стресс', 'Stress'), value: 38 },
        { label: 'FOMO', value: 22 },
        { label: l('Дисциплина', 'Discipline'), value: 82 },
        { label: 'Degen Index', value: 18 },
      ],
    },
    archetypes: {
      title: l('Восемь способов пережить рынок', 'Eight ways to survive the market'),
      subtitle: l('Архетип — это не класс с фиксированной стратегией, а стартовая идентичность игрока.', 'An archetype is not a fixed-strategy class; it is the player’s starting identity.'),
      items: [
        { name: 'Risk Manager', image: '/assets/crypto-reality/archetypes/risk-manager.webp', color: '#3d91ff', traits: [l('дисциплина', 'discipline'), l('банкролл', 'bankroll'), l('репутация', 'reputation')], text: l('Контроль риска, низкий FOMO и стабильный набор score через дисциплину.', 'Risk control, low FOMO, and steady score growth through discipline.') },
        { name: 'Meme-coin Degen', image: '/assets/crypto-reality/archetypes/meme-coin-degen.webp', color: '#b8ff22', traits: ['FOMO', l('импульс', 'impulse'), l('социальный шум', 'social noise')], text: l('Живёт на скорости, ловит тренды и платит стрессом за потенциальную альфу.', 'Lives on speed, chases trends, and pays in stress for potential alpha.') },
        { name: 'On-chain Detective', image: '/assets/crypto-reality/archetypes/on-chain-detective.webp', color: '#648dff', traits: [l('данные', 'data'), l('проверка', 'verification'), l('сигналы', 'signals')], text: l('Сначала ищет подтверждение, затем принимает решение.', 'Looks for evidence before making the decision.') },
        { name: 'Leverage Cowboy', image: '/assets/crypto-reality/archetypes/leverage-cowboy.webp', color: '#ff6338', traits: [l('риск', 'risk'), l('альфа', 'alpha'), l('волатильность', 'volatility')], text: l('Выбирает агрессивные сценарии и принимает сильную амплитуду результата.', 'Chooses aggressive scenarios and accepts a wider outcome range.') },
        { name: 'HODL Monk', image: '/assets/crypto-reality/archetypes/hodl-monk.webp', color: '#dfad4d', traits: [l('терпение', 'patience'), l('низкий стресс', 'low stress'), l('устойчивость', 'resilience')], text: l('Сохраняет спокойствие и не реагирует на каждый рыночный шум.', 'Stays calm and does not react to every market noise.') },
        { name: 'Airdrop Farmer', image: '/assets/crypto-reality/archetypes/airdrop-farmer.webp', color: '#f1c878', traits: [l('рутина', 'routine'), l('система', 'system'), l('награды', 'rewards')], text: l('Собирает ценность через повторяемость, дисциплину и внимательность.', 'Extracts value through repeatability, discipline, and attention.') },
        { name: 'Moon Prophet', image: '/assets/crypto-reality/archetypes/moon-prophet.webp', color: '#3fc9ff', traits: [l('убеждение', 'conviction'), l('нарратив', 'narrative'), l('ожидание', 'expectation')], text: l('Сильно верит в сценарий и готов выдерживать неопределённость.', 'Strongly believes in the narrative and can withstand uncertainty.') },
        { name: 'Capitulation Doomer', image: '/assets/crypto-reality/archetypes/capitulation-doomer.webp', color: '#ff4747', traits: [l('защита', 'defense'), l('сомнение', 'doubt'), l('снижение риска', 'risk-off')], text: l('Видит угрозы раньше других, но рискует пропустить восстановление.', 'Sees threats early, but risks missing the recovery.') },
      ],
    },
    finale: {
      title: l('Финал превращает неделю в историю', 'The finale turns a week into a story'),
      text: l('Финал объединяет результат комнаты, личный счёт, титул, ежедневную динамику и объяснение ключевых решений. Игрок получает не только место в рейтинге, но и интерпретацию пройденного пути.', 'The finale combines room outcome, personal score, title, daily dynamics, and an explanation of key decisions. The player gets not only a ranking placement, but an interpretation of the path taken.'),
      callout: l('Победа — только один из возможных финалов. Ценность сезона сохраняется и при проигрыше: игрок видит, какие решения сформировали итог.', 'Victory is only one possible finale. The season still has value after a loss: the player sees which decisions shaped the outcome.'),
    },
    progression: {
      title: l('Прогресс без pay-to-win', 'Progression without pay-to-win'),
      text: l('Sparks используются как внутренняя off-chain валюта персонализации. Они открывают визуальные предметы и коллекционные элементы, но не дают преимущества в сезонных решениях и рейтинге.', 'Sparks are used as an internal off-chain personalization currency. They unlock visual items and collectible elements, but do not give an advantage in season decisions or ranking.'),
      layers: ['Achievements', 'Profile', 'DAO Market'],
      flow: ['Play', 'Complete season', 'Earn Sparks', 'Personalize', 'Share', 'Return'],
      disclaimer: l('Персонализация не влияет на вероятность победы и не меняет игровые параметры сезона.', 'Personalization does not affect the probability of winning and does not change season gameplay parameters.'),
    },
    architecture: {
      title: l('Из отдельных экранов — в связанную систему', 'From separate screens to a connected system'),
      text: l('Основная сложность проекта заключалась не в количестве экранов, а в согласовании времени, состояния комнаты, индивидуального прогресса, экономики и повторяемого сезонного цикла.', 'The main complexity was not the number of screens, but the coordination of time, room state, individual progress, economy, and the repeatable season loop.'),
      layers: [
        { title: 'Entry layer', items: ['Telegram entry', 'onboarding', 'room creation', 'invitation'] },
        { title: 'Game layer', items: ['season', 'day', 'event window', 'situation', 'choice', 'consequence'] },
        { title: 'Identity layer', items: ['archetype', 'profile stats', 'achievements', 'titles'] },
        { title: 'Social layer', items: ['room', 'leaderboard', 'event feed', 'share cards'] },
        { title: 'Economy layer', items: ['Sparks ledger', 'catalog', 'inventory', 'purchase', 'equip'] },
        { title: 'System layer', items: ['notifications', 'idempotency', 'scheduling', 'analytics', 'localization', 'feature flags'] },
      ],
    },
    role: {
      title: l('Моя роль', 'My role'),
      blocks: [
        { title: 'Product definition', items: [l('сформировала концепцию продукта', 'defined the product concept'), l('определила сезонный цикл', 'defined the seasonal loop'), l('разработала игровую модель комнат и событий', 'designed the room and event model'), l('сформировала систему архетипов и показателей', 'shaped the archetype and indicator system'), l('определила границы MVP', 'set the MVP boundaries')] },
        { title: 'UX architecture', items: [l('спроектировала основные пользовательские сценарии', 'designed the core user flows'), l('описала состояния комнаты, сезона и событий', 'specified room, season, and event states'), l('разработала навигацию и логику сложных экранов', 'designed navigation and complex screen logic'), l('связала профиль, достижения, рейтинг и экономику', 'connected profile, achievements, leaderboard, and economy')] },
        { title: 'Visual and content system', items: [l('задала визуальное направление', 'set the visual direction'), l('сформировала систему персонажей и архетипов', 'created the character and archetype system'), l('организовала производство игровых экранов и ассетов', 'organized game screen and asset production'), l('разработала структуру ситуаций, выборов и результатов', 'structured situations, choices, and outcomes')] },
        { title: 'AI-assisted implementation and QA', items: [l('использовала AI-инструменты для реализации и анализа', 'used AI tools for implementation and analysis'), l('контролировала архитектурные решения и diff', 'controlled architectural decisions and diffs'), l('разделяла backend, frontend и QA-контуры', 'separated backend, frontend, and QA loops'), l('проверяла типизацию, тесты, сборку и регрессии', 'checked typing, tests, builds, and regressions'), l('доводила функции до работающего состояния', 'brought features to working state')] },
      ],
      stack: ['React', 'TypeScript', 'Vite', 'FastAPI', 'PostgreSQL', 'Telegram Mini Apps', 'Telegram Bot API', 'Docker', 'Playwright', 'Python', 'AI-assisted development'],
    },
    solutions: {
      title: l('Ключевые продуктовые решения', 'Key product decisions'),
      items: [
        { title: l('Сезон вместо бесконечной игры', 'A season instead of an endless game'), text: l('Семидневный цикл создаёт понятное начало и завершение, снижает порог возвращения и позволяет сравнивать разные стратегии между сезонами.', 'The seven-day loop creates a clear beginning and end, lowers the return threshold, and makes strategies comparable across seasons.') },
        { title: l('Поведенческий профиль вместо одной оценки', 'A behavioral profile instead of one score'), text: l('Итог формируется не только очками. Показатели раскрывают, почему игрок получил конкретный результат.', 'The outcome is not formed by points alone. Indicators explain why the player received a specific result.') },
        { title: l('Социальное сравнение без финансового риска', 'Social comparison without financial risk'), text: l('Комнаты и leaderboard создают соревновательность, но игра не требует реальных ставок или подключения торгового счёта.', 'Rooms and the leaderboard create competition, while the game does not require real stakes or a trading account.') },
        { title: l('Персонализация без pay-to-win', 'Personalization without pay-to-win'), text: l('Внутренняя экономика усиливает коллекционный и социальный слой, не вмешиваясь в правила сезона.', 'The internal economy strengthens the collectible and social layer without interfering with season rules.') },
      ],
    },
    contact: {
      title: l('Продукт, в котором интерфейс — только видимая часть системы', 'A product where the interface is only the visible part of the system'),
      text: l('Crypto Reality объединяет игровую механику, социальные сценарии, поведенческую модель, сезонную экономику и Telegram-native UX в одном работающем продукте.', 'Crypto Reality brings game mechanics, social scenarios, a behavioral model, seasonal economy, and Telegram-native UX into one working product.'),
      discuss: l('Обсудить проект', 'Discuss the project'),
      other: l('Смотреть другие проекты', 'View other projects'),
      next: 'NEXT PROJECT',
      nextTitle: 'THE DAO WAY',
      nextText: l('Визуальная и бренд-система продуктовой экосистемы.', 'A visual and brand system for a connected product ecosystem.'),
    },
  },
}
