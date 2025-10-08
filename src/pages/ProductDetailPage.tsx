import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, Shield, Award, Info, Sparkles, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useCartStore } from '../stores/cartStore'
import { useLanguage } from '../contexts/LanguageContext'
import { formatPrice } from '../utils'
import { Product } from '../types'
import { ProductService } from '../services/productService'
import toast from 'react-hot-toast'

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { addItem } = useCartStore()
  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [quantity, setQuantity] = React.useState(1)
  const [selectedImage, setSelectedImage] = React.useState(0)
  const [isFavorite, setIsFavorite] = React.useState(false)

  React.useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        
        if (!id) {
          throw new Error('No product ID provided')
        }
        
        // Load product from Supabase
        const productData = await ProductService.getProductById(id)
        
        if (!productData) {
          console.error('Product not found:', id)
          setProduct(null)
          return
        }
        
        setProduct(productData)
        console.log('✅ Product loaded:', productData.name)
        
      } catch (error) {
        console.error('Failed to load product:', error)
        toast.error('Failed to load product details')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      toast.success(
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-4 w-4" />
          <span>{product.name} added to cart!</span>
        </div>
      )
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addItem(product, quantity)
      navigate('/checkout')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <Sparkles className="h-6 w-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 animate-pulse">Loading amazing candy details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🍭</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-gray-600 mb-8">This sweet treat seems to have disappeared!</p>
          <Link to="/products">
            <Button className="btn-gradient">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = product.image_urls || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/products" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6 group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Enhanced Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-2xl group">
              {images[selectedImage] ? (
                <>
                  <img
                    src={images[selectedImage]}
                    alt={`${product.name} - View ${selectedImage + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <span className="text-8xl animate-bounce">🍭</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? 'ring-4 ring-purple-500 shadow-lg scale-105'
                        : 'hover:ring-2 hover:ring-purple-300 hover:scale-102'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Secure Payment</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <Truck className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Fast Shipping</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-md">
                <Award className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Authentic</p>
              </div>
            </div>
          </div>

          {/* Product Info - Enhanced */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    {product.origin_country && (
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" />
                        <span>{product.origin_country}</span>
                      </Badge>
                    )}
                    {product.tags?.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  {product.brand && (
                    <p className="text-lg text-gray-600 flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>{product.brand}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                {product.weight_grams && (
                  <span className="text-gray-500 text-sm">
                    ({product.weight_grams}g)
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Badge variant="success" className="text-sm">
                      In Stock - {product.stock_quantity} available
                    </Badge>
                  </div>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-semibold text-gray-700">Quantity:</label>
                  <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="hover:bg-white"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="hover:bg-white"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className="btn-gradient shadow-lg hover:shadow-xl transition-all"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleBuyNow}
                    disabled={product.stock_quantity === 0}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>

            {/* AI-Powered Description */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    AI-Enhanced Description
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
                <div className="bg-white/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-purple-900 flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>What makes this special?</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 mt-1">✓</span>
                      <span>Authentic {product.origin_country || 'international'} recipe with traditional preparation methods</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 mt-1">✓</span>
                      <span>Premium quality ingredients sourced from {product.brand || 'trusted suppliers'}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 mt-1">✓</span>
                      <span>Perfect for {product.tags?.join(', ') || 'any occasion'}</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-600 mt-1">✓</span>
                      <span>Carefully packaged to preserve freshness and flavor</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-gray-600" />
                  <span>Product Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {product.brand && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-600 block text-xs mb-1">Brand</span>
                      <span className="font-semibold text-gray-900">{product.brand}</span>
                    </div>
                  )}
                  {product.origin_country && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-600 block text-xs mb-1">Origin</span>
                      <span className="font-semibold text-gray-900">{product.origin_country}</span>
                    </div>
                  )}
                  {product.weight_grams && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-600 block text-xs mb-1">Weight</span>
                      <span className="font-semibold text-gray-900">{product.weight_grams}g</span>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-600 block text-xs mb-1">SKU</span>
                    <span className="font-semibold text-gray-900 font-mono text-xs">{product.id}</span>
                  </div>
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-4">
                    <span className="text-gray-600 text-xs block mb-2">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Shipping & Returns Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Truck className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $60 to anywhere in the US</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">Your information is protected with SSL encryption</p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Quality Guarantee</h3>
              <p className="text-sm text-gray-600">100% authentic products or your money back</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
