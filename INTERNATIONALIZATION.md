# Internationalization System - SweetTrip

## Overview

SweetTrip implements a comprehensive internationalization (i18n) system supporting multiple languages with dynamic switching and context-based translations.

## Supported Languages

### Primary Languages
- **English (EN)**: Default language
- **Spanish (ES)**: Full translation available

### Future Languages (Planned)
- **French (FR)**: Partial translation
- **Portuguese (PT)**: Partial translation
- **Italian (IT)**: Partial translation

## Translation Structure

### Translation Keys (500+ total)

#### Navigation
```typescript
navigation: {
  home: 'Home',
  featured: 'Featured',
  products: 'Products',
  categories: 'Categories',
  cart: 'Cart',
  checkout: 'Checkout',
  login: 'Login',
  register: 'Register',
  profile: 'Profile',
  orders: 'Orders',
  logout: 'Logout'
}
```

#### Homepage
```typescript
homepage: {
  hero: {
    title: 'Welcome to SweetTrip',
    subtitle: 'Discover amazing candies from around the world',
    cta: 'Shop Now',
    featured: 'Featured Products'
  },
  features: {
    title: 'Why Choose SweetTrip?',
    items: [
      {
        title: 'Worldwide Shipping',
        description: 'We ship to over 50 countries'
      },
      {
        title: 'Premium Quality',
        description: 'Only the finest candies and treats'
      },
      {
        title: 'Fast Delivery',
        description: 'Quick and reliable shipping'
      }
    ]
  }
}
```

#### Passport Office
```typescript
passportOffice: {
  title: 'Passport Office',
  subtitle: 'Get your SweetTrip passport for exclusive benefits',
  benefits: [
    'Exclusive discounts',
    'Early access to new products',
    'Free shipping on orders over $60',
    'Special birthday offers'
  ],
  cta: 'Get Your Passport'
}
```

#### Footer
```typescript
footer: {
  company: {
    title: 'SweetTrip',
    description: 'Your gateway to the world\'s finest candies and treats'
  },
  links: {
    about: 'About Us',
    contact: 'Contact',
    shipping: 'Shipping Info',
    returns: 'Returns',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service'
  },
  social: {
    follow: 'Follow Us',
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter'
  },
  newsletter: {
    title: 'Newsletter',
    description: 'Subscribe for updates and special offers',
    placeholder: 'Enter your email',
    button: 'Subscribe'
  }
}
```

#### Legal Pages
```typescript
legal: {
  privacyPolicy: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: {date}',
    sections: {
      information: 'Information We Collect',
      usage: 'How We Use Your Information',
      sharing: 'Information Sharing',
      security: 'Data Security',
      cookies: 'Cookies',
      rights: 'Your Rights'
    }
  },
  termsOfService: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: {date}',
    sections: {
      acceptance: 'Acceptance of Terms',
      use: 'Use of Service',
      orders: 'Orders and Payment',
      shipping: 'Shipping and Delivery',
      returns: 'Returns and Refunds',
      liability: 'Limitation of Liability'
    }
  }
}
```

#### Error Messages
```typescript
errors: {
  general: {
    somethingWentWrong: 'Something went wrong',
    tryAgain: 'Please try again',
    contactSupport: 'Contact support if the problem persists'
  },
  auth: {
    invalidCredentials: 'Invalid email or password',
    emailExists: 'Email already exists',
    weakPassword: 'Password is too weak',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required'
  },
  cart: {
    itemNotFound: 'Item not found',
    insufficientStock: 'Insufficient stock',
    invalidQuantity: 'Invalid quantity',
    cartEmpty: 'Your cart is empty'
  },
  checkout: {
    paymentFailed: 'Payment failed',
    shippingRequired: 'Shipping address is required',
    billingRequired: 'Billing address is required',
    orderFailed: 'Order creation failed'
  }
}
```

## Implementation

### Language Context
```typescript
// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  availableLanguages: string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [availableLanguages] = useState(['en', 'es']);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('sweettrip-language');
    if (savedLanguage && availableLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, [availableLanguages]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('sweettrip-language', lang);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: changeLanguage,
      t,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

### Translation System
```typescript
// src/lib/i18n.ts
export const translations = {
  en: {
    navigation: {
      home: 'Home',
      featured: 'Featured',
      products: 'Products',
      categories: 'Categories',
      cart: 'Cart',
      checkout: 'Checkout',
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
      orders: 'Orders',
      logout: 'Logout'
    },
    homepage: {
      hero: {
        title: 'Welcome to SweetTrip',
        subtitle: 'Discover amazing candies from around the world',
        cta: 'Shop Now',
        featured: 'Featured Products'
      }
    },
    // ... more translations
  },
  es: {
    navigation: {
      home: 'Inicio',
      featured: 'Destacados',
      products: 'Productos',
      categories: 'Categorías',
      cart: 'Carrito',
      checkout: 'Finalizar Compra',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      profile: 'Perfil',
      orders: 'Pedidos',
      logout: 'Cerrar Sesión'
    },
    homepage: {
      hero: {
        title: 'Bienvenido a SweetTrip',
        subtitle: 'Descubre increíbles dulces de todo el mundo',
        cta: 'Comprar Ahora',
        featured: 'Productos Destacados'
      }
    },
    // ... more translations
  }
};

