import * as React from 'react'
import { Product } from '../../../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  loading: boolean
  error?: string | null
  onProductClick: (product: Product) => void
  onAddToCart: (product: Product) => void
  emptyMessage?: string
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  error,
  onProductClick,
  onAddToCart,
  emptyMessage = 'No products found',
}) => {
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😞</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCard
            key={index}
            product={{} as Product}
            onAddToCart={() => {}}
            onViewDetails={() => {}}
            isLoading={true}
          />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🍭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onProductClick}
        />
      ))}
    </div>
  )
}

export { ProductGrid }



