import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../contexts/LanguageContext'

const OrdersPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('orders.title')}
        </h1>
        
        <div className="text-center py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Order History Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Order history features are being implemented. This will include:
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>• Order status tracking</li>
                <li>• Order details and items</li>
                <li>• Shipping information</li>
                <li>• Download receipts</li>
                <li>• Reorder functionality</li>
              </ul>
              <Button className="mt-6 w-full btn-gradient">
                Back to Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OrdersPage



