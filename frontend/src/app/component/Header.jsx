'use client'

import Link from 'next/link'
import React, { useContext } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { AuthContext } from './AuthContext'

// Icons
import {
  ShoppingCartIcon,
  MenuIcon,
  XIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react'

export default function Header() {
  const { isLoggedIn, username, logout } = useContext(AuthContext)
  const pathname = usePathname()

  const isHomePage = pathname === '/'
  const isProductsPage = pathname === '/products'
  const isAdminPage = pathname.startsWith('/Admin')

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Don't render header on admin pages
  if (isAdminPage) return null

  return (
    <header className="fixed top-0 left-0 z-50 w-full text-white transition-all duration-300 bg-black/80 backdrop-blur-md">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/" className="text-2xl font-bold text-blue-500">
              TechBuild<span className="text-white">PC</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden space-x-8 md:flex"
          >
            <Link
              href="/"
              className="relative text-white transition-colors duration-300 hover:text-blue-400 group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/build"
              className="relative text-white transition-colors duration-300 hover:text-blue-400 group"
            >
              Build PC
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/products"
              className="relative text-white transition-colors duration-300 hover:text-blue-400 group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/support"
              className="relative text-white transition-colors duration-300 hover:text-blue-400 group"
            >
              Support
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.nav>

          {/* Right Side Icons & Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="items-center hidden space-x-5 md:flex"
          >
            <button className="transition-colors duration-300 hover:text-blue-400">
              <SearchIcon size={20} />
            </button>
            <button className="transition-colors duration-300 hover:text-blue-400">
              <UserIcon size={20} />
            </button>

            {/* Show Cart only on Products Page */}
            {isProductsPage && (
              <button className="relative transition-colors duration-300 hover:text-blue-400">
                <ShoppingCartIcon size={20} />
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs bg-blue-500 rounded-full -top-2 -right-2">
                  3
                </span>
              </button>
            )}

            {/* Auth buttons or user info */}
            {isLoggedIn ? (
              <>
                <span className="ml-4 text-sm font-medium text-white">
                  Hello, {username}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-4 mt-2 md:hidden bg-gray-900/95 backdrop-blur-md"
          >
            <nav className="flex flex-col px-4 space-y-4">
              <Link
                href="/"
                className="py-2 text-white border-b border-gray-800 hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/build"
                className="py-2 text-white border-b border-gray-800 hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Build PC
              </Link>
              <Link
                href="/products"
                className="py-2 text-white border-b border-gray-800 hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/support"
                className="py-2 text-white border-b border-gray-800 hover:text-blue-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>

              <div className="flex justify-between pt-2">
                <button className="hover:text-blue-400">
                  <SearchIcon size={20} />
                </button>
                <button className="hover:text-blue-400">
                  <UserIcon size={20} />
                </button>
                {isProductsPage && (
                  <button className="relative hover:text-blue-400">
                    <ShoppingCartIcon size={20} />
                    <span className="absolute flex items-center justify-center w-5 h-5 text-xs bg-blue-500 rounded-full -top-2 -right-2">
                      3
                    </span>
                  </button>
                )}
              </div>

              <div className="flex flex-col pt-2 space-y-2">
                {isLoggedIn ? (
                  <>
                    <span>{username}</span>
                    <button
                      onClick={logout}
                      className="text-left text-white hover:text-red-400"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-white hover:text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="text-white hover:text-blue-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}