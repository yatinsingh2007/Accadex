'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Calendar as CalendarIcon, Clock, Home, BarChart2, MessageSquare, LogOut } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Schedule {
    _id: string;
    date: string;
    opponent: string;
    type: string;
    status: string;
}

interface Match {
    _id: string;
    opponent: string;
    result: 'Win' | 'Loss' | 'Draw';
    score: string;
    date: string;
}

export default function SchedulePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [history, setHistory] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [opponent, setOpponent] = useState('');
    const [matchType, setMatchType] = useState('Friendly');
    const [submitting, setSubmitting] = useState(false);

    // User state for sidebar
    const [user, setUser] = useState<{ name: string, role: string, academy?: string } | null>(null);

    // Completion State
    const [completingId, setCompletingId] = useState<string | null>(null);
    const [resultScore, setResultScore] = useState('');
    const [resultOutcome, setResultOutcome] = useState('Win');

    // Mock User ID - in real app get from context/token
    // Use the demo user ID or fetch from /auth/me
    // For now we will fetch Schedules for the user after we login. 
    // Since we can't easily get the ID without context, we'll try to get it from local storage if we stored user there, 
    // or just fetch from an endpoint that uses the token. But our backend expects :userId param.
    // Let's assume we can decode token or just use a known demo ID for this prototype if token decoding is too complex.
    // Actually, `dashboard/page.tsx` fetched user data. We should probably use a Context, but for now let's just re-fetch user.

    // STARTUP: Fetch user then schedules AND history
    useEffect(() => {
        const fetchData = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!storedUser || !token) {
                window.location.href = '/login';
                return;
            }

            try {
                const userData = JSON.parse(storedUser);
                setUser(userData); // Set user for sidebar
                const userId = userData.id || userData._id;

                // Fetch schedules
                const schedRes = await axios.get(`http://localhost:5001/api/schedule/${userId}`);
                setSchedules(schedRes.data);

                // Fetch history
                const matchRes = await axios.get(`http://localhost:5001/api/matches/${userId}`);
                setHistory(matchRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchAllData = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const userData = JSON.parse(storedUser);
        const userId = userData.id || userData._id;

        const schedRes = await axios.get(`http://localhost:5001/api/schedule/${userId}`);
        setSchedules(schedRes.data);
        const matchRes = await axios.get(`http://localhost:5001/api/matches/${userId}`);
        setHistory(matchRes.data);
    };

    const handleScheduleMatch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        if (!date) return;

        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;
            const userData = JSON.parse(storedUser);
            const userId = userData.id || userData._id;

            await axios.post('http://localhost:5001/api/schedule', {
                player: userId,
                date: date,
                opponent,
                type: matchType
            });

            await fetchAllData();
            setOpponent('');
            setSubmitting(false);
        } catch (error) {
            console.error("Error creating schedule", error);
            setSubmitting(false);
        }
    };

    const handleCompleteMatch = async () => {
        if (!completingId) return;
        setSubmitting(true);

        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;
            const userData = JSON.parse(storedUser);
            const userId = userData.id || userData._id;

            // Find the schedule item
            const item = schedules.find(s => s._id === completingId);
            if (!item) return;

            // 1. Create Match Record
            await axios.post('http://localhost:5001/api/matches', {
                player: userId,
                opponent: item.opponent,
                date: item.date,
                result: resultOutcome,
                score: resultScore,
                stats: { points: 0, assists: 0, minutesPlayed: 90 } // Default stats or let user enter
            });

            // 2. Delete Schedule Record
            await axios.delete(`http://localhost:5001/api/schedule/${completingId}`);

            // 3. Refresh
            await fetchAllData();

            setCompletingId(null);
            setResultScore('');
            setSubmitting(false);
        } catch (error) {
            console.error("Error completing match", error);
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="flex min-h-screen bg-black text-white font-sans">
            {/* Sidebar (Duplicated for Prototype) */}
            <aside className="w-64 border-r border-white/10 bg-black/50 hidden md:flex flex-col p-6 fixed h-full glass z-10">
                <div className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-10">
                    Accadex
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem href="/dashboard" icon={<Home size={20} />} active={false}>Dashboard</NavItem>
                    <NavItem href="/dashboard/schedule" icon={<BarChart2 size={20} />} active={true}>Matches</NavItem>
                    <NavItem href="/dashboard/schedule" icon={<CalendarIcon size={20} />}>Schedule</NavItem>
                    <NavItem href="/chat" icon={<MessageSquare size={20} />}>AI Coach</NavItem>
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
            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Match Center</h1>
                        <p className="text-gray-400">Manage your fixtures and match history.</p>
                    </div>
                </header>

                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="bg-zinc-900 border-zinc-800">
                        <TabsTrigger value="upcoming" className="data-[state=active]:bg-emerald-600">Upcoming Fixtures</TabsTrigger>
                        <TabsTrigger value="history" className="data-[state=active]:bg-emerald-600">Match History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="mt-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Form */}
                            <div className="md:col-span-1">
                                <Card className="bg-zinc-900 border-zinc-800 text-white h-fit sticky top-6">
                                    <CardHeader>
                                        <CardTitle>Schedule New Match</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleScheduleMatch} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal bg-black/50 border-zinc-700 hover:bg-zinc-800 hover:text-white", !date && "text-muted-foreground")}>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
                                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="text-white" />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Opponent</Label>
                                                <Input placeholder="Vs. Team" value={opponent} onChange={(e) => setOpponent(e.target.value)} className="bg-black/50 border-zinc-700" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Type</Label>
                                                <Select onValueChange={setMatchType} defaultValue="Friendly">
                                                    <SelectTrigger className="bg-black/50 border-zinc-700">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                        <SelectItem value="Friendly">Friendly</SelectItem>
                                                        <SelectItem value="League">League</SelectItem>
                                                        <SelectItem value="Tournament">Tournament</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
                                                {submitting ? <Loader2 className="animate-spin mr-2" /> : "Schedule"}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Schedule List */}
                            <div className="md:col-span-2 space-y-4">
                                {loading ? <Loader2 className="animate-spin text-emerald-500 mx-auto" /> : schedules.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500 bg-white/5 rounded-xl border border-white/5">
                                        <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>No upcoming matches scheduled.</p>
                                    </div>
                                ) : (
                                    schedules.map((schedule) => (
                                        <div key={schedule._id} className="group p-5 rounded-xl border border-white/5 bg-white/5 flex flex-col sm:flex-row justify-between items-center hover:bg-white/10 transition-all gap-4">
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold shrink-0">
                                                    {schedule.opponent[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-white">{schedule.opponent}</h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                                        <span className="flex items-center gap-1"><CalendarIcon size={14} /> {format(new Date(schedule.date), "PPP")}</span>
                                                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{schedule.type}</span>
                                                    </div>
                                                </div >
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 w-full sm:w-auto"
                                                            onClick={() => setCompletingId(schedule._id)}
                                                        >
                                                            Mark Complete
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                                        <DialogHeader>
                                                            <DialogTitle>Match Result</DialogTitle>
                                                            <DialogDescription>Enter the final score for vs {schedule.opponent}</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label>Score (You - Opponent)</Label>
                                                                <Input placeholder="e.g. 2-1" value={resultScore} onChange={(e) => setResultScore(e.target.value)} className="bg-black/50 border-zinc-700" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Outcome</Label>
                                                                <Select onValueChange={setResultOutcome} defaultValue="Win">
                                                                    <SelectTrigger className="bg-black/50 border-zinc-700">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                                                        <SelectItem value="Win">Win</SelectItem>
                                                                        <SelectItem value="Loss">Loss</SelectItem>
                                                                        <SelectItem value="Draw">Draw</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button onClick={handleCompleteMatch} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                                                {submitting ? <Loader2 className="animate-spin mr-2" /> : "Save Result"}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="mt-6">
                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <p className="text-gray-500">No match history found.</p>
                            ) : (
                                history.map((match) => (
                                    <div key={match._id} className="p-5 rounded-xl border border-white/5 bg-white/5 flex flex-col sm:flex-row justify-between items-center hover:bg-white/10 transition-colors gap-4">
                                        <div className="flex items-center gap-4 w-full">
                                            <div className={cn(
                                                "w-2 h-12 rounded-full shrink-0",
                                                match.result === 'Win' ? "bg-emerald-500" :
                                                    match.result === 'Loss' ? "bg-red-500" : "bg-yellow-500"
                                            )} />
                                            <div>
                                                <h3 className="font-bold text-lg text-white">{match.opponent}</h3>
                                                <p className="text-sm text-gray-400">{format(new Date(match.date), "PPP")}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold font-mono text-white">{match.score}</p>
                                            <p className={cn(
                                                "text-sm font-bold uppercase tracking-wider",
                                                match.result === 'Win' ? "text-emerald-500" :
                                                    match.result === 'Loss' ? "text-red-500" : "text-yellow-500"
                                            )}>{match.result}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
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
