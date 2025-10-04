import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'
import { supabase } from '../lib/supabase'

interface AuthStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, userData: { first_name: string; last_name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      signIn: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            set({ isLoading: false })
            return { success: false, error: error.message }
          }

          if (data.user) {
            // Fetch user profile
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single()

            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              first_name: profile?.first_name || null,
              last_name: profile?.last_name || null,
              phone: profile?.phone || null,
              avatar_url: profile?.avatar_url || null,
              role: profile?.role || 'customer',
              status: profile?.status || 'active',
              created_at: profile?.created_at || data.user.created_at,
              updated_at: profile?.updated_at || data.user.updated_at,
            }

            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            })
            return { success: true }
          }

          set({ isLoading: false })
          return { success: false, error: 'No user data returned' }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred' 
          }
        }
      },

      signUp: async (email, password, userData) => {
        set({ isLoading: true })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: userData,
            },
          })

          if (error) {
            set({ isLoading: false })
            return { success: false, error: error.message }
          }

          if (data.user) {
            // Create user profile
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                first_name: userData.first_name,
                last_name: userData.last_name,
                phone: userData.phone,
                role: 'customer',
                status: 'active',
              })

            if (profileError) {
              set({ isLoading: false })
              return { success: false, error: profileError.message }
            }

            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              first_name: userData.first_name,
              last_name: userData.last_name,
              phone: userData.phone,
              avatar_url: null,
              role: 'customer',
              status: 'active',
              created_at: data.user.created_at,
              updated_at: data.user.updated_at,
            }

            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            })
            return { success: true }
          }

          set({ isLoading: false })
          return { success: false, error: 'No user data returned' }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred' 
          }
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        try {
          await supabase.auth.signOut()
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          console.error('Sign out error:', error)
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true })
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          })

          if (error) {
            set({ isLoading: false })
            return { success: false, error: error.message }
          }

          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred' 
          }
        }
      },

      updateProfile: async (userData) => {
        const { user } = get()
        if (!user) return { success: false, error: 'No user logged in' }

        set({ isLoading: true })
        try {
          const { error } = await supabase
            .from('users')
            .update({
              ...userData,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

          if (error) {
            set({ isLoading: false })
            return { success: false, error: error.message }
          }

          // Update local user state
          const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() }
          set({ 
            user: updatedUser, 
            isLoading: false 
          })

          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error instanceof Error ? error.message : 'An unexpected error occurred' 
          }
        }
      },

      refreshUser: async () => {
        const { user } = get()
        if (!user) return

        set({ isLoading: true })
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error) {
            set({ isLoading: false })
            console.error('Error refreshing user:', error)
            return
          }

          const updatedUser: User = {
            ...user,
            ...data,
          }

          set({ 
            user: updatedUser, 
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          console.error('Error refreshing user:', error)
        }
      },
    }),
    {
      name: 'sweettrip-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

