import * as React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../stores/authStore'
import { useLanguage } from '../contexts/LanguageContext'
import toast from 'react-hot-toast'

const RegisterPage: React.FC = () => {
  const { t } = useLanguage()
  const { signUp, isLoading } = useAuthStore()
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const result = await signUp(formData.email, formData.password, {
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone: formData.phone || undefined,
    })
    
    if (result.success) {
      toast.success('Account created successfully!')
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('auth.register')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('auth.firstName')}
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                />
                
                <Input
                  label={t('auth.lastName')}
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
              
              <Input
                label={t('auth.email')}
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              
              <Input
                label={t('auth.phone')}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number (optional)"
              />
              
              <Input
                label={t('auth.password')}
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
              
              <Input
                label={t('auth.confirmPassword')}
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              
              <Button
                type="submit"
                className="w-full btn-gradient"
                loading={isLoading}
                disabled={isLoading}
              >
                {t('auth.register')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage

