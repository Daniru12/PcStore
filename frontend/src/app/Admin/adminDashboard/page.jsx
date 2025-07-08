"use client";

import Link from 'next/link';
import { useState, useContext } from 'react';
import { AuthContext } from "../../component/AuthContext";
import { Users, Package, ShoppingCart, MessageSquare, Activity, BarChart3, Settings, Bell } from 'lucide-react';

export default function AdminDashboard() {
    const {logout } = useContext(AuthContext);
    const [hoveredCard, setHoveredCard] = useState(null);

    const dashboardItems = [
        {
            id: 1,
            title: "View Users",
            description: "Manage user accounts and permissions",
            href: "/Admin/adminDashboard/adminUsers",
            icon: Users,
            color: "from-blue-500 to-blue-600",
            hoverColor: "from-blue-600 to-blue-700"
        },
        {
            id: 2,
            title: "View Products",
            description: "Manage inventory and product catalog",
            href: "/Admin/adminDashboard/adminProducts",
            icon: Package,
            color: "from-emerald-500 to-emerald-600",
            hoverColor: "from-emerald-600 to-emerald-700"
        },
        {
            id: 3,
            title: "View Orders",
            description: "Track and manage customer orders",
            href: "/Admin/adminDashboard/adminOrders",
            icon: ShoppingCart,
            color: "from-purple-500 to-purple-600",
            hoverColor: "from-purple-600 to-purple-700"
        },
        {
            id: 4,
            title: "View Messages",
            description: "Review customer inquiries and feedback",
            href: "/Admin/adminDashboard/adminInq",
            icon: MessageSquare,
            color: "from-orange-500 to-orange-600",
            hoverColor: "from-orange-600 to-orange-700"
        }
    ];

    const statsCards = [
        { label: "Total Users", value: "1,234", change: "+12%", icon: Users },
        { label: "Active Orders", value: "89", change: "+5%", icon: ShoppingCart },
        { label: "Products", value: "456", change: "+8%", icon: Package },
        { label: "Messages", value: "23", change: "+15%", icon: MessageSquare }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-600">Welcome back! Here's what's happening with your platform today.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Bell className="w-6 h-6 text-slate-600 hover:text-slate-800 cursor-pointer transition-colors duration-200" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                        <Settings className="w-6 h-6 text-slate-600 hover:text-slate-800 cursor-pointer transition-colors duration-200" />
                         <button 
                            onClick={logout} 
                            className="text-slate-600 hover:text-slate-800 cursor-pointer transition-colors duration-200 text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <div
                        key={stat.label}
                        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-slate-300 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                <p className="text-sm text-emerald-600 font-medium">{stat.change}</p>
                            </div>
                            <div className="p-3 bg-slate-100 rounded-lg">
                                <stat.icon className="w-6 h-6 text-slate-600" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {dashboardItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="group block"
                            onMouseEnter={() => setHoveredCard(item.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div
                                className={`
                                    relative overflow-hidden rounded-2xl p-8 text-white transition-all duration-500 ease-out
                                    bg-gradient-to-br ${hoveredCard === item.id ? item.hoverColor : item.color}
                                    transform hover:scale-105 hover:shadow-2xl
                                    before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-300
                                    hover:before:opacity-100
                                `}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Animated background pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className={`
                                        absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white
                                        transition-transform duration-700 ease-out
                                        ${hoveredCard === item.id ? 'transform scale-150 rotate-12' : ''}
                                    `}></div>
                                    <div className={`
                                        absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white
                                        transition-transform duration-700 ease-out delay-100
                                        ${hoveredCard === item.id ? 'transform scale-125 -rotate-12' : ''}
                                    `}></div>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`
                                            p-3 rounded-xl bg-white/20 backdrop-blur-sm
                                            transition-all duration-300 ease-out
                                            ${hoveredCard === item.id ? 'transform rotate-12 scale-110' : ''}
                                        `}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div className={`
                                            transition-transform duration-300 ease-out
                                            ${hoveredCard === item.id ? 'transform translate-x-2' : ''}
                                        `}>
                                            <Activity className="w-6 h-6 opacity-60" />
                                        </div>
                                    </div>

                                    <h3 className={`
                                        text-2xl font-bold mb-2
                                        transition-all duration-300 ease-out
                                        ${hoveredCard === item.id ? 'transform translate-x-2' : ''}
                                    `}>
                                        {item.title}
                                    </h3>
                                    
                                    <p className={`
                                        text-white/80 text-sm
                                        transition-all duration-300 ease-out
                                        ${hoveredCard === item.id ? 'transform translate-x-2' : ''}
                                    `}>
                                        {item.description}
                                    </p>

                                    <div className={`
                                        mt-6 flex items-center text-sm font-medium
                                        transition-all duration-300 ease-out
                                        ${hoveredCard === item.id ? 'transform translate-x-2' : ''}
                                    `}>
                                        <span>Manage</span>
                                        <svg
                                            className={`
                                                ml-2 w-4 h-4 transition-transform duration-300 ease-out
                                                ${hoveredCard === item.id ? 'transform translate-x-2' : ''}
                                            `}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 text-left rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group">
                        <div className="font-medium text-slate-800 group-hover:text-blue-600">Export Data</div>
                        <div className="text-sm text-slate-600">Download reports and analytics</div>
                    </button>
                    <button className="p-4 text-left rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group">
                        <div className="font-medium text-slate-800 group-hover:text-green-600">Add New Product</div>
                        <div className="text-sm text-slate-600">Create new product listings</div>
                    </button>
                    <button className="p-4 text-left rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group">
                        <div className="font-medium text-slate-800 group-hover:text-purple-600">System Settings</div>
                        <div className="text-sm text-slate-600">Configure platform settings</div>
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}