import * as React from 'react'
import { createContext, useContext, useEffect } from 'react'
import { User } from '../types'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated, refreshUser } = useAuthStore()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await refreshUser()
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await refreshUser()
        } else {
          useAuthStore.setState({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [refreshUser])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



