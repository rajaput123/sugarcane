"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye, LogIn, Sparkles, Calendar, Users, Shield, Zap, CheckCircle2, Star, FileText, Database, DollarSign, Building2, BookOpen, Upload, Layout, MousePointer2, ChevronRight } from 'lucide-react';
import LoginForm from './LoginForm';

interface LandingPageProps {
    onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
    const [showLogin, setShowLogin] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);
    interface BentoCardProps {
        children: React.ReactNode;
        className?: string;
        delay?: string;
    }

    const BentoCard = ({ children, className = "", delay = "0s" }: BentoCardProps) => (
        <div
            className={`group relative overflow-hidden rounded-[2rem] border border-earth-400/20 bg-white/5 backdrop-blur-md transition-all duration-500 hover:border-earth-400/40 hover:bg-white/10 ${className}`}
            style={{ animation: `slideUpFade 0.8s ease-out forwards ${delay}`, opacity: 0 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-earth-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 h-full p-8 md:p-10 flex flex-col">
                {children}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-earth-900 text-white selection:bg-earth-400 selection:text-earth-900 overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-sm scale-105"
                    style={{ backgroundImage: 'url(/images/landing/hero_bg.png)' }}
                />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-earth-800/20 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-earth-600/10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />
                <div className="absolute top-[30%] right-[10%] w-[25%] h-[25%] bg-earth-400/5 blur-[80px] rounded-full animate-float" style={{ animationDelay: '-4s' }} />
                <div className="grain-overlay opacity-[0.03]" />
            </div>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="container mx-auto px-6 pt-32 pb-20 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-earth-400/10 border border-earth-400/20 text-earth-300 text-sm font-medium mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                        <Sparkles size={14} className="text-earth-400" />
                        <span>Reimagining Operational Excellence</span>
                    </div>

                    <h1 className={`text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.85] tracking-tighter transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        Namaha <br />
                        <span className="bg-gradient-to-r from-earth-400 via-earth-300 to-earth-400 bg-clip-text text-transparent animate-gradient">Platform</span>
                    </h1>

                    <p className={`text-lg md:text-xl text-earth-100/70 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        The next generation of intelligent planning and operations management. Powered by AI, designed for humans.
                    </p>

                    <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <button
                            onClick={onGetStarted}
                            className="group relative px-10 py-5 bg-earth-400 text-earth-900 font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(238,199,111,0.2)] hover:shadow-[0_0_60px_rgba(238,199,111,0.3)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Launch Platform <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button
                            onClick={() => setShowLogin(true)}
                            className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl font-bold transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                        >
                            Sign In
                        </button>
                    </div>
                </section>

                {/* Bento Grid Features Section */}
                <section className="container mx-auto px-6 py-32">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Capabilities</h2>
                        <p className="text-earth-100/60 max-w-2xl mx-auto text-lg">
                            An integrated suite of tools designed to handle every aspect of modern temple and institutional operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[25rem]">
                        {/* Large Featured Card: AI Planner */}
                        <BentoCard className="md:col-span-8 group" delay="0.1s">
                            <div className="flex-1">
                                <div className="w-16 h-16 rounded-2xl bg-earth-400/20 flex items-center justify-center mb-8 border border-earth-400/30 group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles className="text-earth-400" size={32} />
                                </div>
                                <h3 className="text-3xl font-black mb-4">Intelligent AI Planner</h3>
                                <p className="text-earth-100/70 text-lg max-w-xl leading-relaxed">
                                    Experience the future of coordination. Our AI understands your requirements, schedules VIP visits, manages event timelines, and predicts operational needs before they arise.
                                </p>
                            </div>
                            <div className="mt-8 flex gap-4 overflow-hidden mask-fade-right">
                                {['VIP Protocols', 'Event Scheduling', 'Resource Allocation'].map((tag) => (
                                    <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium whitespace-nowrap">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </BentoCard>

                        {/* Medium Card: Computer Vision */}
                        <BentoCard className="md:col-span-4 group h-full" delay="0.2s">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/images/landing/temple_carvings.png"
                                    alt="Temple Detail"
                                    className="w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-earth-900/40 to-transparent" />
                            </div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-14 h-14 rounded-2xl bg-earth-300/10 flex items-center justify-center mb-6 border border-earth-300/20">
                                    <Eye className="text-earth-300" size={28} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Vision AI</h3>
                                <p className="text-earth-100/60 flex-1">
                                    Advanced monitoring and asset tracking through computer vision. Seamless security and crowd management.
                                </p>
                                <div className="mt-6 p-4 rounded-xl bg-earth-900/50 border border-white/5 flex items-center justify-between">
                                    <span className="text-sm font-medium">Real-time Analysis</span>
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                </div>
                            </div>
                        </BentoCard>

                        {/* Medium Card: Documents */}
                        <BentoCard className="md:col-span-4 group" delay="0.3s">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/images/landing/temple_lamp.png"
                                    alt="Temple Lamp"
                                    className="w-full h-full object-cover opacity-10 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-earth-900 via-transparent to-transparent" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-earth-600/20 flex items-center justify-center mb-6 border border-earth-600/30">
                                    <BookOpen className="text-earth-300" size={28} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Knowledge Engine</h3>
                                <p className="text-earth-100/60">
                                    AI-powered document analysis for spiritual teachings and operational manuals. Searchable wisdom at your fingertips.
                                </p>
                            </div>
                        </BentoCard>

                        {/* Large Featured Card: Operations */}
                        <BentoCard className="md:col-span-8 group overflow-hidden" delay="0.4s">
                            <div className="absolute inset-0 z-0 opacity-10 filter blur-[2px] scale-105 group-hover:scale-110 transition-transform duration-1000">
                                <img src="/images/landing/temple_interior.png" alt="Interior" className="w-full h-full object-cover" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 h-full">
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="w-16 h-16 rounded-2xl bg-earth-100/10 flex items-center justify-center mb-8 border border-white/10">
                                        <Layout className="text-earth-100" size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Unified Operations</h3>
                                    <p className="text-earth-100/70 text-lg leading-relaxed">
                                        From kitchen management to inventory and facility maintenance. A single pane of glass for everything that moves.
                                    </p>
                                </div>
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Users, label: 'People' },
                                        { icon: DollarSign, label: 'Finance' },
                                        { icon: Building2, label: 'Assets' },
                                        { icon: Calendar, label: 'Events' }
                                    ].map((item) => (
                                        <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center group-hover:bg-white/10 transition-colors">
                                            <item.icon className="text-earth-400 mb-2" size={20} />
                                            <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </BentoCard>

                        {/* Small Visual Card: Heritage */}
                        <BentoCard className="md:col-span-4 group h-full" delay="0.5s">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/images/landing/hero_bg.png"
                                    alt="Heritage"
                                    className="w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-transparent to-transparent" />
                            </div>
                            <div className="relative z-10 mt-auto">
                                <span className="text-xs font-bold uppercase tracking-[0.3em] text-earth-300">Cultural Legacy</span>
                                <h3 className="text-xl font-bold">Sacred Heritage</h3>
                            </div>
                        </BentoCard>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-earth-800/20 backdrop-blur-3xl border-y border-white/5 overflow-hidden relative">
                    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
                        {[
                            { val: '100%', label: 'Efficiency Gain' },
                            { val: '24/7', label: 'AI Monitoring' },
                            { val: '0ms', label: 'Latency' },
                            { val: '∞', label: 'Possibilities' }
                        ].map((stat, i) => (
                            <div key={i} className="group">
                                <div className="text-4xl md:text-6xl font-black text-earth-400 mb-2 group-hover:scale-110 transition-transform duration-500">{stat.val}</div>
                                <div className="text-xs font-bold uppercase tracking-[0.2em] text-earth-100/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-6 py-40">
                    <div className="relative rounded-[3.5rem] bg-gradient-to-br from-earth-700 to-earth-900 p-12 md:p-24 text-center overflow-hidden border border-earth-400/20">
                        <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-earth-400/10 blur-[100px] -z-10" />
                        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Ready to evolve?</h2>
                        <p className="text-xl text-earth-100/70 max-w-2xl mx-auto mb-12">
                            Join the elite institutions leveraging Namaha Platform to streamline operations and enhance experiences.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={onGetStarted}
                                className="px-12 py-6 bg-earth-400 text-earth-900 font-black rounded-2xl hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl"
                            >
                                Get Started Now <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="container mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-earth-400 flex items-center justify-center font-black text-earth-900">N</div>
                        <span className="text-xl font-black tracking-tight">Namaha Platform</span>
                    </div>
                    <div className="text-earth-100/40 text-sm font-medium">
                        © 2026 Namaha Platform. All rights reserved. Built for the future.
                    </div>
                    <div className="flex gap-8">
                        {['Privacy', 'Security', 'Contact'].map(item => (
                            <a key={item} href="#" className="text-sm font-bold text-earth-100/60 hover:text-earth-400 transition-colors uppercase tracking-widest">{item}</a>
                        ))}
                    </div>
                </footer>
            </main>

            {/* Login Modal */}
            {showLogin && (
                <LoginForm
                    onClose={() => setShowLogin(false)}
                    onLoginSuccess={onGetStarted}
                />
            )}
        </div>
    );
}
