export type OpportunityCategory =
  | 'Internship'
  | 'Hackathon'
  | 'Scholarship'
  | 'Workshop'
  | 'Competition'

export interface Opportunity {
  id: string
  title: string
  organization: string
  category: OpportunityCategory
  description: string
  fullDescription: string
  eligibility: string[]
  location: string
  deadline: string
  skills?: string[]
  instructions: string
  isDemo?: boolean
  creatorName?: string
}