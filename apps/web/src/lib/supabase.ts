import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          is_pro: boolean
          timezone: string
          theme: 'light' | 'dark' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          is_pro?: boolean
          timezone?: string
          theme?: 'light' | 'dark' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          is_pro?: boolean
          timezone?: string
          theme?: 'light' | 'dark' | null
          created_at?: string
          updated_at?: string
        }
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_session_date: string | null
          total_sessions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_session_date?: string | null
          total_sessions?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_session_date?: string | null
          total_sessions?: number
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          session_date: string
          duration_minutes: number
          session_type: 'work' | 'break'
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_date: string
          duration_minutes?: number
          session_type?: 'work' | 'break'
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_date?: string
          duration_minutes?: number
          session_type?: 'work' | 'break'
          completed_at?: string
          created_at?: string
        }
      }
      save_passes: {
        Row: {
          user_id: string
          passes_left: number
          updated_at: string
        }
        Insert: {
          user_id: string
          passes_left?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          passes_left?: number
          updated_at?: string
        }
      }
    }
    Functions: {
      handle_pro_upgrade: {
        Args: {
          user_id_param: string
          passes_to_add: number
        }
        Returns: void
      }
      consume_save_pass: {
        Args: {
          user_id_param: string
        }
        Returns: boolean
      }
      update_streak_with_save_pass: {
        Args: {
          user_id_param: string
          session_date_param: string
        }
        Returns: {
          current_streak: number
          longest_streak: number
          save_pass_used: boolean
          total_sessions: number
        }
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client for App Router
export function createServerClient() {
  const cookieStore = cookies()
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'Authorization': `Bearer ${cookieStore.get('sb-access-token')?.value || ''}`,
      },
    },
  })
}