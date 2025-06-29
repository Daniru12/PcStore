"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaChevronRight, FaBolt, FaMicrochip, FaShieldAlt, FaTools, FaThumbsUp, FaHeart, FaSearch, FaTimes } from 'react-icons/fa';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // State for dismissing ad bar
  const [showAdBar, setShowAdBar] = useState(true);

  // GSAP animations
  useEffect(() => {
    // Hero section animation
    gsap.fromTo(
      '.hero-section',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Featured builds cards animation
    gsap.fromTo(
      '.build-card',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.builds-section',
          start: 'top 80%',
        },
      }
    );

    // Why choose us cards animation
    gsap.fromTo(
      '.why-card',
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.why-section',
          start: 'top 80%',
        },
      }
    );

    // Testimonials animation
    gsap.fromTo(
      '.testimonial-card',
      { opacity: 0, x: 30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.testimonials-section',
          start: 'top 80%',
        },
      }
    );

    // CTA section animation
    gsap.fromTo(
      '.cta-section',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
        },
      }
    );

    // Cleanup ScrollTriggers
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="w-full bg-gray-900 text-white">
      

      {/* Advertisement Bar */}
      {showAdBar && (
        <div className="bg-blue-800 text-white text-center py-3 fixed top-16 left-0 w-full z-40 shadow-md">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <p className="text-sm md:text-base font-medium">
              🎉 Limited Time Offer: Get 10% off all custom PC builds!{' '}
              <Link href="/deals" className="underline hover:text-blue-300">
                Shop Now
              </Link>
            </p>
            <FaTimes
              className="cursor-pointer hover:text-blue-300 transition-colors"
              size={20}
              onClick={() => setShowAdBar(false)}
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className={`relative bg-gradient-to-r from-gray-800 via-blue-900 to-blue-700 text-white pt-28 pb-16 hero-section ${showAdBar ? 'mt-16' : 'mt-0'}`}>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12 z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Your Dream PC, Built to Perfection
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Customize high-performance gaming PCs or workstations with premium components, backed by expert support.[](https://www.chamacomputers.lk/)[](https://www.youtube.com/channel/UCP8e7Cg5xMHopflUKOFYl3Q)
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/build"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full text-center transition-all transform hover:scale-105 hover:shadow-lg"
              >
                Build Your PC
              </Link>
              <Link
                href="/prebuilt"
                className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 font-semibold rounded-full text-center transition-all transform hover:scale-105"
              >
                View Pre-built PCs
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 z-10">
            <Image
              src="https://images.unsplash.com/photo-1587202372616-b43abea06c2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Custom gaming PC with RGB lighting"
              width={1470}
              height={800}
              className="rounded-xl shadow-2xl transform hover:scale-102 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured PC Builds */}
      <section className="py-20 bg-gray-800 builds-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4 text-white">Featured PC Builds</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Explore our top-tier custom PCs for gaming, work, and budget needs.[](https://chamacomputers.lk.siteindices.com/)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Apex Gaming PC',
                image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1142&q=80',
                tag: 'Gaming',
                tagColor: 'bg-blue-600',
                desc: 'High-performance gaming rig with RGB lighting and liquid cooling.',
                specs: ['RTX 4070', 'i9-13900K', '32GB RAM', '2TB NVMe'],
                price: '$2,499',
                link: '/products/apex-gaming',
              },
              {
                title: 'Creator Pro',
                image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80',
                tag: 'Workstation',
                tagColor: 'bg-purple-600',
                desc: 'Professional workstation for content creation and 3D rendering.',
                specs: ['RTX 4080', 'Ryzen 9 7950X', '64GB RAM', '4TB Storage'],
                price: '$3,299',
                link: '/products/creator-pro',
              },
              {
                title: 'Starter Plus',
                image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
                tag: 'Budget',
                tagColor: 'bg-green-600',
                desc: 'Affordable gaming PC with solid performance.',
                specs: ['RTX 4060', 'Ryzen 5 7600X', '16GB RAM', '1TB NVMe'],
                price: '$1,299',
                link: '/products/starter-plus',
              },
            ].map((build, index) => (
              <div
                key={build.title}
                className="bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl hover:scale-105 build-card"
              >
                <Image
                  src={build.image}
                  alt={build.title}
                  width={1142}
                  height={500}
                  className="w-full h-56 object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{build.title}</h3>
                    <span className={`${build.tagColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {build.tag}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{build.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {build.specs.map((spec) => (
                      <span
                        key={spec}
                        className="bg-gray-600 text-gray-200 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-white">{build.price}</span>
                    <Link
                      href={build.link}
                      className="inline-flex items-center font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View Details
                      <FaChevronRight className="ml-1" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              View All PCs
              <FaChevronRight className="ml-1" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-900 why-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4 text-white">Why Choose TechBuildPC</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Unmatched quality, service, and performance in every custom PC.[](https://www.chamacomputers.lk/)[](https://lk.linkedin.com/company/chamacomputers)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <FaBolt size={24} />,
                title: 'High Performance',
                desc: 'Optimized systems for peak performance with every component.',
              },
              {
                icon: <FaMicrochip size={24} />,
                title: 'Premium Components',
                desc: 'We use only the highest quality, name-brand components.',
              },
              {
                icon: <FaShieldAlt size={24} />,
                title: '3-Year Warranty',
                desc: 'Comprehensive 3-year warranty with lifetime support.',
              },
              {
                icon: <FaTools size={24} />,
                title: 'Expert Assembly',
                desc: 'Hand-built by experienced technicians with precision.',
              },
              {
                icon: <FaThumbsUp size={24} />,
                title: 'Easy Upgrades',
                desc: 'Designed for seamless future upgrades.',
              },
              {
                icon: <FaHeart size={24} />,
                title: 'Customer Satisfaction',
                desc: 'Consistently rated 5 stars for exceptional service.',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="bg-gray-700 p-6 rounded-xl shadow-md transform transition-all hover:shadow-lg hover:scale-105 why-card"
              >
                <div className="bg-blue-600 text-white p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-800 testimonials-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4 text-white">What Our Customers Say</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Hear from our satisfied customers about their experience with TechBuildPC.[](https://www.chamacomputers.lk/)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: 'The best experience I’ve had buying a PC! The staff was knowledgeable and helped me choose the perfect gaming rig.',
                author: 'John D., Gamer',
              },
              {
                quote: 'Upgraded my CPU cooling with their recommendation, and my system runs cooler and quieter than ever!',
                author: 'Sarah K., Content Creator',
              },
              {
                quote: 'Fast repairs and excellent service. My laptop was fixed in under an hour!',
                author: 'Michael R., Professional',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-700 p-6 rounded-xl shadow-md testimonial-card"
              >
                <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                <p className="text-blue-400 font-semibold">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white cta-section">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-6">Ready to Build Your Dream PC?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Customize your perfect PC or get expert advice tailored to your needs.[](https://www.youtube.com/channel/UCP8e7Cg5xMHopflUKOFYl3Q)
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/build"
              className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 hover:shadow-lg"
            >
              Start Building
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white font-semibold rounded-full hover:bg-blue-800 hover:border-blue-800 transition-all transform hover:scale-105"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

     
    </div>
  );
}