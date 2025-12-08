'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Users, MessageSquare } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
// cn was unused

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
            Accadex
          </div>
          <div className="flex items-center gap-6">
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
        </div>
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
              Next Gen Sports Analytics
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent"
            >
              Elevate Your Game <br />
              <span className="text-emerald-500">With AI Insights</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8"
            >
              Accadex provides academy players with professional-grade match analysis,
              performance tracking, and AI-powered coaching feedback.
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
              title="Performance Analytics"
              description="Deep dive into your match stats with visual graphs and trend analysis over time."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-cyan-400" />}
              title="Academy Integration"
              description="Connect with your academy, coaches, and teammates for seamless feedback loops."
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6 text-violet-400" />}
              title="AI Coach Assistant"
              description="Upload clips or ask questions to get instant, AI-driven tactical advice."
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
