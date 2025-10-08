import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../stores/authStore'
import { useLanguage } from '../contexts/LanguageContext'
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, CheckCircle, Gift, Truck, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const RegisterPage: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { signUp, signInWithSocial, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [passwordStrength, setPasswordStrength] = React.useState(0)
  const [socialLoading, setSocialLoading] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  })

  // Calculate password strength
  React.useEffect(() => {
    const password = formData.password
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    setPasswordStrength(strength)
  }, [formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    const result = await signUp(formData.email, formData.password, {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || undefined,
    })
    
    if (result.success) {
      toast.success('🎉 Account created successfully! Welcome to SweetTrip!')
      navigate('/')
    } else {
      toast.error(result.error || 'Registration failed')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200'
    if (passwordStrength === 1) return 'bg-red-500'
    if (passwordStrength === 2) return 'bg-orange-500'
    if (passwordStrength === 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return ''
    if (passwordStrength === 1) return 'Weak'
    if (passwordStrength === 2) return 'Fair'
    if (passwordStrength === 3) return 'Good'
    return 'Strong'
  }

  const handleSocialSignup = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider)
    try {
      const result = await signInWithSocial(provider)
      if (!result.success) {
        toast.error(result.error || `Failed to signup with ${provider}`)
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
          <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Floating Emojis */}
            <div className="absolute top-8 right-12 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎁</div>
            <div className="absolute top-32 left-8 text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>🍩</div>
            <div className="absolute bottom-32 right-8 text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>🧁</div>
            <div className="absolute bottom-8 left-12 text-4xl animate-bounce" style={{ animationDelay: '0.9s' }}>🍰</div>
            
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
                Join the SweetTrip Family!
              </h2>
              
              <p className="text-xl text-white/90 mb-8 text-center">
                Start your international candy adventure today
              </p>
              
              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Gift className="h-6 w-6" />
                  <span className="font-medium">Welcome bonus on first order</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Truck className="h-6 w-6" />
                  <span className="font-medium">Free shipping on orders $60+</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Heart className="h-6 w-6" />
                  <span className="font-medium">Early access to new products</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
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
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <p className="text-center text-gray-600">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">
                  {t('auth.login')}
                </Link>
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <span>{t('auth.firstName')}</span>
                    </label>
                    <Input
                      name="first_name"
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="John"
                      className="h-11"
                      autoComplete="given-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {t('auth.lastName')}
                    </label>
                    <Input
                      name="last_name"
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="h-11"
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                
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
                    className="h-11"
                    autoComplete="email"
                  />
                </div>
                
                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-purple-600" />
                    <span>{t('auth.phone')} <span className="text-gray-400">(optional)</span></span>
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="h-11"
                    autoComplete="tel"
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
                      placeholder="Create a strong password"
                      className="h-11 pr-12"
                      autoComplete="new-password"
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      {passwordStrength > 0 && (
                        <p className={`text-xs font-medium ${
                          passwordStrength === 4 ? 'text-green-600' :
                          passwordStrength === 3 ? 'text-yellow-600' :
                          passwordStrength === 2 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          Password strength: {getPasswordStrengthText()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-purple-600" />
                    <span>{t('auth.confirmPassword')}</span>
                  </label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="h-11 pr-12"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="flex items-center space-x-2">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-red-500"></div>
                          <span className="text-xs text-red-600 font-medium">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base btn-gradient shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading || formData.password !== formData.confirmPassword}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-5 w-5" />
                      <span>{t('auth.register')}</span>
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
                  onClick={() => handleSocialSignup('google')}
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
                  onClick={() => handleSocialSignup('facebook')}
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
              
              {/* Terms */}
              <p className="mt-6 text-xs text-center text-gray-500">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-purple-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
              </p>
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

export default RegisterPage
