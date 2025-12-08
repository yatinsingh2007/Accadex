'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'player',
        academy: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, role: value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5001/api/auth/register', formData);

            // Store token and user data
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Join Accadex to elevate your sports career
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className="bg-black/50 border-zinc-700 focus:ring-emerald-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-black/50 border-zinc-700 focus:ring-emerald-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={handleSelectChange} defaultValue="player">
                                <SelectTrigger className="bg-black/50 border-zinc-700">
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="player">Player</SelectItem>
                                    <SelectItem value="coach">Coach</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {formData.role === 'player' && (
                            <div className="space-y-2">
                                <Label htmlFor="academy">Academy Name</Label>
                                <Input
                                    id="academy"
                                    placeholder="Elite Sports Academy"
                                    value={formData.academy}
                                    onChange={handleChange}
                                    className="bg-black/50 border-zinc-700 focus:ring-emerald-500"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-black/50 border-zinc-700 focus:ring-emerald-500"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-zinc-400">
                        Already have an account? <Link href="/login" className="text-emerald-400 hover:underline">Log in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
