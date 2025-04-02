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
      sounds: {
        Row: {
          id: string
          created_at: string
          user_id: string
          url: string
          sound_name: string | null
          creator_name: string | null
          icon_url: string | null
          video_count: number
          video_history: number[]
          scrape_history: string[]
          last_scrape: string
          pct_change_1d: number
          pct_change_1w: number
          pct_change_1m: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          url: string
          sound_name?: string | null
          creator_name?: string | null
          icon_url?: string | null
          video_count?: number
          video_history?: number[]
          scrape_history?: string[]
          last_scrape?: string
          pct_change_1d?: number
          pct_change_1w?: number
          pct_change_1m?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          url?: string
          sound_name?: string | null
          creator_name?: string | null
          icon_url?: string | null
          video_count?: number
          video_history?: number[]
          scrape_history?: string[]
          last_scrape?: string
          pct_change_1d?: number
          pct_change_1w?: number
          pct_change_1m?: number
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: 'active' | 'canceled' | 'past_due' | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 