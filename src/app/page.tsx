'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dumbbell,
  Clock,
  DollarSign,
  BarChart2,
  Check,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const features = [
    {
      icon: Dumbbell,
      title: 'Member Management',
      items: [
        'Add/edit/delete members',
        'Assign membership types',
        'Track visits & payments'
      ]
    },
    {
      icon: Clock,
      title: 'Attendance Tracking',
      items: [
        'Check-in via form/QR code',
        'Log visit history',
        'Block expired memberships'
      ]
    },
    {
      icon: DollarSign,
      title: 'Payments',
      items: [
        'Record manual payments',
        'Auto-update membership status',
        'View payment history'
      ]
    },
    {
      icon: BarChart2,
      title: 'Reports',
      items: ['Member summaries', 'Revenue tracking', 'Attendance trends']
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/mo',
      description: 'Perfect for small gyms up to 50 members',
      features: [
        'Member Management',
        'Attendance Tracking',
        'Payment Processing',
        'Basic Reports',
        'Email Support'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: '$79',
      period: '/mo',
      description: 'Everything you need for unlimited growth',
      features: [
        'Everything in Starter',
        'Unlimited Members',
        'Point of Sale System',
        'Advanced Reports',
        'Priority Support',
        'Custom Branding'
      ],
      popular: true
    }
  ]

  const testimonials = [
    {
      quote:
        'GymFlow has transformed how we manage our members. The attendance tracking and payment processing features have saved us countless hours every week.',
      author: 'Sarah M.',
      role: 'Gym Owner'
    },
    {
      quote:
        "The POS system makes selling merchandise and supplements so easy. Our revenue has increased 30% since we started using GymFlow's integrated solution.",
      author: 'Mike T.',
      role: 'Fitness Manager'
    },
    {
      quote:
        'The free trial let us test everything before committing. The setup was incredibly simple and our team adapted to it within days.',
      author: 'Lisa R.',
      role: 'Studio Owner'
    }
  ]

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Dumbbell className="text-primary h-8 w-8" />
              <span className="text-2xl font-bold">GymOps</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-8 md:flex">
              <a
                href="#features"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Testimonials
              </a>
              <Button className="ml-4">Start Free Trial</Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="p-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="border-t py-4 md:hidden">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="hover:text-primary text-sm font-medium transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="hover:text-primary text-sm font-medium transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="hover:text-primary text-sm font-medium transition-colors"
                >
                  Testimonials
                </a>
                <Button className="w-full">Start Free Trial</Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="from-background to-muted/50 relative bg-gradient-to-b py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Streamline Your
              <span className="text-primary"> Gym Management</span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
              Manage members, track attendance, process payments, and grow your
              gym with our all-in-one solution designed for fitness business.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="px-8 py-6 text-lg">
                Try 14 Days Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                Watch Demo
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Key Features</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Everything you need to run your gym efficiently and profitably
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <feature.icon className="text-primary mx-auto mb-4 h-12 w-12" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm">
                        <Check className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Pricing Plans</h2>
            <p className="text-muted-foreground text-xl">
              Choose the perfect plan for your gym&apos;s needs
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? 'border-primary scale-105 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="pb-8 text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="mr-3 h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    Start 14-Day Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">What Our Users Say</h2>
            <p className="text-muted-foreground text-xl">
              Join hundreds of gyms already using GymFlow
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardContent className="pt-6">
                  <blockquote className="text-muted-foreground mb-4 italic">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="flex items-center">
                    <div className="bg-primary/10 mr-3 flex h-10 w-10 items-center justify-center rounded-full">
                      <span className="text-primary font-semibold">
                        {testimonial.author[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Simplify Your Gym Management?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            Join hundreds of gyms using GymFlow to streamline operations,
            increase revenue, and deliver better member experiences.
          </p>
          <Button variant="secondary" size="lg" className="px-8 py-6 text-lg">
            Start Your Free Trial Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm opacity-75">
            14-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2025 GymFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