export type TranslationKey = keyof typeof translations.en;
export type Language = keyof typeof translations;
```

### Language Switcher Component
```typescript
// src/components/LanguageSwitcher.tsx
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  const languageNames = {
    en: 'English',
    es: 'Español'
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 text-white hover:text-blue-300 transition-colors">
        <Globe className="h-4 w-4" />
        <span>{languageNames[language as keyof typeof languageNames]}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
              language === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            {languageNames[lang as keyof typeof languageNames]}
          </button>
        ))}
      </div>
    </div>
  );
};
```

## Usage Examples

### Basic Translation
```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t('homepage.hero.title')}</h1>
      <p>{t('homepage.hero.subtitle')}</p>
    </div>
  );
};
```

### Translation with Parameters
```typescript
const OrderSummary = ({ orderNumber, date }) => {
  const { t } = useLanguage();

  return (
    <div>
      <h2>{t('orders.summary.title', { orderNumber })}</h2>
      <p>{t('orders.summary.date', { date })}</p>
    </div>
  );
};
```

### Conditional Translation
```typescript
const ProductStatus = ({ status }) => {
  const { t } = useLanguage();

  const statusTranslations = {
    active: t('products.status.active'),
    inactive: t('products.status.inactive'),
    draft: t('products.status.draft')
  };

  return <span>{statusTranslations[status]}</span>;
};
```

## Dynamic Content Translation

### Product Descriptions
```typescript
// Products can have translations stored in database
interface ProductTranslation {
  product_id: string;
  language: string;
  name: string;
  description: string;
  short_description: string;
}

// Usage in component
const ProductCard = ({ product }) => {
  const { language } = useLanguage();
  const [translation, setTranslation] = useState(null);

  useEffect(() => {
    // Fetch product translation for current language
    const fetchTranslation = async () => {
      const { data } = await supabase
        .from('product_translations')
        .select('*')
        .eq('product_id', product.id)
        .eq('language', language)
        .single();
      
      setTranslation(data);
    };

    fetchTranslation();
  }, [product.id, language]);

  const displayName = translation?.name || product.name;
  const displayDescription = translation?.description || product.description;

  return (
    <div>
      <h3>{displayName}</h3>
      <p>{displayDescription}</p>
    </div>
  );
};
```

## SEO and URL Localization

### Localized Routes
```typescript
// Route structure for different languages
const routes = {
  en: {
    home: '/',
    products: '/products',
    product: '/products/:slug',
    cart: '/cart',
    checkout: '/checkout'
  },
  es: {
    home: '/',
    products: '/productos',
    product: '/productos/:slug',
    cart: '/carrito',
    checkout: '/finalizar-compra'
  }
};

// Usage in router
const AppRouter = () => {
  const { language } = useLanguage();
  const currentRoutes = routes[language as keyof typeof routes];

  return (
    <Router>
      <Routes>
        <Route path={currentRoutes.home} element={<HomePage />} />
        <Route path={currentRoutes.products} element={<ProductsPage />} />
        <Route path={currentRoutes.product} element={<ProductPage />} />
        <Route path={currentRoutes.cart} element={<CartPage />} />
        <Route path={currentRoutes.checkout} element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
};
```

### Meta Tags Localization
```typescript
// Dynamic meta tags based on language
const useLocalizedMeta = (page: string) => {
  const { language, t } = useLanguage();

  useEffect(() => {
    const title = t(`${page}.meta.title`);
    const description = t(`${page}.meta.description`);

    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Set language attribute
    document.documentElement.lang = language;
  }, [language, page, t]);
};
```

## Performance Optimization

### Lazy Loading Translations
```typescript
// Load translations dynamically
const loadTranslations = async (language: string) => {
  try {
    const module = await import(`@/locales/${language}.json`);
    return module.default;
  } catch (error) {
    console.warn(`Failed to load translations for ${language}`);
    return null;
  }
};

// Usage in context
const LanguageProvider = ({ children }) => {
  const [translations, setTranslations] = useState({});
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const newTranslations = await loadTranslations(language);
      if (newTranslations) {
        setTranslations(newTranslations);
      }
    };

    loadLanguage();
  }, [language]);

  // ... rest of implementation
};
```

### Translation Caching
```typescript
// Cache translations in localStorage
const translationCache = {
  get: (language: string) => {
    try {
      const cached = localStorage.getItem(`translations-${language}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  },
  
  set: (language: string, translations: any) => {
    try {
      localStorage.setItem(`translations-${language}`, JSON.stringify(translations));
    } catch {
      // Handle storage quota exceeded
    }
  }
};
```

## Testing

### Translation Testing
```typescript
// Test translation completeness
describe('Translations', () => {
  const languages = ['en', 'es'];
  const baseKeys = Object.keys(translations.en);

  languages.forEach(language => {
    describe(`${language} translations`, () => {
      it('should have all required keys', () => {
        const languageKeys = Object.keys(translations[language as keyof typeof translations]);
        expect(languageKeys).toEqual(baseKeys);
      });

      it('should not have empty values', () => {
        const checkEmpty = (obj: any, path = '') => {
          Object.entries(obj).forEach(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'object' && value !== null) {
              checkEmpty(value, currentPath);
            } else if (typeof value === 'string' && value.trim() === '') {
              throw new Error(`Empty translation found at: ${currentPath}`);
            }
          });
        };

        expect(() => checkEmpty(translations[language as keyof typeof translations])).not.toThrow();
      });
    });
  });
});
```

## Migration Notes

1. **Backup**: Always backup existing translations
2. **Testing**: Test all language switches
3. **SEO**: Update meta tags for each language
4. **URLs**: Implement localized routing
5. **Database**: Add translation tables if needed
6. **Performance**: Implement lazy loading
7. **Fallbacks**: Handle missing translations gracefully
8. **Validation**: Ensure translation completeness
