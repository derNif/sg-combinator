export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          onboarding_completed: boolean
          onboarding_completed_at: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          created_at: string | null
          updated_at: string | null
          primary_goal: string | null
          objectives: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string | null
          updated_at?: string | null
          primary_goal?: string | null
          objectives?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
          primary_goal?: string | null
          objectives?: string[] | null
        }
      }
      startups: {
        Row: {
          id: string
          user_id: string
          created_at: string | null
          updated_at: string | null
          name: string
          industry: string | null
          stage: string | null
          description: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string | null
          updated_at?: string | null
          name: string
          industry?: string | null
          stage?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
          name?: string
          industry?: string | null
          stage?: string | null
          description?: string | null
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          created_at: string | null
          skill: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string | null
          skill: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string | null
          skill?: string
        }
      }
      user_experience: {
        Row: {
          id: string
          user_id: string
          created_at: string | null
          updated_at: string | null
          description: string | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string | null
          updated_at?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string | null
          updated_at?: string | null
          description?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 