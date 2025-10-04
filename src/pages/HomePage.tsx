import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Truck, Shield, Heart, ShoppingCart } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useLanguage } from '../contexts/LanguageContext'
import FloatingEmojis from '../components/ui/FloatingEmojis'

const HomePage: React.FC = () => {
  // const { t } = useLanguage()

  // const features = [
  //   {
  //     icon: Star,
  //     title: 'Premium Quality',
  //     description: 'Only the finest candies and treats from around the world',
  //   },
  //   {
  //     icon: Truck,
  //     title: 'Worldwide Shipping',
  //     description: 'We ship to over 50 countries with fast and reliable delivery',
  //   },
  //   {
  //     icon: Shield,
  //     title: 'Secure Shopping',
  //     description: 'Your data and payments are protected with industry-leading security',
  //   },
  //   {
  //     icon: Heart,
  //     title: 'Customer Love',
  //     description: 'Join thousands of satisfied customers who trust SweetTrip',
  //   },
  // ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <FloatingEmojis />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Majestic Logo */}
            <div className="mb-8 flex justify-center">
              <img 
                src="/sweetlogo-removebg-preview.png" 
                alt="SweetTrip Logo" 
                className="h-40 md:h-56 lg:h-72 w-auto animate-majestic logo-glow"
              />
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Discover amazing candies from around the world. Premium quality, 
              authentic flavors, and worldwide shipping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="hero-button bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-2xl hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 border-0">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products?featured=true">
                <Button size="lg" className="hero-button bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-2xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 border-0">
                  Featured Products
                  <Star className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              FEATURED SWEET TREATS
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Hand-picked by our global candy experts, these treats represent the <span className="text-purple-600 font-semibold">best flavors</span> from around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Countries</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-pink-600 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Products</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Fresh Stock</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-green-600 mb-2">
                4.9
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div className="text-gray-600 font-medium">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Why Choose Sweet Trip?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We bring you the best of international candy culture with unmatched quality and service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-200 transition-colors">
                <Truck className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Fast & Free Shipping</h3>
              <p className="text-gray-600">
                Free shipping on orders over $60. Get your international candy favorites delivered quickly and safely to your door.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <Shield className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">100% Authentic</h3>
              <p className="text-gray-600">
                All our products are sourced directly from manufacturers and verified distributors. No imitations, just authentic flavors.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Heart className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Curated Selection</h3>
              <p className="text-gray-600">
                Our team personally tastes and selects every product. We only offer candies that meet our high standards for quality and taste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium international candies
            </p>
          </div>
          
          {/* Featured Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Product 1 */}
            <Card className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src="https://cdn.shopify.com/s/files/1/0955/7111/6310/files/60f9e845e524bb4e430b018a06bd0b36fe7add02f0bfeb0ae33a9443598ad823.jpg?v=1757395811"
                  alt="Cannoli filled 6 pcs"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-orange-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                  Featured
                </Badge>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                  <span className="text-lg">🇮🇹</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Cannoli filled 6 pcs</h3>
                <p className="text-sm text-gray-600 mb-4">Traditional cannoli pastry, filled with pistachio, vanilla, and cocoa cream.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">$11.75</span>
                  <span className="text-sm text-gray-500">🇮🇹 Italy</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>

            {/* Product 2 */}
            <Card className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src="https://cdn.shopify.com/s/files/1/0955/7111/6310/files/93b7c121e0eef4d6419e9b933bc5850a287d875b42687ede1c3c7098d5d0990b.jpg?v=1757019115"
                  alt="LABUBU Angel Hair Dubai Chocolate Bar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-orange-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                  Featured
                </Badge>
                <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                  Out of Stock
                </Badge>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                  <span className="text-lg">🇦🇪</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 text-gray-900">LABUBU Angel Hair Dubai Chocolate Bar</h3>
                <p className="text-sm text-gray-600 mb-4">TikTok phenomenon chocolate bar with pink cotton candy and pistachio.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">$17.90</span>
                  <span className="text-sm text-gray-500">🇦🇪 Dubai</span>
                </div>
                <Button disabled className="w-full bg-gray-300 text-gray-500">
                  Out of Stock
                </Button>
              </CardContent>
            </Card>

            {/* Product 3 */}
            <Card className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src="https://cdn.shopify.com/s/files/1/0955/7111/6310/files/samyang-corn-ramen.jpg"
                  alt="Samyang Buldak Corn Ramen"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-orange-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                  Featured
                </Badge>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                  <span className="text-lg">🇰🇷</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Samyang Buldak Corn Ramen</h3>
                <p className="text-sm text-gray-600 mb-4">Spicy Korean instant ramen with corn flavor - 140g</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">$4.99</span>
                  <span className="text-sm text-gray-500">🇰🇷 South Korea</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>

            {/* Product 4 */}
            <Card className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src="https://cdn.shopify.com/s/files/1/0955/7111/6310/files/oasis-pistachio-chocolate.jpg"
                  alt="Oasis Treasures Pistachio Chocolate"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-orange-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                  Featured
                </Badge>
                <Badge className="absolute bottom-3 left-3 bg-yellow-500 text-white border-0 px-3 py-1 text-xs font-semibold">
                  Over 1.6M Sold
                </Badge>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                  <span className="text-lg">🇺🇸</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Oasis Treasures Pistachio Chocolate</h3>
                <p className="text-sm text-gray-600 mb-4">Premium pistachio chocolate bar made in USA - Over 1.6M sold</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">$12.50</span>
                  <span className="text-sm text-gray-500">🇺🇸 USA</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <Button size="lg" className="btn-gradient">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* World Cup 2026 Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            FIFA World Cup 2026
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get ready for the biggest football event! Special collections, 
            predictions, and exclusive merchandise coming soon.
          </p>
          <Link to="/worldcup2026">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Explore World Cup 2026
            </Button>
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Sweet!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest updates on new products and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <Button className="btn-gradient whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
