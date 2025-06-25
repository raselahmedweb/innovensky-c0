export interface TeamMember {
  id: number
  name: string
  role: string
  bio?: string
  image_url?: string
  linkedin_url?: string
  twitter_url?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  title: string
  description?: string
  image_url?: string
  project_url?: string
  github_url?: string
  technologies: string[]
  category?: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}
