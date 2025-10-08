import * as React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../stores/authStore'
import { useLanguage } from '../contexts/LanguageContext'
import { Eye, EyeOff, Mail, Lock, Sparkles, ShoppingBag, Heart, Star } from 'lucide-react'
import toast from 'react-hot-toast'

const LoginPage: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithSocial, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = React.useState(false)
  const [socialLoading, setSocialLoading] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn(formData.email, formData.password)
    if (result.success) {
      toast.success('¡Bienvenido de vuelta! 🎉')
      // Redirect to previous page or home
      const from = (location.state as any)?.from?.pathname || '/'
      navigate(from)
    } else {
      toast.error(result.error || 'Login failed')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider)
    try {
      const result = await signInWithSocial(provider)
      if (!result.success) {
        toast.error(result.error || `Failed to login with ${provider}`)
        setSocialLoading(null)
      }
      // If successful, the OAuth redirect will happen automatically
    } catch (error) {
      toast.error(`Error connecting to ${provider}`)
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Illustration/Branding */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Floating Emojis */}
            <div className="absolute top-10 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🍭</div>
            <div className="absolute top-20 right-16 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🍬</div>
            <div className="absolute bottom-20 left-16 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🍫</div>
            <div className="absolute bottom-10 right-10 text-4xl animate-bounce" style={{ animationDelay: '1.5s' }}>🍪</div>
            
            <div className="relative z-10">
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <img 
                  src="/sweetlogo-removebg-preview.png" 
                  alt="SweetTrip Logo" 
                  className="h-32 w-auto"
                />
              </div>
              
              <h2 className="text-4xl font-bold mb-6 text-center">
                Welcome Back to SweetTrip!
              </h2>
              
              <p className="text-xl text-white/90 mb-8 text-center">
                Continue your sweet journey with us
              </p>
              
              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <ShoppingBag className="h-6 w-6" />
                  <span className="font-medium">Track your orders easily</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Heart className="h-6 w-6" />
                  <span className="font-medium">Save your favorite candies</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Star className="h-6 w-6" />
                  <span className="font-medium">Get exclusive deals & offers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="text-center mb-8 lg:hidden">
            <img 
              src="/sweetlogo-removebg-preview.png" 
              alt="SweetTrip Logo" 
              className="h-24 w-auto mx-auto mb-4"
            />
          </div>
          
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sign In
              </CardTitle>
              <p className="text-center text-gray-600">
                {t('auth.dontHaveAccount')}{' '}
                <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">
                  {t('auth.register')}
                </Link>
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <span>{t('auth.email')}</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="h-12 text-base"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-purple-600" />
                    <span>{t('auth.password')}</span>
                  </label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="h-12 text-base pr-12"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                      {t('auth.rememberMe')}
                    </label>
                  </div>
                  
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base btn-gradient shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-5 w-5" />
                      <span>{t('auth.login')}</span>
                    </div>
                  )}
                </Button>
              </form>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 hover:bg-gray-50 transition-colors"
                  onClick={() => handleSocialLogin('google')}
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'google' ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 hover:bg-gray-50 transition-colors"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'facebook' ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </>
                  )}
                </Button>
              </div>
              
              {/* Guest Checkout Option */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-sm text-center text-gray-700">
                  <span className="font-semibold text-green-700">🛒 Quick Tip:</span> You can also{' '}
                  <Link to="/cart" className="font-semibold text-green-600 hover:text-green-700 hover:underline">
                    checkout as guest
                  </Link>
                  {' '}without creating an account!
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Security Badge */}
          <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Your information is secure and encrypted</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
