import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Search, Gift, ChevronDown, Star, Truck, Heart } from 'lucide-react'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const navigate = useNavigate()
  
  const { getTotalItems } = useCartStore()
  const { user, isAuthenticated, signOut } = useAuthStore()
  
  const cartItemsCount = getTotalItems()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm('')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'World Cup 2026', href: '/worldcup2026' },
  ]

  const categories = [
    { name: 'HALLOWEEN', href: '/products?category=halloween' },
    { name: 'CHOCOLATE', href: '/products?category=chocolate' },
    { name: 'COOKIES', href: '/products?category=cookies' },
    { name: 'CHIPS', href: '/products?category=chips' },
    { name: 'SWEETS', href: '/products?category=sweets' },
    { name: 'SPICY', href: '/products?category=spicy' },
    { name: 'DRINKS', href: '/products?category=drinks' },
    { name: 'ALL PRODUCTS', href: '/products' },
    { name: 'FEATURED', href: '/products?featured=true' },
  ]

  return (
    <header className="bg-white shadow-lg">
      {/* Header 1: Promotional Banner - Only Free Shipping */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Truck className="h-4 w-4" />
            <span className="text-sm font-semibold">
              FREE SHIPPING on orders over $60
            </span>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1 left-4 text-lg animate-bounce" style={{ animationDelay: '0s' }}>🍭</div>
          <div className="absolute top-1 right-8 text-sm animate-bounce" style={{ animationDelay: '0.5s' }}>🍬</div>
          <div className="absolute top-1 left-1/3 text-sm animate-bounce" style={{ animationDelay: '1s' }}>🍫</div>
        </div>
      </div>


      {/* Header 3: Main Navigation - Sticky */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - As large as possible */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img 
                  src="/sweetlogo-removebg-preview.png" 
                  alt="SweetTrip Logo" 
                  className="w-20 h-20 object-contain group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-yellow-800 fill-current" />
                </div>
              </div>
            </Link>

            {/* Search Bar - Center */}
            <div className="flex items-center flex-1 max-w-4xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search Product Name / Type or Brand"
                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                />
                {searchTerm.length === 0 && (
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors cursor-pointer">
                      Search
                    </div>
                  </button>
                )}
              </form>
            </div>

            {/* Cart and Menu - Right */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center text-gray-700 hover:text-purple-600 transition-colors group"
              >
                <div className="p-2 rounded-full bg-green-50 group-hover:bg-green-100 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>

              {/* Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden py-4 px-4 bg-gray-50 border-t border-gray-200">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search Product Name / Type or Brand"
              className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </form>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Categories */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="text-sm text-gray-700 hover:text-purple-600 transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated && user ? (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="text-left text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header