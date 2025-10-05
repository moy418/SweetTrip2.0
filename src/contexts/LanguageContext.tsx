import * as React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { Language } from '../types'
import { siteSettings } from '../config'

interface LanguageContextType {
  currentLanguage: string
  setLanguage: (language: string) => void
  languages: Language[]
  t: (key: string, params?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translation system
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.worldcup2026': 'World Cup 2026',
    'nav.cart': 'Cart',
    'nav.login': 'Sign In',
    'nav.register': 'Sign Up',
    'nav.profile': 'Profile',
    'nav.orders': 'Orders',
    'nav.logout': 'Sign Out',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.clear': 'Clear',
    'common.submit': 'Submit',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Products
    'products.title': 'Products',
    'products.featured': 'Featured Products',
    'products.new': 'New Products',
    'products.sale': 'Sale',
    'products.outOfStock': 'Out of Stock',
    'products.addToCart': 'Add to Cart',
    'products.viewDetails': 'View Details',
    'products.price': 'Price',
    'products.quantity': 'Quantity',
    'products.inStock': 'In Stock',
    'products.origin': 'Origin',
    'products.brand': 'Brand',
    'products.description': 'Description',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.item': 'item',
    'cart.items': 'items',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.continueShopping': 'Continue Shopping',
    'cart.removeItem': 'Remove Item',
    'cart.updateQuantity': 'Update Quantity',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shippingInfo': 'Shipping Information',
    'checkout.paymentInfo': 'Payment Information',
    'checkout.orderSummary': 'Order Summary',
    'checkout.placeOrder': 'Place Order',
    'checkout.billingSameAsShipping': 'Billing address same as shipping',
    'checkout.billingInfo': 'Billing Information',
    
    // Auth
    'auth.login': 'Sign In',
    'auth.register': 'Sign Up',
    'auth.logout': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.firstName': 'First Name',
    'auth.lastName': 'Last Name',
    'auth.phone': 'Phone',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.signInWith': 'Sign in with',
    'auth.signUpWith': 'Sign up with',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personalInfo': 'Personal Information',
    'profile.addressInfo': 'Address Information',
    'profile.orderHistory': 'Order History',
    'profile.editProfile': 'Edit Profile',
    'profile.saveChanges': 'Save Changes',
    
    // Orders
    'orders.title': 'Orders',
    'orders.noOrders': 'No orders found',
    'orders.orderNumber': 'Order Number',
    'orders.orderDate': 'Order Date',
    'orders.orderStatus': 'Status',
    'orders.orderTotal': 'Total',
    'orders.viewOrder': 'View Order',
    'orders.tracking': 'Tracking',
    
    // World Cup 2026
    'worldcup.title': 'World Cup 2026',
    'worldcup.comingSoon': 'Coming Soon',
    'worldcup.description': 'Get ready for the biggest football event!',
    'worldcup.features': 'Features',
    'worldcup.predictions': 'Match Predictions',
    'worldcup.countries': 'Country Collections',
    'worldcup.achievements': 'Achievements & Badges',
    'worldcup.stories': 'Cultural Stories',
    'worldcup.stats': 'Live Statistics',
    
    // Homepage
    'homepage.hero.subtitle': 'Discover amazing candies from around the world. Premium quality, authentic flavors, and worldwide shipping.',
    'homepage.hero.shopNow': 'Shop Now',
    'homepage.features.title': 'Why Choose SweetTrip?',
    'homepage.stats.title': 'SweetTrip by the Numbers',
    'homepage.cta.title': 'Ready to Start Your Sweet Journey?',
    'homepage.cta.subtitle': 'Join thousands of satisfied customers and discover your new favorite treats.',
    
    // Footer
    'footer.newsletter': 'Stay Sweet!',
    'footer.newsletterDesc': 'Get the latest updates on new products and exclusive offers.',
    'footer.subscribe': 'Subscribe',
    'footer.followUs': 'Follow Us',
    'footer.allRightsReserved': 'All rights reserved.',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.worldcup2026': 'Mundial 2026',
    'nav.cart': 'Carrito',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.profile': 'Perfil',
    'nav.orders': 'Pedidos',
    'nav.logout': 'Cerrar Sesión',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.remove': 'Quitar',
    'common.view': 'Ver',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.clear': 'Limpiar',
    'common.submit': 'Enviar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.close': 'Cerrar',
    'common.open': 'Abrir',
    'common.yes': 'Sí',
    'common.no': 'No',
    
    // Products
    'products.title': 'Productos',
    'products.featured': 'Productos Destacados',
    'products.new': 'Productos Nuevos',
    'products.sale': 'Oferta',
    'products.outOfStock': 'Agotado',
    'products.addToCart': 'Agregar al Carrito',
    'products.viewDetails': 'Ver Detalles',
    'products.price': 'Precio',
    'products.quantity': 'Cantidad',
    'products.inStock': 'En Stock',
    'products.origin': 'Origen',
    'products.brand': 'Marca',
    'products.description': 'Descripción',
    
    // Cart
    'cart.title': 'Carrito de Compras',
    'cart.empty': 'Tu carrito está vacío',
    'cart.item': 'artículo',
    'cart.items': 'artículos',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Envío',
    'cart.tax': 'Impuestos',
    'cart.total': 'Total',
    'cart.checkout': 'Finalizar Compra',
    'cart.continueShopping': 'Seguir Comprando',
    'cart.removeItem': 'Eliminar Artículo',
    'cart.updateQuantity': 'Actualizar Cantidad',
    
    // Checkout
    'checkout.title': 'Finalizar Compra',
    'checkout.shippingInfo': 'Información de Envío',
    'checkout.paymentInfo': 'Información de Pago',
    'checkout.orderSummary': 'Resumen del Pedido',
    'checkout.placeOrder': 'Realizar Pedido',
    'checkout.billingSameAsShipping': 'Dirección de facturación igual a la de envío',
    'checkout.billingInfo': 'Información de Facturación',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.logout': 'Cerrar Sesión',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.firstName': 'Nombre',
    'auth.lastName': 'Apellido',
    'auth.phone': 'Teléfono',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.rememberMe': 'Recordarme',
    'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
    'auth.dontHaveAccount': '¿No tienes una cuenta?',
    'auth.signInWith': 'Iniciar sesión con',
    'auth.signUpWith': 'Registrarse con',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.personalInfo': 'Información Personal',
    'profile.addressInfo': 'Información de Dirección',
    'profile.orderHistory': 'Historial de Pedidos',
    'profile.editProfile': 'Editar Perfil',
    'profile.saveChanges': 'Guardar Cambios',
    
    // Orders
    'orders.title': 'Pedidos',
    'orders.noOrders': 'No se encontraron pedidos',
    'orders.orderNumber': 'Número de Pedido',
    'orders.orderDate': 'Fecha del Pedido',
    'orders.orderStatus': 'Estado',
    'orders.orderTotal': 'Total',
    'orders.viewOrder': 'Ver Pedido',
    'orders.tracking': 'Seguimiento',
    
    // World Cup 2026
    'worldcup.title': 'Mundial 2026',
    'worldcup.comingSoon': 'Próximamente',
    'worldcup.description': '¡Prepárate para el evento de fútbol más grande!',
    'worldcup.features': 'Características',
    'worldcup.predictions': 'Predicciones de Partidos',
    'worldcup.countries': 'Colecciones por País',
    'worldcup.achievements': 'Logros y Medallas',
    'worldcup.stories': 'Historias Culturales',
    'worldcup.stats': 'Estadísticas en Vivo',
    
    // Homepage
    'homepage.hero.subtitle': 'Descubre dulces increíbles de todo el mundo. Calidad premium, sabores auténticos y envío mundial.',
    'homepage.hero.shopNow': 'Comprar Ahora',
    'homepage.features.title': '¿Por qué elegir SweetTrip?',
    'homepage.stats.title': 'SweetTrip en números',
    'homepage.cta.title': '¿Listo para comenzar tu viaje dulce?',
    'homepage.cta.subtitle': 'Únete a miles de clientes satisfechos y descubre tus nuevos dulces favoritos.',
    
    // Footer
    'footer.newsletter': '¡Mantente Dulce!',
    'footer.newsletterDesc': 'Recibe las últimas actualizaciones sobre nuevos productos y ofertas exclusivas.',
    'footer.subscribe': 'Suscribirse',
    'footer.followUs': 'Síguenos',
    'footer.allRightsReserved': 'Todos los derechos reservados.',
  },
}

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    localStorage.getItem('sweettrip-language') || siteSettings.defaultLanguage
  )

  const languages: Language[] = siteSettings.supportedLanguages.map(lang => ({
    code: lang.code,
    name: lang.name,
    flag: lang.flag,
    is_active: true,
  }))

  const setLanguage = (language: string) => {
    setCurrentLanguage(language)
    localStorage.setItem('sweettrip-language', language)
  }

  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[currentLanguage]?.[key] || translations.en[key] || key
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, value]) => str.replace(`{{${param}}}`, value),
        translation
      )
    }
    
    return translation
  }

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    languages,
    t,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
