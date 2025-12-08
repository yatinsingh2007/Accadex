'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, Video, ChevronLeft, User as UserIcon, Loader2, Stethoscope, Dumbbell, Apple, Phone, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

interface Message {
    id: number;
    sender: 'bot' | 'user';
    text: string;
    isVideo?: boolean;
}

type RoleId = 'physician' | 'head_coach' | 'nutritionist';

interface Contact {
    id: RoleId;
    name: string;
    role: string;
    icon: React.ReactNode;
    color: string;
}

const contacts: Contact[] = [
    { id: 'physician', name: 'Dr. Sarah', role: 'Physician', icon: <Stethoscope size={20} />, color: 'text-blue-400' },
    { id: 'head_coach', name: 'Coach Mike', role: 'Head Coach', icon: <Dumbbell size={20} />, color: 'text-orange-400' },
    { id: 'nutritionist', name: 'Lisa', role: 'Nutritionist', icon: <Apple size={20} />, color: 'text-green-400' },
];

export default function CommunityPage() {
    const [activeRole, setActiveRole] = useState<RoleId>('physician');

    const [histories, setHistories] = useState<Record<RoleId, Message[]>>({
        physician: [{ id: 1, sender: 'bot', text: "Hi, I'm Dr. Sarah. How is your body feeling today? Any pain or soreness?" }],
        head_coach: [{ id: 1, sender: 'bot', text: "Coach Mike here. Ready to review your game plan?" }],
        nutritionist: [{ id: 1, sender: 'bot', text: "Hi, I'm Lisa. Let's talk about your meal plan for the upcoming tournament." }],
    });

    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeMessages = histories[activeRole];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages, activeRole]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const text = inputText;
        const userMessage: Message = { id: Date.now(), sender: 'user', text };

        // Update local history
        setHistories(prev => ({
            ...prev,
            [activeRole]: [...prev[activeRole], userMessage]
        }));

        setInputText('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/api/chat`, {
                message: text,
                role: activeRole
            });

            const botResponse: Message = {
                id: Date.now() + 1,
                sender: 'bot',
                text: res.data.response
            };

            setHistories(prev => ({
                ...prev,
                [activeRole]: [...prev[activeRole], botResponse]
            }));
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = { id: Date.now() + 1, sender: 'bot', text: "Sorry, I'm having trouble connecting to the server right now." };
            setHistories(prev => ({
                ...prev,
                [activeRole]: [...prev[activeRole], errorMessage]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVideoUpload = () => {
        const userMessage: Message = { id: Date.now(), sender: 'user', text: "Sending file...", isVideo: true };

        setHistories(prev => ({
            ...prev,
            [activeRole]: [...prev[activeRole], userMessage]
        }));

        setIsLoading(true);

        setTimeout(async () => {
            try {
                const res = await axios.post(`${API_BASE_URL}/api/chat`, {
                    videoUrl: "mock_video_url",
                    role: activeRole
                });
                const botResponse: Message = {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: res.data.response
                };
                setHistories(prev => ({
                    ...prev,
                    [activeRole]: [...prev[activeRole], botResponse]
                }));
            } catch {
                const errorMessage: Message = { id: Date.now() + 1, sender: 'bot', text: "Failed to send file." };
                setHistories(prev => ({
                    ...prev,
                    [activeRole]: [...prev[activeRole], errorMessage]
                }));
            } finally {
                setIsLoading(false);
            }
        }, 1000);
    };

    const handleCall = () => {
        alert("Audio/Video calling feature coming soon!");
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const activeContact = contacts.find(c => c.id === activeRole);

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Contacts */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-80 border-r border-white/10 bg-black/90 md:bg-black/50 transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col glass",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="font-bold text-xl bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                            Community
                        </h1>
                    </div>
                    {/* Close Button */}
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Professionals</h3>
                    {contacts.map(contact => (
                        <button
                            key={contact.id}
                            onClick={() => {
                                setActiveRole(contact.id);
                                setIsSidebarOpen(false);
                            }}
                            className={cn(
                                "w-full text-left p-3 rounded-xl flex items-center gap-4 transition-all",
                                activeRole === contact.id
                                    ? "bg-white/10 border border-white/5"
                                    : "hover:bg-white/5 border border-transparent"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                activeRole === contact.id ? "bg-emerald-500/20" : "bg-white/5"
                            )}>
                                <span className={contact.color}>{contact.icon}</span>
                            </div>
                            <div>
                                <h4 className="font-medium">
                                    {contact.name}
                                </h4>
                                <p className="text-xs text-gray-500">{contact.role}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col bg-black/95 relative w-full">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-white/10 glass bg-black/50 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Trigger */}
                        <div className="md:hidden">
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                                <Menu className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="md:hidden">
                            <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <ChevronLeft className="w-6 h-6 text-gray-400" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border border-white/10",
                                "bg-emerald-500/10"
                            )}>
                                <span className={activeContact?.color}>{activeContact?.icon}</span>
                            </div>
                            <div>
                                <h1 className="font-bold flex items-center gap-2">
                                    {activeContact?.name}
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                                        {activeContact?.role}
                                    </span>
                                </h1>
                                <p className="text-xs text-emerald-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call Actions */}
                    <div className="flex items-center gap-2">
                        <button onClick={handleCall} className="p-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <Phone size={20} />
                        </button>
                        <button onClick={handleCall} className="p-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            <Video size={20} />
                        </button>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                    {activeMessages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={cn(
                                "flex gap-3 max-w-[85%] md:max-w-[70%]",
                                msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                msg.sender === 'user' ? "bg-white/10" : "bg-emerald-500/20"
                            )}>
                                {msg.sender === 'user' ? <UserIcon size={16} /> : <span className={activeContact?.color}>{activeContact?.icon}</span>}
                            </div>

                            <div className={cn(
                                "p-4 rounded-2xl",
                                msg.sender === 'user'
                                    ? "bg-emerald-600 text-white rounded-tr-none"
                                    : "bg-white/10 border border-white/5 rounded-tl-none"
                            )}>
                                {msg.isVideo ? (
                                    <div className="flex items-center gap-2 text-sm italic opacity-80">
                                        <Video size={16} />
                                        Video File
                                    </div>
                                ) : (
                                    <p className="leading-relaxed">{msg.text}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
                                <span className={activeContact?.color}>{activeContact?.icon}</span>
                            </div>
                            <div className="bg-white/10 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 glass border-t border-white/10">
                    <div className="max-w-4xl mx-auto flex gap-4">
                        <button
                            onClick={handleVideoUpload}
                            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                            title="Upload File"
                        >
                            <Video size={20} />
                        </button>

                        <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={`Message ${activeContact?.name}...`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="p-3 rounded-full bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
