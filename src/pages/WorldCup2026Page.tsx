import * as React from 'react'
import { Trophy, Globe, Users, Target, BookOpen, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useLanguage } from '../contexts/LanguageContext'

const WorldCup2026Page: React.FC = () => {
  const { t } = useLanguage()

  const features = [
    {
      icon: Target,
      title: t('worldcup.predictions'),
      description: 'Predict match outcomes and earn points for correct predictions',
      status: 'coming_soon',
    },
    {
      icon: Globe,
      title: t('worldcup.countries'),
      description: 'Explore products from all 48 participating countries',
      status: 'coming_soon',
    },
    {
      icon: Trophy,
      title: t('worldcup.achievements'),
      description: 'Unlock badges and achievements as you collect and predict',
      status: 'coming_soon',
    },
    {
      icon: BookOpen,
      title: t('worldcup.stories'),
      description: 'Learn about cultural stories and traditions from each country',
      status: 'coming_soon',
    },
    {
      icon: BarChart3,
      title: t('worldcup.stats'),
      description: 'Track your progress with live statistics and rankings',
      status: 'coming_soon',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with other fans and share your collections',
      status: 'coming_soon',
    },
  ]

  const stats = [
    { label: 'Countries', value: '48' },
    { label: 'Matches', value: '104+' },
    { label: 'Products', value: '300+' },
    { label: 'Fans', value: '1,000+' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="mb-6">
              <Trophy className="h-20 w-20 mx-auto text-yellow-300 animate-bounce-slow" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              FIFA World Cup 2026
            </h1>
            <Badge variant="warning" className="mb-6 text-lg px-4 py-2">
              {t('worldcup.comingSoon')}
            </Badge>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              {t('worldcup.description')}
            </p>
            <p className="text-lg opacity-75">
              Launch Date: June 2026
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              World Cup 2026 by the Numbers
            </h2>
            <p className="text-lg text-gray-600">
              Get ready for the biggest football event with exclusive features
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('worldcup.features')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Exciting features coming soon for the World Cup 2026 experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      {feature.status === 'coming_soon' && (
                        <Badge variant="info" className="mt-1">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
                
                {/* Coming Soon Overlay */}
                {feature.status === 'coming_soon' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🚧</div>
                      <div className="text-sm font-medium text-gray-600 bg-white/80 px-3 py-1 rounded-full">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Development Timeline
            </h2>
            <p className="text-lg text-gray-600">
              Here's what we're working on for the World Cup 2026 experience
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                phase: 'Phase 1',
                title: 'Foundation & Core Features',
                description: 'Setting up the infrastructure and basic functionality',
                status: 'in_progress',
                date: 'Q1 2025',
              },
              {
                phase: 'Phase 2',
                title: 'Country Collections',
                description: 'Building the 48-country product collections and cultural content',
                status: 'planned',
                date: 'Q2 2025',
              },
              {
                phase: 'Phase 3',
                title: 'Prediction System',
                description: 'Developing the match prediction and scoring system',
                status: 'planned',
                date: 'Q3 2025',
              },
              {
                phase: 'Phase 4',
                title: 'Gamification & Community',
                description: 'Adding achievements, badges, and social features',
                status: 'planned',
                date: 'Q4 2025',
              },
              {
                phase: 'Phase 5',
                title: 'Launch & Optimization',
                description: 'Final testing, optimization, and official launch',
                status: 'planned',
                date: 'Q1 2026',
              },
            ].map((item, index) => (
              <Card key={index} className={`${item.status === 'in_progress' ? 'ring-2 ring-purple-500' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      item.status === 'in_progress' 
                        ? 'bg-purple-500' 
                        : item.status === 'planned' 
                        ? 'bg-gray-300' 
                        : 'bg-green-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <Badge 
                          variant={
                            item.status === 'in_progress' 
                              ? 'warning' 
                              : item.status === 'planned' 
                              ? 'secondary' 
                              : 'success'
                          }
                        >
                          {item.status === 'in_progress' ? 'In Progress' : 
                           item.status === 'planned' ? 'Planned' : 'Completed'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Be the First to Know
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get notified when World Cup 2026 features launch and receive exclusive early access
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Notify Me
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WorldCup2026Page

