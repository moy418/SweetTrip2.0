# SweetTrip E-commerce Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

1. **Copy environment template:**
   ```bash
   cp env.example .env
   ```

2. **Configure your environment variables in `.env`:**
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here

   # Email Configuration (EmailJS)
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

   # App Configuration
   VITE_APP_URL=http://localhost:3000
   VITE_APP_NAME=SweetTrip
   VITE_APP_DESCRIPTION=International Candy E-commerce Platform

   # Environment
   NODE_ENV=development
   ```

### 2. Database Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database setup script:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `scripts/setup-database.sql`
   - Run the script

3. **Migrate your products:**
   ```bash
   # Install dependencies for migration script
   npm install csv-parser dotenv

   # Run the migration script
   node scripts/migrate-products.js
   ```

### 3. Development Server

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### 4. Docker Deployment

1. **Build and run with Docker:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
sweettrip-clean/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   └── features/        # Feature-specific components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── stores/              # State management (Zustand)
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   ├── constants/           # Application constants
│   ├── config/              # Configuration
│   └── lib/                 # Third-party configs
├── public/                  # Static assets
├── scripts/                 # Database and migration scripts
├── docs/                    # Documentation
└── tests/                   # Test files
```

## 🔧 Configuration

### Supabase Setup

1. **Create a new project** at [supabase.com](https://supabase.com)
2. **Get your project URL and anon key** from Settings > API
3. **Add to your `.env` file**

### Stripe Setup

1. **Create a Stripe account** at [stripe.com](https://stripe.com)
2. **Get your publishable key** from Dashboard > Developers > API keys
3. **Add to your `.env` file**

### EmailJS Setup (Optional)

1. **Create an EmailJS account** at [emailjs.com](https://emailjs.com)
2. **Create an email service and template**
3. **Get your service ID, template ID, and public key**
4. **Add to your `.env` file**

## 🗄️ Database Schema

The application uses a simplified database schema with the following main tables:

- **categories** - Product categories
- **products** - Product information
- **users** - User profiles (extends Supabase auth)
- **cart_items** - Shopping cart items
- **orders** - Order information
- **order_items** - Individual order items
- **coupons** - Discount coupons
- **reviews** - Product reviews

## 🚀 Features

### ✅ Implemented
- **Modern UI** with Tailwind CSS and Radix UI
- **Product catalog** with search and filtering
- **Shopping cart** with persistent storage
- **User authentication** with Supabase Auth
- **Responsive design** for all devices
- **Internationalization** (English/Spanish)
- **TypeScript** for type safety
- **State management** with Zustand
- **Error handling** with error boundaries

### 🚧 Coming Soon
- **World Cup 2026** features
- **Payment processing** with Stripe
- **Order management** system
- **Email notifications**
- **Admin dashboard**
- **Product reviews**
- **Wishlist functionality**

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Docker
docker-compose up    # Start with Docker
docker-compose down  # Stop Docker containers
```

### Adding New Features

1. **Create components** in `src/components/`
2. **Add pages** in `src/pages/`
3. **Define types** in `src/types/`
4. **Add services** in `src/services/`
5. **Update stores** in `src/stores/`

## 🔒 Security

The application implements several security measures:

- **Environment variables** for sensitive data
- **Input validation** with Zod schemas
- **HTML sanitization** with DOMPurify
- **Row Level Security** (RLS) in Supabase
- **CSRF protection** with secure tokens
- **Secure authentication** with Supabase Auth

## 📱 Mobile Support

The application is fully responsive and works on:

- **Desktop** (Chrome, Firefox, Safari, Edge)
- **Tablet** (iPad, Android tablets)
- **Mobile** (iOS Safari, Android Chrome)

## 🌍 Internationalization

Currently supported languages:
- **English** (default)
- **Spanish** (Español)

To add more languages:
1. Update `src/contexts/LanguageContext.tsx`
2. Add translations to the `translations` object
3. Update `siteSettings.supportedLanguages`

## 🐛 Troubleshooting

### Common Issues

1. **Environment variables not loading:**
   - Ensure `.env` file exists in project root
   - Restart development server after changes

2. **Database connection errors:**
   - Verify Supabase URL and keys
   - Check if database setup script was run

3. **Build errors:**
   - Clear node_modules and reinstall
   - Check TypeScript errors with `npm run lint`

### Getting Help

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure database schema is properly set up
4. Check network connectivity for API calls

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy coding! 🍭**



