import * as React from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Heart, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent } from '../components/ui/Card'
import { useCartStore } from '../stores/cartStore'
import { useLanguage } from '../contexts/LanguageContext'
import { formatPrice } from '../utils'
import { Product } from '../types'
import toast from 'react-hot-toast'

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useLanguage()
  const { addItem } = useCartStore()
  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [quantity, setQuantity] = React.useState(1)

  React.useEffect(() => {
    // TODO: Replace with actual API call
    const loadProduct = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock product data
        const mockProduct: Product = {
          id: id || '1',
          name: 'Cannoli filled 6 pcs',
          description: 'Traditional cannoli pastry, filled with pistachio, vanilla, and cocoa cream. Made with authentic Italian techniques and the finest ingredients.',
          price: 11.75,
          currency: 'USD',
          image_urls: [
            'https://cdn.shopify.com/s/files/1/0955/7111/6310/files/60f9e845e524bb4e430b018a06bd0b36fe7add02f0bfeb0ae33a9443598ad823.jpg?v=1757395811',
            'https://cdn.shopify.com/s/files/1/0955/7111/6310/files/1df57f926f7d37f6cc8205ac4c458bc39ee8f8515adbf252286a6bf5cae95df3.jpg?v=1757395813'
          ],
          stock_quantity: 10,
          is_active: true,
          featured: true,
          status: 'active',
          handle: 'cannoli-filled-6-pcs',
          tags: ['traditional', 'italian', 'dessert'],
          brand: 'Pennisi - Cannoli di Sicilia',
          origin_country: 'Italy',
          weight_grams: 180,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        setProduct(mockProduct)
      } catch (error) {
        console.error('Failed to load product:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      toast.success(`${product.name} added to cart!`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {product.image_urls?.[0] ? (
                <img
                  src={product.image_urls[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <span className="text-6xl">🍭</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.image_urls.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {product.featured && (
                  <Badge variant="success">Featured</Badge>
                )}
                {product.origin_country && (
                  <Badge variant="outline">{product.origin_country}</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-purple-600">
                {formatPrice(product.price)}
              </span>
              {product.weight_grams && (
                <span className="text-gray-500">
                  {product.weight_grams}g
                </span>
              )}
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock_quantity > 0 ? (
                <Badge variant="success">In Stock ({product.stock_quantity} available)</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 btn-gradient"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="space-y-2 text-sm">
                  {product.brand && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                  )}
                  {product.origin_country && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium">{product.origin_country}</span>
                    </div>
                  )}
                  {product.weight_grams && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{product.weight_grams}g</span>
                    </div>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tags:</span>
                      <span className="font-medium">{product.tags.join(', ')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage



