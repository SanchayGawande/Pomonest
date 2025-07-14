'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { Database } from './supabase'

type User = Database['public']['Tables']['users']['Row']
type Streak = Database['public']['Tables']['streaks']['Row']
type Session = Database['public']['Tables']['sessions']['Row']
type SavePass = Database['public']['Tables']['save_passes']['Row']

// Query Keys
export const queryKeys = {
  user: (userId: string) => ['user', userId],
  streak: (userId: string) => ['streak', userId],
  sessions: (userId: string) => ['sessions', userId],
  sessionsToday: (userId: string, date: string) => ['sessions', userId, 'today', date],
  sessionsWeek: (userId: string, startDate: string) => ['sessions', userId, 'week', startDate],
  savePasses: (userId: string) => ['save_passes', userId],
}

// User Queries
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.user(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data as User
    },
    enabled: !!userId,
  })
}

// Streak Queries
export function useStreak(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.streak(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data as Streak
    },
    enabled: !!userId,
  })
}

// Session Queries
export function useSessions(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sessions(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
      
      if (error) throw error
      return data as Session[]
    },
    enabled: !!userId,
  })
}

export function useSessionsToday(userId: string | undefined) {
  const today = new Date().toISOString().split('T')[0]
  
  return useQuery({
    queryKey: queryKeys.sessionsToday(userId || '', today),
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('session_date', today)
        .eq('session_type', 'work')
        .order('completed_at', { ascending: false })
      
      if (error) throw error
      return data as Session[]
    },
    enabled: !!userId,
  })
}

export function useSessionsWeek(userId: string | undefined) {
  // Get start of current week (Monday)
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - daysToMonday)
  const startDate = monday.toISOString().split('T')[0]
  
  return useQuery({
    queryKey: queryKeys.sessionsWeek(userId || '', startDate),
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('session_date', startDate)
        .eq('session_type', 'work')
        .order('session_date', { ascending: true })
      
      if (error) throw error
      return data as Session[]
    },
    enabled: !!userId,
  })
}

// Save Passes Queries
export function useSavePasses(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.savePasses(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID required')
      
      const { data, error } = await supabase
        .from('save_passes')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      
      if (error) {
        console.error('Save passes query error:', error)
        return null
      }
      return data as SavePass | null
    },
    enabled: !!userId,
  })
}

// Mutations
export function useCreateSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      sessionDate, 
      durationMinutes, 
      sessionType = 'work' 
    }: {
      userId: string
      sessionDate: string
      durationMinutes: number
      sessionType?: 'work' | 'break'
    }) => {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: userId,
          session_date: sessionDate,
          duration_minutes: durationMinutes,
          session_type: sessionType,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()
      
      if (error) throw error
      return data as Session
    },
    onSuccess: (data) => {
      // Invalidate and refetch session queries
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions(data.user_id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.sessionsToday(data.user_id, data.session_date) })
      queryClient.invalidateQueries({ queryKey: queryKeys.sessionsWeek(data.user_id, data.session_date) })
    },
  })
}

export function useUpdateStreakWithSavePass() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      sessionDate 
    }: {
      userId: string
      sessionDate: string
    }) => {
      const { data, error } = await supabase.rpc('update_streak_with_save_pass', {
        user_id_param: userId,
        session_date_param: sessionDate,
      })
      
      if (error) throw error
      return data as {
        current_streak: number
        longest_streak: number
        save_pass_used: boolean
        total_sessions: number
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch streak and save passes queries
      queryClient.invalidateQueries({ queryKey: queryKeys.streak(variables.userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.savePasses(variables.userId) })
    },
  })
}

export function useUpdateUserTheme() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      theme 
    }: {
      userId: string
      theme: 'light' | 'dark'
    }) => {
      const { data, error } = await supabase
        .from('users')
        .update({ theme })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data as User
    },
    onSuccess: (data) => {
      // Update user query cache
      queryClient.setQueryData(queryKeys.user(data.id), data)
    },
  })
}

export function useProUpgrade() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      passesToAdd 
    }: {
      userId: string
      passesToAdd: number
    }) => {
      const { error } = await supabase.rpc('handle_pro_upgrade', {
        user_id_param: userId,
        passes_to_add: passesToAdd,
      })
      
      if (error) throw error
      return { success: true }
    },
    onSuccess: (data, variables) => {
      // Invalidate user and save passes queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.savePasses(variables.userId) })
    },
  })
}