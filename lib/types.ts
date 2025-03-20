export interface AITool {
  id: string
  name: string
  description: string
  category: string
  useCases: string[]
  pricing: "Free" | "Paid" | "Freemium" | "Enterprise"
  url: string
  icon?: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isTrending?: boolean
}

