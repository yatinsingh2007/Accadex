'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Send, Video, ChevronLeft, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';

interface Message {
    id: number;
    sender: 'bot' | 'user';
    text: string;
    isVideo?: boolean;
}

export default function ChatPage() {
    // Pure AI Coach logic
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'bot', text: "Hello! I'm your AI Coach. Upload a match clip or ask me about your recent performance." }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const userMessage: Message = { id: Date.now(), sender: 'user', text: inputText };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/api/chat`, {
                message: userMessage.text,
                role: 'ai_coach'
            });

            const botResponse: Message = {
                id: Date.now() + 1,
                sender: 'bot',
                text: res.data.response
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = { id: Date.now() + 1, sender: 'bot', text: "Sorry, I'm having trouble connecting to the server right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVideoUpload = () => {
        // Simulate video upload
        const userMessage: Message = { id: Date.now(), sender: 'user', text: "Analyzing my serve video...", isVideo: true };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        setTimeout(async () => {
            try {
                const res = await axios.post(`${API_BASE_URL}/api/chat`, {
                    videoUrl: "mock_video_url",
                    role: 'ai_coach'
                });
                const botResponse: Message = {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: res.data.response
                };
                setMessages(prev => [...prev, botResponse]);
            } catch {
                const errorMessage: Message = { id: Date.now() + 1, sender: 'bot', text: "Failed to analyze video." };
                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            {/* Header */}
            <header className="flex items-center gap-4 p-4 border-b border-white/10 glass bg-black/50 sticky top-0 z-10">
                <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Bot className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="font-bold">AI Coach Assistant</h1>
                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => (
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
                            {msg.sender === 'user' ? <UserIcon size={16} /> : <Bot size={16} className="text-emerald-400" />}
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
                                    Video Uploaded
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
                            <Bot size={16} className="text-emerald-400" />
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
                        title="Upload Analysis Video"
                    >
                        <Video size={20} />
                    </button>

                    <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask about your stats or strategy..."
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
        </div>
    );
}
