'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { User, Calendar, DollarSign, ArrowRight, Heart, Shield, Clock } from 'lucide-react'
import Header from '@/components/Header'

export default function Home() {
  useEffect(() => {
    // Animate landing page elements
    gsap.fromTo('.hero-element', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out" }
    )
    
    gsap.fromTo('.feature-card', 
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "power2.out" }
    )
  }, [])

  const features = [
    {
      icon: User,
      title: 'Patient Management',
      description: 'Comprehensive patient profiles with session notes, mood tracking, and progress monitoring.',
      href: '/dashboard',
      color: 'var(--accent-green)'
    },
    {
      icon: Calendar,
      title: 'Scheduling',
      description: 'Seamless appointment scheduling with automated reminders and session preparation.',
      href: '/schedule',
      color: 'var(--accent-gold)'
    },
    {
      icon: DollarSign,
      title: 'Financial Tracking',
      description: 'Complete financial overview with payment tracking and revenue analytics.',
      href: '/financial',
      color: 'var(--accent-red)'
    }
  ]

  const benefits = [
    {
      icon: Heart,
      title: 'Patient-Centered Care',
      description: 'Focus on what matters most - your patients and their well-being.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'HIPAA-compliant platform ensuring patient data security and privacy.'
    },
    {
      icon: Clock,
      title: 'Time Efficient',
      description: 'Streamlined workflows that save time and reduce administrative burden.'
    }
  ]

  return (
    <div className="min-h-screen w-full bg-[#1c2522] text-[#e0e8e5]">
      <Header />
      
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 px-8 text-center overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#d4af7a]"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-[#7a9e91]"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-[#d98c8c]"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="hero-element text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 font-bold text-[#f0f5f3] leading-tight">
              Therapist<br />
              <span className="text-[#d4af7a]">Sanctuary</span>
            </h1>
            
            <p className="hero-element text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-[#92a19c]">
              A comprehensive practice management platform designed for mental health professionals. 
              Streamline your workflow, enhance patient care, and focus on what you do best.
            </p>
            
            <div className="hero-element flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="action-button inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 bg-[#d4af7a] text-[#1c2522] hover:shadow-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/schedule"
                className="action-button inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg border border-[#3f4f4a] text-[#e0e8e5] transition-all duration-200 hover:border-[#d4af7a]"
              >
                View Schedule
                <Calendar className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center mb-4 text-[#f0f5f3] font-serif">
              Everything You Need
            </h2>
            <p className="text-lg sm:text-xl text-center mb-16 max-w-2xl mx-auto text-[#92a19c]">
              Comprehensive tools designed specifically for mental health professionals
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Link key={index} href={feature.href} className="feature-card group">
                  <div className="detail-card p-8 h-full transition-all duration-300 group-hover:scale-105 bg-[#2a3834] border border-[#3f4f4a] rounded-xl hover:border-[#d4af7a]">
                    <feature.icon 
                      className="w-12 h-12 mb-6" 
                      style={{ color: feature.color }}
                    />
                    <h3 className="text-2xl mb-4 text-[#f0f5f3] font-serif">
                      {feature.title}
                    </h3>
                    <p className="text-lg leading-relaxed mb-6 text-[#92a19c]">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: feature.color }}>
                      Learn More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-8 bg-[#2a3834]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-center mb-16 text-[#f0f5f3] font-serif">
              Why Choose Sanctuary?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="feature-card text-center">
                  <benefit.icon 
                    className="w-16 h-16 mx-auto mb-6 text-[#d4af7a]"
                  />
                  <h3 className="text-2xl mb-4 text-[#f0f5f3] font-serif">
                    {benefit.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-[#92a19c]">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 text-[#f0f5f3] font-serif">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-lg sm:text-xl mb-8 text-[#92a19c]">
              Join thousands of mental health professionals who trust Sanctuary to manage their practice.
            </p>
            
            <Link
              href="/dashboard"
              className="action-button inline-flex items-center gap-2 px-12 py-6 rounded-lg font-semibold text-xl transition-all duration-200 bg-[#d4af7a] text-[#1c2522] hover:shadow-lg"
            >
              Start Your Journey
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
