import type { Locale } from '../../types'

export type DesignApprovedLocale = Locale
export type LocalizedText = Readonly<Record<DesignApprovedLocale, string>>

export interface DesignApprovedDirection {
  num: string
  label: LocalizedText
  outcome: LocalizedText
}

export interface DesignApprovedProofPoint {
  stat: LocalizedText
  label: LocalizedText
}

export interface DesignApprovedChapter {
  id: string
  label: LocalizedText
}

