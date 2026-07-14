export type Locale = 'ru' | 'en'
export type Theme = 'light' | 'dark'
export type LocalizedText = Record<Locale, string>
export type Accent = 'teal' | 'blue' | 'gold' | 'neutral'
export type ProjectStatus = 'in-development' | 'closed-testing' | 'own-project' | 'research' | 'concept' | 'client-work' | 'live'

export interface Project {
  id: string
  slug: string
  title: LocalizedText
  category: LocalizedText
  role: LocalizedText
  description: LocalizedText
  status: ProjectStatus
  statusLabel: LocalizedText
  tags: LocalizedText[]
  coverSrc: string
  coverAlt: LocalizedText
  featured: boolean
  accent: Accent
  route: string
  coverPosition?: string
  span?: 5 | 7
}

export interface LocalizedItem {
  title: LocalizedText
  description: LocalizedText
}
