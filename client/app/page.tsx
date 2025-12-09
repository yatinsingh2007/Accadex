'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, Users, MessageSquare, Menu, X } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
// cn was unused

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            Accadex
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium border border-emerald-500/20 px-3 py-1.5 rounded-full hover:bg-emerald-500/10"
            >
              Sign Up
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors text-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-black/95 glass overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4">
                <Link href="/login" className="text-lg text-gray-400 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" className="text-lg text-emerald-400 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </Link>
                <Link href="/dashboard" className="text-lg text-white font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <BackgroundBeams className="z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm mb-8 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              The Ultimate Sports Ecosystem
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent"
            >
              Track, Connect, & <br />
              <span className="text-emerald-500">Evolve Your Game</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8"
            >
              Your all-in-one platform to track match performance, connect with elite coaches & specialists,
              and get personalized AI guidance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/dashboard"
                className="group px-8 py-3 rounded-full bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all flex items-center gap-2"
              >
                Try Demo Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/chat"
                className="px-8 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-medium"
              >
                Try AI Chat
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Activity className="w-6 h-6 text-emerald-400" />}
              title="Track Performance"
              description="Monitor your match history, analyze trends, and visualize your growth as an athlete."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-cyan-400" />}
              title="Connect with Pros"
              description="Get direct access to top-tier coaches, nutritionists, and sports physicians."
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-violet-400" />}
              title="AI Guidance"
              description="Your personal 24/7 assistant for tactical advice and instant feedback."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl glass-card hover:border-emerald-500/30 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
