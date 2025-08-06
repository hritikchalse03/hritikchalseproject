'use client'

import { useState } from 'react'
import { PlayIcon, MagnifyingGlassIcon, ChartBarIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const features = [
    {
      icon: SpeakerWaveIcon,
      title: 'Live Earnings Calls',
      description: 'Stream live audio with real-time transcription from 13,000+ public companies',
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Powerful Search',
      description: 'Search across all transcripts and documents simultaneously with AI-powered insights',
    },
    {
      icon: ChartBarIcon,
      title: 'Market Analysis',
      description: 'Get instant highlights, trends, and key financial metrics from earnings calls',
    },
  ]

  const liveEvents = [
    { company: 'Apple Inc.', symbol: 'AAPL', time: '4:30 PM EST', status: 'live' },
    { company: 'Microsoft Corp.', symbol: 'MSFT', time: '5:00 PM EST', status: 'upcoming' },
    { company: 'Tesla Inc.', symbol: 'TSLA', time: '6:00 PM EST', status: 'upcoming' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Finance<span className="text-blue-600">Stream</span>
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Dashboard</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Companies</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Live Events</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Search</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Be the first to know.
            <br />
            <span className="text-blue-600">Act with conviction.</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access live audio with real-time transcripts for all events from 13,000+ public companies. 
            Earnings calls, capital markets days, M&A announcements, and more.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies, transcripts, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Search
              </button>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Live Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Live & Upcoming Events</h3>
            <p className="text-lg text-gray-600">Join live earnings calls with real-time transcription</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {liveEvents.map((event, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === 'live' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.status === 'live' ? '🔴 LIVE' : '⏰ Upcoming'}
                  </span>
                  <span className="text-sm text-gray-500">{event.time}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.company}</h4>
                <p className="text-gray-600 mb-4">{event.symbol}</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <PlayIcon className="h-4 w-4 mr-2" />
                  {event.status === 'live' ? 'Join Live' : 'Set Reminder'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h3>
            <p className="text-lg text-gray-600">Everything you need for financial research</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to get started?</h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of investors who rely on FinanceStream for real-time market insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">FinanceStream</h4>
              <p className="text-gray-400">
                The leading platform for live earnings calls and financial research.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Live Calls</a></li>
                <li><a href="#" className="hover:text-white">Transcripts</a></li>
                <li><a href="#" className="hover:text-white">Search</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FinanceStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}