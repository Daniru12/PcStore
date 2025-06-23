// /pages/index.js

import Link from 'next/link';
import Image from 'next/image';

// Importing icons — assuming they are SVG files or use react-icons or similar
// For simplicity, using placeholder divs with labels below
const ChevronRightIcon = () => <span className="inline-block ml-1">→</span>;
const GaugeIcon = () => <span>⚡</span>;
const CpuIcon = () => <span>💾</span>;
const ShieldIcon = () => <span>🛡️</span>;
const ZapIcon = () => <span>⚡</span>;
const ThumbsUpIcon = () => <span>👍</span>;
const HeartIcon = () => <span>❤️</span>;

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Custom PC Builds for Every Need
            </h1>
            <p className="text-xl mb-8">
              From gaming powerhouses to professional workstations, we build the
              perfect computer tailored to your requirements.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/build"
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-center transition-colors"
              >
                Build Your PC
              </Link>
              <Link
                href="/prebuilt"
                className="px-8 py-3 bg-transparent border border-white hover:bg-white hover:text-blue-700 font-medium rounded-md text-center transition-colors"
              >
                View Pre-built PCs
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            {/* <Image
              src="https://images.unsplash.com/photo-1587202372616-b43abea06c2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Custom gaming PC with RGB lighting"
              width={1470}
              height={800}
              className="rounded-lg shadow-2xl"
            /> */}
          </div>
        </div>
      </section>

      {/* Featured PC Builds */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured PC Builds</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular custom PC configurations designed for
              different needs and budgets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gaming PC */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1142&q=80"
                alt="Gaming PC"
                width={1142}
                height={500}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">Apex Gaming PC</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Gaming
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  High-performance gaming rig with RGB lighting and liquid cooling.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    RTX 4070
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    i9-13900K
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    32GB RAM
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    2TB NVMe
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">$2,499</span>
                  <Link
                    href="/products/apex-gaming"
                    className="inline-flex items-center font-medium text-blue-600 hover:underline"
                  >
                    View Details
                    <ChevronRightIcon />
                  </Link>
                </div>
              </div>
            </div>
            {/* Workstation PC */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80"
                alt="Workstation PC"
                width={1064}
                height={500}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">Creator Pro</h3>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Workstation
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Professional workstation for content creation, 3D rendering, and more.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    RTX 4080
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Ryzen 9 7950X
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    64GB RAM
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    4TB Storage
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">$3,299</span>
                  <Link
                    href="/products/creator-pro"
                    className="inline-flex items-center font-medium text-blue-600 hover:underline"
                  >
                    View Details
                    <ChevronRightIcon />
                  </Link>
                </div>
              </div>
            </div>
            {/* Budget PC */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
                alt="Budget PC"
                width={1074}
                height={500}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">Starter Plus</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Budget
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  Affordable gaming PC that doesn't compromise on performance.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    RTX 4060
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Ryzen 5 7600X
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    16GB RAM
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    1TB NVMe
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">$1,299</span>
                  <Link
                    href="/products/starter-plus"
                    className="inline-flex items-center font-medium text-blue-600 hover:underline"
                  >
                    View Details
                    <ChevronRightIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              View All PCs
              <ChevronRightIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose TechBuildPC</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We take pride in delivering the highest quality custom PCs with exceptional service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <GaugeIcon />
              </div>
              <h3 className="text-xl font-bold mb-2">High Performance</h3>
              <p className="text-gray-600">
                Our systems are optimized for maximum performance, ensuring you get the most out of your components.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <CpuIcon />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Components</h3>
              <p className="text-gray-600">
                We use only the highest quality, name-brand components in all of our custom PC builds.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <ShieldIcon />
              </div>
              <h3 className="text-xl font-bold mb-2">3-Year Warranty</h3>
              <p className="text-gray-600">
                All our PCs come with a comprehensive 3-year warranty and lifetime technical support.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <ZapIcon />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Assembly</h3>
              <p className="text-gray-600">
                Each system is hand-built by experienced technicians who take pride in their craftsmanship.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <ThumbsUpIcon />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Upgrades</h3>
              <p className="text-gray-600">
                Our PCs are designed with future upgrades in mind, making it easy to enhance your system later.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <HeartIcon />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">
                We're not happy unless you're happy. Our customers consistently rate us 5 stars for service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Build Your Dream PC?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start customizing your perfect PC today or contact our experts for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/build"
              className="px-8 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Start Building
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-transparent border border-white font-medium rounded-md hover:bg-blue-800 transition-colors"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}