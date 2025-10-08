import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const { refreshUser } = useAuthStore()
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading')

  React.useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          toast.error('Authentication failed')
          setTimeout(() => navigate('/login'), 2000)
          return
        }

        if (data.session) {
          // Session established successfully
          console.log('✅ OAuth session established')
          
          // Refresh user data
          await refreshUser()
          
          setStatus('success')
          toast.success('¡Welcome to SweetTrip! 🎉')
          
          // Redirect to home
          setTimeout(() => navigate('/'), 1000)
        } else {
          setStatus('error')
          toast.error('No session found')
          setTimeout(() => navigate('/login'), 2000)
        }
      } catch (error) {
        console.error('Callback handling error:', error)
        setStatus('error')
        toast.error('Something went wrong')
        setTimeout(() => navigate('/login'), 2000)
      }
    }

    handleAuthCallback()
  }, [navigate, refreshUser])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
              <Sparkles className="h-8 w-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In...</h2>
            <p className="text-gray-600">Please wait while we set up your account</p>
            <div className="mt-8 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-6xl mb-6 animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-600">Redirecting to your sweet journey...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">😞</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">Redirecting back to login...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthCallbackPage

