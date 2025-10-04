import * as React from 'react'
import { Product } from '../../../types'
import { Card, CardContent } from '../../ui/Card'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'
import { formatPrice } from '../../../utils'
import { ShoppingCart, Eye, Flag, Star } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
  isLoading?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  isLoading = false,
}) => {
  const [imageError, setImageError] = React.useState(false)
  const [isAddingToCart, setIsAddingToCart] = React.useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await onAddToCart(product)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (isLoading) {
    return <ProductCardSkeleton />
  }

  // Get country flag emoji
  const getCountryEmoji = (country: string) => {
    const countryEmojis: { [key: string]: string } = {
      'Italy': '🇮🇹',
      'Dubai': '🇦🇪',
      'Japan': '🇯🇵',
      'Germany': '🇩🇪',
      'South Korea': '🇰🇷',
      'USA': '🇺🇸',
      'Switzerland': '🇨🇭',
      'Belgium': '🇧🇪',
      'Turkey': '🇹🇷',
    };
    return countryEmojis[country] || '🌍';
  };

  return (
    <Card className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
      <div className="aspect-square relative overflow-hidden">
        {!imageError && product.image_urls?.[0] ? (
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <span className="text-4xl">🍭</span>
          </div>
        )}
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-orange-500 text-white border-0 px-3 py-1 text-xs font-semibold">
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.stock_quantity === 0 && (
            <Badge variant="destructive" className="px-3 py-1 text-xs font-semibold">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Country flag */}
        {product.origin_country && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
            <span className="text-lg">{getCountryEmoji(product.origin_country)}</span>
          </div>
        )}

        {/* Special badges */}
        {product.compare_price && product.compare_price > product.price && (
          <Badge className="absolute bottom-3 left-3 bg-red-500 text-white border-0 px-3 py-1 text-xs font-semibold">
            Sale
          </Badge>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onViewDetails(product)}
              className="bg-white/90 hover:bg-white text-gray-800"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || isAddingToCart}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-sm text-gray-500 mb-2 font-medium">{product.brand}</p>
            )}
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-purple-600">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>
            {product.origin_country && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Flag className="w-4 h-4" />
                <span className="font-medium">{product.origin_country}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(product)}
              className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || isAddingToCart}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>

          {/* Stock indicator */}
          {!product.stock_quantity && product.stock_quantity < 10 && (
            <p className="text-xs text-orange-600 font-medium">
              Only {product.stock_quantity} left in stock!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton component
const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-gray-200 rounded flex-1 animate-pulse" />
            <div className="h-9 bg-gray-200 rounded flex-1 animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { ProductCard }
