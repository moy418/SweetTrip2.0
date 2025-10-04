import * as React from 'react'
import { useState } from 'react'
import { ProductGrid } from '../components/features/products/ProductGrid'
import { Button } from '../components/ui/Button'
import { useCartStore } from '../stores/cartStore'
import { useLanguage } from '../contexts/LanguageContext'
import { Product } from '../types'
import { useProducts } from '../hooks/useProducts'
import toast from 'react-hot-toast'

const ProductsPage: React.FC = () => {
  const { t } = useLanguage()
  const { addItem } = useCartStore()
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  
  // Use the real products hook
  const { products, loading, error, refetch, totalCount } = useProducts({
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
    featured: showFeaturedOnly || undefined,
    status: 'active',
    limit: 50 // Load more products
  })

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const handleFeaturedToggle = () => {
    setShowFeaturedOnly(!showFeaturedOnly)
  }

  const handleRetry = () => {
    refetch()
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
          {totalCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {products.length} of {totalCount} products
            </p>
          )}
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('common.search') || 'Search for candies...'}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">All Categories</option>
              <option value="chocolate">Chocolate</option>
              <option value="candy">Candy</option>
              <option value="snacks">Snacks</option>
              <option value="international">International</option>
            </select>
            <Button 
              variant={showFeaturedOnly ? "default" : "outline"}
              onClick={handleFeaturedToggle}
            >
              {showFeaturedOnly ? 'Show All' : 'Featured Only'}
            </Button>
            <Button variant="outline" onClick={handleRetry}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-medium">Error loading products</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
              <Button variant="outline" onClick={handleRetry} className="text-red-600 border-red-300 hover:bg-red-50">
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onProductClick={handleViewProduct}
          onAddToCart={handleAddToCart}
          emptyMessage="No products found. Please try adjusting your search criteria."
        />

        {/* Load More Button (if needed) */}
        {!loading && products.length > 0 && products.length < totalCount && (
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              onClick={() => {
                // TODO: Implement pagination
                console.log('Load more products')
              }}
            >
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage