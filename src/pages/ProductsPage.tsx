import * as React from 'react'
import { useState } from 'react'
import { ProductGrid } from '../components/features/products/ProductGrid'
import { Button } from '../components/ui/Button'
import { useCartStore } from '../stores/cartStore'
import { useLanguage } from '../contexts/LanguageContext'
import { Product } from '../types'
import toast from 'react-hot-toast'

const ProductsPage: React.FC = () => {
  const { t } = useLanguage()
  const { addItem } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock data for now - will be replaced with real API calls
  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Cannoli filled 6 pcs',
            description: 'Traditional cannoli pastry, filled with pistachio, vanilla, and cocoa cream.',
            price: 11.75,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/60f9e845e524bb4e430b018a06bd0b36fe7add02f0bfeb0ae33a9443598ad823.jpg?v=1757395811'],
            stock_quantity: 10,
            is_active: true,
            featured: true,
            status: 'active',
            handle: 'cannoli-filled-6-pcs',
            tags: ['traditional', 'italian', 'dessert'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'LABUBU Angel Hair Dubai Chocolate Bar',
            description: 'TikTok phenomenon chocolate bar with pink cotton candy and pistachio.',
            price: 17.90,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/93b7c121e0eef4d6419e9b933bc5850a287d875b42687ede1c3c7098d5d0990b.jpg?v=1757019115'],
            stock_quantity: 5,
            is_active: true,
            featured: true,
            status: 'active',
            handle: 'labubu-angel-hair-dubai-chocolate-bar',
            tags: ['chocolate', 'dubai', 'viral'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '3',
            name: 'Samyang Buldak Corn Ramen',
            description: 'Spicy Korean instant ramen with corn flavor - 140g',
            price: 4.99,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/samyang-corn-ramen.jpg'],
            stock_quantity: 25,
            is_active: true,
            featured: true,
            status: 'active',
            handle: 'samyang-buldak-corn-ramen',
            tags: ['spicy', 'korean', 'ramen'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '4',
            name: 'Samyang Carbo Buldak Ramen',
            description: 'Creamy carbonara style spicy Korean ramen - 140g',
            price: 4.99,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/samyang-carbo-ramen.jpg'],
            stock_quantity: 0,
            is_active: true,
            featured: true,
            status: 'active',
            handle: 'samyang-carbo-buldak-ramen',
            tags: ['spicy', 'korean', 'ramen', 'creamy'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '5',
            name: 'Oasis Treasures Pistachio Chocolate',
            description: 'Premium pistachio chocolate bar made in USA - Over 1.6M sold',
            price: 12.50,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/oasis-pistachio-chocolate.jpg'],
            stock_quantity: 15,
            is_active: true,
            featured: true,
            status: 'active',
            handle: 'oasis-treasures-pistachio-chocolate',
            tags: ['chocolate', 'pistachio', 'premium', 'usa'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '6',
            name: 'Ferrero Rocher Collection',
            description: 'Premium Italian hazelnut chocolates in elegant packaging',
            price: 24.99,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/ferrero-rocher-collection.jpg'],
            stock_quantity: 30,
            is_active: true,
            featured: true,
            status: 'active',
            handle: 'ferrero-rocher-collection',
            tags: ['chocolate', 'hazelnut', 'premium', 'italian'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '7',
            name: 'Lindt Swiss Milk Chocolate',
            description: 'Smooth Swiss milk chocolate with Alpine milk',
            price: 8.75,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/lindt-swiss-milk-chocolate.jpg'],
            stock_quantity: 40,
            is_active: true,
            featured: false,
            status: 'active',
            handle: 'lindt-swiss-milk-chocolate',
            tags: ['chocolate', 'swiss', 'milk'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '8',
            name: 'Godiva Belgian Dark Chocolate',
            description: 'Rich Belgian dark chocolate truffles',
            price: 18.99,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/godiva-belgian-dark-chocolate.jpg'],
            stock_quantity: 20,
            is_active: true,
            featured: true,
            status: 'active',
            handle: 'godiva-belgian-dark-chocolate',
            tags: ['chocolate', 'belgian', 'dark', 'truffles'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '9',
            name: 'Turkish Delight Assorted',
            description: 'Traditional Turkish confectionery with rose and citrus flavors',
            price: 7.50,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/turkish-delight-assorted.jpg'],
            stock_quantity: 35,
            is_active: true,
            featured: false,
            status: 'active',
            handle: 'turkish-delight-assorted',
            tags: ['turkish', 'confectionery', 'rose', 'citrus'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '10',
            name: 'Japanese Pocky Strawberry',
            description: 'Crispy biscuit sticks coated with strawberry cream',
            price: 3.99,
            currency: 'USD',
            image_urls: ['https://cdn.shopify.com/s/files/1/0955/7111/6310/files/pocky-strawberry.jpg'],
            stock_quantity: 60,
            is_active: true,
            featured: false,
            status: 'active',
            handle: 'japanese-pocky-strawberry',
            tags: ['japanese', 'biscuit', 'strawberry'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
        
        setProducts(mockProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const handleAddToCart = async (product: Product) => {
    try {
      addItem(product, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add product to cart')
    }
  }

  const handleViewProduct = (product: Product) => {
    // TODO: Navigate to product detail page
    console.log('View product:', product)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('products.title')}
          </h1>
          <p className="text-lg text-gray-600">
            Discover our amazing collection of international candies and treats
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('common.search')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              {t('common.filter')}
            </Button>
            <Button variant="outline">
              {t('common.sort')}
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onProductClick={handleViewProduct}
          onAddToCart={handleAddToCart}
          emptyMessage="No products found. Please try adjusting your search criteria."
        />
      </div>
    </div>
  )
}

export default ProductsPage
