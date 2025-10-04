import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../stores/authStore'
import { useLanguage } from '../contexts/LanguageContext'

const ProfilePage: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('profile.title')}
        </h1>
        
        <div className="text-center py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Profile Management Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Profile management features are being implemented. This will include:
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>• Personal information editing</li>
                <li>• Address management</li>
                <li>• Password changes</li>
                <li>• Order history</li>
                <li>• Preferences</li>
              </ul>
              {user && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Welcome, {user.first_name || user.email}!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage



