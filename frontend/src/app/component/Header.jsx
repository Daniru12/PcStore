"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MenuIcon,
  X as CloseIcon,
  MonitorIcon,
  UserIcon,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <MonitorIcon className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              TechBuild<span className="text-blue-600">PC</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/build"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Build PC
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              href="/support"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Support
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              <UserIcon className="h-5 w-5 mr-1" />
              Login
            </Link>
            <Link
              href="/signup"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 py-3 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="px-2 py-1 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/build"
                className="px-2 py-1 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Build PC
              </Link>
              <Link
                href="/products"
                className="px-2 py-1 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/support"
                className="px-2 py-1 text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <div className="flex space-x-4 pt-2">
                <Link
                  href="/login"
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-center hover:bg-gray-50 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;