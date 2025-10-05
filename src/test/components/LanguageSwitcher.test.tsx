import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LanguageSwitcher from '../../components/ui/LanguageSwitcher'
import { LanguageProvider } from '../../contexts/LanguageContext'

// Mock the useLanguage hook
vi.mock('../../contexts/LanguageContext', async () => {
  const actual = await vi.importActual('../../contexts/LanguageContext')
  return {
    ...actual,
    useLanguage: () => ({
      currentLanguage: 'en',
      setLanguage: vi.fn(),
      languages: [
        { code: 'en', name: 'English', flag: '🇺🇸', is_active: true },
        { code: 'es', name: 'Español', flag: '🇪🇸', is_active: true },
        { code: 'fr', name: 'Français', flag: '🇫🇷', is_active: true },
      ],
    }),
  }
})

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  )
}

describe('LanguageSwitcher Component', () => {
  it('renders language switcher button', () => {
    renderWithProvider(<LanguageSwitcher />)
    
    const button = screen.getByRole('button', { name: /select language/i })
    expect(button).toBeInTheDocument()
  })

  it('displays current language flag and name', () => {
    renderWithProvider(<LanguageSwitcher />)
    
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', async () => {
    renderWithProvider(<LanguageSwitcher />)
    
    const button = screen.getByRole('button', { name: /select language/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Español')).toBeInTheDocument()
      expect(screen.getByText('Français')).toBeInTheDocument()
    })
  })

  it('closes dropdown when clicking outside', async () => {
    renderWithProvider(<LanguageSwitcher />)
    
    const button = screen.getByRole('button', { name: /select language/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Español')).toBeInTheDocument()
    })
    
    // Click outside (backdrop)
    const backdrop = document.querySelector('.fixed.inset-0')
    if (backdrop) {
      fireEvent.click(backdrop)
    }
    
    await waitFor(() => {
      expect(screen.queryByText('Español')).not.toBeInTheDocument()
    })
  })

  it('shows current language as selected', async () => {
    renderWithProvider(<LanguageSwitcher />)
    
    const button = screen.getByRole('button', { name: /select language/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      const currentLanguageButton = screen.getByText('English').closest('button')
      expect(currentLanguageButton).toHaveClass('bg-purple-50', 'text-purple-600')
    })
  })

  it('displays all available languages', async () => {
    renderWithProvider(<LanguageSwitcher />)
    
    const button = screen.getByRole('button', { name: /select language/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
      expect(screen.getByText('🇪🇸')).toBeInTheDocument()
      expect(screen.getByText('🇫🇷')).toBeInTheDocument()
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Español')).toBeInTheDocument()
      expect(screen.getByText('Français')).toBeInTheDocument()
    })
  })

  it('has proper accessibility attributes', () => {
    renderWithProvider(<LanguageSwitcher />)
    
    const button = screen.getByRole('button', { name: /select language/i })
    expect(button).toHaveAttribute('aria-label', 'Select language')
  })
})
