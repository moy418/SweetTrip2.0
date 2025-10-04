import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../contexts/LanguageContext'

const CheckoutPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('checkout.title')}
        </h1>
        
        <div className="text-center py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Checkout Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                The checkout process is being implemented. This will include:
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>• Shipping information form</li>
                <li>• Payment processing with Stripe</li>
                <li>• Order confirmation</li>
                <li>• Email notifications</li>
              </ul>
              <Button className="mt-6 w-full btn-gradient">
                Back to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage



