import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Users,
  CreditCard,
  BarChart3,
  Calendar,
  Settings,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react'
import { actionGetSession } from '@/modules/auth'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const session = await actionGetSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="text-2xl font-bold">GymOps</div>
            <div className="hidden items-center space-x-8 md:flex">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground"
              >
                Pricing
              </a>
              <Button variant="outline">Sign In</Button>
              <Button>Start Free Trial</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <Badge className="mb-4">#1 Gym Management System</Badge>
              <h1 className="mb-6 text-5xl leading-tight font-bold lg:text-6xl">
                Manage Your Gym with{' '}
                <span className="text-primary">Complete Ease</span>
              </h1>
              <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
                Streamline operations, boost member satisfaction, and grow your
                fitness business with our all-in-one gym management platform.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" className="px-8 py-6 text-lg">
                  Start Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg"
                >
                  Watch Demo
                </Button>
              </div>
              <div className="text-muted-foreground mt-8 flex items-center justify-center text-sm lg:justify-start">
                <CheckCircle className="text-primary mr-2 h-4 w-4" />
                14-day free trial • No credit card required
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative">
              <Card className="shadow-lg">
                <CardHeader className="flex items-center justify-between">
                  <h3 className="font-semibold">Dashboard Overview</h3>
                  <Badge variant="secondary">Live</Badge>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-2xl font-bold">432</div>
                      <div className="text-muted-foreground text-sm">
                        Active Members
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-2xl font-bold">$12.5k</div>
                      <div className="text-muted-foreground text-sm">
                        Monthly Revenue
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted flex h-20 items-center justify-center rounded-lg">
                    <BarChart3 className="text-primary h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              Everything You Need to Run Your Gym
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              Powerful features designed to streamline your gym operations and
              enhance member experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: 'Membership Management',
                description:
                  'Effortlessly manage member profiles, subscriptions, and renewals with automated workflows.',
              },
              {
                icon: CreditCard,
                title: 'Point of Sales',
                description:
                  'Integrated POS system for merchandise, supplements, and service sales with inventory tracking.',
              },
              {
                icon: Calendar,
                title: 'Attendance Tracking',
                description:
                  'Real-time check-ins, class bookings, and member activity monitoring with detailed analytics.',
              },
              {
                icon: BarChart3,
                title: 'Payments & Billing',
                description:
                  'Automated billing, payment processing, and financial reporting with multiple payment options.',
              },
              {
                icon: Settings,
                title: 'Admin Dashboard',
                description:
                  'Comprehensive control panel with insights, reports, and management tools in one place.',
              },
              {
                icon: Star,
                title: 'Member Experience',
                description:
                  'Mobile app for members, class scheduling, and personalized fitness tracking features.',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group shadow-lg transition-all hover:shadow-xl"
              >
                <CardHeader>
                  <div className="bg-primary text-primary-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-xl">
              Choose the perfect plan for your gym&apos;s needs
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              {
                name: 'Free Trial',
                price: '₱0',
                period: '14 days',
                description: 'Perfect for trying out GymOps',
                features: [
                  'Up to 30 members',
                  'Up to 2 memberships only',
                  'Full member management',
                  'Full membership management',
                  'Member attendance session tracking',
                ],
                cta: 'Start Free Trial',
                popular: false,
              },
              {
                name: 'Standard',
                price: '₱150',
                period: 'per month',
                description: 'Ideal for small to medium gyms',
                features: [
                  'Included features of Free Trial',
                  'Dashboard analytics',
                  'POS system included',
                  'Track membership payments',
                  'Up to 150 members can be created',
                  'Up to 8 memberships can be created',
                ],
                cta: 'Get Started',
                popular: true,
              },
              {
                name: 'Premium',
                price: '₱350',
                period: 'per month',
                description: 'Best for large gyms',
                features: [
                  'Included features of Standard',
                  'Unlimited members',
                  'Unlimited memberships',
                  'More advanced dashboard analytics',
                ],
                cta: 'Get Started',
                popular: false,
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? 'border-primary border-2 shadow-xl'
                    : 'shadow-lg'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="text-primary mr-3 h-5 w-5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Transform Your Gym Management?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-xl leading-relaxed">
            Join thousands of gym owners who&apos;ve streamlined their
            operations with GymOps. Start your free trial today and see the
            difference.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-6 text-lg font-semibold"
            >
              Start Your Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground px-8 py-6 text-lg"
            >
              Schedule a Demo
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center text-sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            No setup fees • 24/7 support
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 text-2xl font-bold">GymOps</div>
              <p className="leading-relaxed">
                The complete gym management solution for modern fitness
                businesses.
              </p>
              <div className="mt-6 flex space-x-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                  <div
                    key={index}
                    className="bg-background hover:bg-accent flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Training
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
            <p className="text-sm">© 2025 GymOps. All rights reserved.</p>
            <p className="mt-4 text-sm md:mt-0">
              Made with ❤️ for gym owners in the Philippines
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
