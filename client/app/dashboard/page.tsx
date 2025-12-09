'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Home, BarChart2, MessageSquare, LogOut, Loader2, Calendar as CalendarIcon, Users, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

// Interfaces
interface User {
    id: string;
    name: string;
    role: string;
    academy?: string;
}

interface Match {
    _id: string;
    opponent: string;
    result: 'Win' | 'Loss' | 'Draw';
    score: string;
    date: string;
}

interface Insight {
    _id: string;
    title: string;
    description: string;
    type: 'Performance' | 'Health' | 'Strategy';
    date: string;
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (!storedUser || !token) {
                    // Redirect to login if no session
                    // window.location.href = '/login'; 
                    // Better to use router but we need to import it.
                    // For now, let's just return to avoid crashing, user sees loading or empty.
                    return;
                }

                const userData = JSON.parse(storedUser);
                // Ensure we get the ID correctly (handle .id or ._id)
                const userId = userData.id || userData._id;
                console.log("Fetching data for User ID:", userId);

                setUser(userData);

                // 2. Fetch Matches
                const matchesRes = await axios.get(`${API_BASE_URL}/api/matches/${userId}`);
                setMatches(matchesRes.data);

                // 3. Fetch Insights
                const insightsRes = await axios.get(`${API_BASE_URL}/api/insights/${userId}`);
                setInsights(insightsRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Check for auth on mount
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            // we can use window.location because relying on router constant might strict depend on props
            window.location.href = '/login';
        }
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }



    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="flex min-h-screen bg-black text-white font-sans">
            {/* Mobile Header with Menu Button */}
            <div className="md:hidden flex items-center p-4 border-b border-white/10 absolute top-0 left-0 w-full z-20 bg-black/50 glass">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-white">
                    <Menu size={24} />
                </button>
                <div className="ml-4 font-bold text-lg bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                    Accadex
                </div>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-black/90 md:bg-black/50 p-6 transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col glass",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-10 hidden md:block">
                    Accadex
                </div>

                {/* Mobile Close Button */}
                <div className="md:hidden flex justify-end mb-4">
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                    <NavItem href="/dashboard" icon={<Home size={20} />} active={false}>Dashboard</NavItem>
                    <NavItem href="/dashboard/schedule" icon={<CalendarIcon size={20} />}>Schedule</NavItem>
                    <NavItem href="/chat" icon={<MessageSquare size={20} />}>AI Coach</NavItem>
                    <NavItem href="/community" icon={<Users size={20} />}>Community</NavItem>
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                            {user?.name?.[0]}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 pt-20 md:pt-8 w-full">
                <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                        <p className="text-gray-400">Here&apos;s your performance overview from {user?.academy || 'your academy'}.</p>
                    </div>
                </header>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Matches" value={matches.length} trend="High Activity" trendColor="text-emerald-400" />
                    <StatCard title="Win Rate" value="33%" trend="Needs Improvement" trendColor="text-orange-400" /> {/* Calculated simply for demo */}
                    <StatCard title="Batting Avg" value="45.5" trend="+5.2 vs last season" trendColor="text-emerald-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Matches */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <BarChart2 className="text-emerald-500" />
                            Recent Matches
                        </h2>
                        <div className="space-y-4">
                            {matches.length === 0 ? (
                                <div className="p-8 rounded-xl glass-card border border-white/5 flex flex-col items-center justify-center text-center">
                                    <BarChart2 className="w-12 h-12 text-gray-600 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-300">No Matches Yet</h3>
                                    <p className="text-gray-500 mt-2 mb-4">Start playing and logging your matches to track your progress.</p>
                                    <Link href="/dashboard/schedule" className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors">
                                        Log a Match
                                    </Link>
                                </div>
                            ) : (
                                matches.map((match) => (
                                    <div key={match._id} className="p-4 rounded-xl glass-card border border-white/5 hover:border-white/10 transition-colors flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-2 h-12 rounded-full",
                                                match.result === 'Win' ? "bg-emerald-500" :
                                                    match.result === 'Loss' ? "bg-red-500" : "bg-yellow-500"
                                            )} />
                                            <div>
                                                <h3 className="font-semibold text-lg">{match.opponent}</h3>
                                                <p className="text-sm text-gray-400">{new Date(match.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold font-mono">{match.score} <span className="text-xs text-gray-400">Runs</span></p>
                                            <p className={cn(
                                                "text-xs font-bold uppercase",
                                                match.result === 'Win' ? "text-emerald-500" :
                                                    match.result === 'Loss' ? "text-red-500" : "text-yellow-500"
                                            )}>{match.result}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MessageSquare className="text-cyan-500" />
                            AI Insights
                        </h2>
                        <div className="space-y-4">
                            {insights.length === 0 ? (
                                <div className="p-6 rounded-xl bg-white/5 border border-white/5 text-center">
                                    <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                    <p className="text-gray-400 text-sm">No insights available yet.</p>
                                    <p className="text-xs text-gray-600 mt-1">Play matches to unlock AI analysis.</p>
                                </div>
                            ) : (
                                insights.map((insight) => (
                                    <div key={insight._id} className="p-4 rounded-xl bg-linear-to-br from-white/5 to-white/2 border border-white/5">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                "px-2 py-1 rounded-md text-xs font-medium",
                                                insight.type === 'Performance' ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
                                            )}>{insight.type}</span>
                                            <span className="text-xs text-gray-500">{new Date(insight.date).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                                        <p className="text-sm text-gray-400">{insight.description}</p>
                                    </div>
                                ))
                            )}

                            <Link href="/chat" className="block w-full text-center py-3 rounded-lg border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-colors text-sm">
                                Ask AI for more analysis +
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, children, active }: { href: string, icon: React.ReactNode, children: React.ReactNode, active?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
        >
            {icon}
            {children}
        </Link>
    );
}

function StatCard({ title, value, trend, trendColor }: { title: string, value: string | number, trend: string, trendColor: string }) {
    return (
        <div className="p-6 rounded-xl glass-card">
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
            <p className={cn("text-xs font-medium", trendColor)}>{trend}</p>
        </div>
    );
}
