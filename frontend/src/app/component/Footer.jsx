"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MonitorIcon,
} from "lucide-react";

const Footer = () => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/Admin");

  if (isAdminPage) {
    return null; // Hide footer on admin pages
  }

  return (
    <footer className="bg-gray-900 text-gray-300 w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MonitorIcon className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">
                TechBuild<span className="text-blue-500">PC</span>
              </span>
            </div>
            <p className="text-sm">
              Building custom PCs tailored to your needs since 2010. Quality
              components, expert assembly, and exceptional performance.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/gaming-pcs"
                  className="hover:text-blue-500 transition-colors"
                >
                  Gaming PCs
                </Link>
              </li>
              <li>
                <Link
                  href="/workstations"
                  className="hover:text-blue-500 transition-colors"
                >
                  Workstations
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-builds"
                  className="hover:text-blue-500 transition-colors"
                >
                  Custom Builds
                </Link>
              </li>
              <li>
                <Link
                  href="/components"
                  className="hover:text-blue-500 transition-colors"
                >
                  Components
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="hover:text-blue-500 transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-500 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-blue-500 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty"
                  className="hover:text-blue-500 transition-colors"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-blue-500 transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-blue-500 transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-blue-500 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-blue-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="hover:text-blue-500 transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} TechBuildPC. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-500 transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-500 transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-blue-500 transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;