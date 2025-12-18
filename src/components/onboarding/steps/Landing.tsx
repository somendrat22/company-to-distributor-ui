'use client'

import React from 'react'
import { ArrowRight, Building2, Users, TrendingUp, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface LandingProps {
  onGetStarted: () => void
}

export function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Digitize Your Distribution Network
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Onboard your company and manage distributors seamlessly on India's leading B2B FMCG platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="text-lg px-8"
          >
            Register Your Company
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8"
          >
            Already Registered? Login
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Onboarding</h3>
            <p className="text-sm text-gray-600">
              Quick 5-minute registration process
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Manage Network</h3>
            <p className="text-sm text-gray-600">
              Control your entire distributor network
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Growth</h3>
            <p className="text-sm text-gray-600">
              Real-time analytics and insights
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Platform</h3>
            <p className="text-sm text-gray-600">
              Enterprise-grade security & compliance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="bg-gradient-to-br from-gray-50 to-blue-50">
        <CardContent className="pt-8 pb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-sm text-gray-600">
                Complete the onboarding form with your company details and documents
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verification</h3>
              <p className="text-sm text-gray-600">
                Our team verifies your information within 24-48 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Started</h3>
              <p className="text-sm text-gray-600">
                Access your dashboard and start managing your distribution network
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trusted By */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 mb-4">Trusted by leading FMCG brands</p>
        <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
          <div className="text-2xl font-bold text-gray-400">Parle-G</div>
          <div className="text-2xl font-bold text-gray-400">Britannia</div>
          <div className="text-2xl font-bold text-gray-400">ITC</div>
          <div className="text-2xl font-bold text-gray-400">Dabur</div>
        </div>
      </div>
    </div>
  )
}
