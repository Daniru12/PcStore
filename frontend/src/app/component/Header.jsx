// app/component/Header.js
"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function Header() {
  const { isLoggedIn, username, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900">
            TechBuild<span className="text-blue-600">PC</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Home
          </Link>
          <Link href="/build" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Build PC
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Products
          </Link>
          <Link href="/support" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Support
          </Link>
        </nav>

        {/* Auth Buttons / Username */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm font-medium text-gray-700">Hello, {username}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button (Optional) */}
        <button className="md:hidden text-gray-700 focus:outline-none">
          {/* Add mobile menu logic if needed */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}