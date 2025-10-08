import * as React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

const Footer: React.FC = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { nameKey: 'footer.aboutUs', href: '/about' },
      { nameKey: 'footer.contact', href: '/contact' },
      { nameKey: 'footer.careers', href: '/careers' },
      { nameKey: 'footer.press', href: '/press' },
    ],
    products: [
      { nameKey: 'footer.allProducts', href: '/products' },
      { nameKey: 'footer.featured', href: '/products?featured=true' },
      { nameKey: 'footer.newArrivals', href: '/products?new=true' },
      { nameKey: 'footer.worldCup', href: '/worldcup2026' },
    ],
    support: [
      { nameKey: 'footer.helpCenter', href: '/help' },
      { nameKey: 'footer.shippingInfo', href: '/shipping' },
      { nameKey: 'footer.returns', href: '/returns' },
      { nameKey: 'footer.sizeGuide', href: '/size-guide' },
    ],
    legal: [
      { nameKey: 'footer.privacy', href: '/privacy' },
      { nameKey: 'footer.terms', href: '/terms' },
      { nameKey: 'footer.cookies', href: '/cookies' },
      { nameKey: 'footer.refund', href: '/refund' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Twitter', href: '#', icon: Twitter },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">SweetTrip</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              {t('footer.description')}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">support@sweettrip.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">New York, NY</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.company')}</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.nameKey}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {t(link.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.products')}</h3>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.nameKey}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {t(link.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.nameKey}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {t(link.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.nameKey}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {t(link.nameKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">{t('footer.newsletter')}</h3>
              <p className="text-gray-400">
                {t('footer.newsletterDesc')}
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder={t('footer.enterEmail')}
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-r-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200">
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © {currentYear} SweetTrip. {t('footer.allRightsReserved')}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer



