'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'

export default function FeaturedProducts() {
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  const products = [
    {
      id: 1,
      name: 'Quantum Beast X1',
      category: 'Gaming Desktop',
      price: 2499,
      image:
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2070&auto=format&fit=crop',
      specs: 'RTX 4080, i9-13900K, 64GB RAM',
    },
    {
      id: 2,
      name: 'Stealth Pro',
      category: 'Gaming Laptop',
      price: 1899,
      image:
        ' https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop',
      specs: 'RTX 4070, i7-13700H, 32GB RAM',
    },
    {
      id: 3,
      name: 'Creator Studio',
      category: 'Workstation',
      price: 3299,
      image:
        ' https://images.unsplash.com/photo-1629429407759-01cd3d7cfb38?q=80&w=2070&auto=format&fit=crop',
      specs: 'RTX 4090, Ryzen 9 7950X, 128GB RAM',
    },
  ]

  return (
    <div ref={ref} className="relative py-24 overflow-hidden bg-gray-900">
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'url(" https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          x,
        }}
      />
      <div className="container relative z-10 px-4 mx-auto">
        <ScrollReveal>
          <h2 className="mb-2 text-4xl font-bold text-center text-white">Featured Products</h2>
          <div className="w-24 h-1 mx-auto mb-12 bg-blue-500"></div>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ScrollReveal
              key={product.id}
              direction="up"
              delay={index * 0.2}
              className="h-full"
            >
              <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-500 hover:scale-[1.02] h-full flex flex-col">
                <div className="h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex-grow">
                    <span className="text-sm font-medium text-blue-400">
                      {product.category}
                    </span>
                    <h3 className="mt-2 mb-3 text-2xl font-bold text-white">
                      {product.name}
                    </h3>
                    <p className="mb-4 text-gray-400">{product.specs}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-700">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                    <button className="px-4 py-2 text-white transition-colors duration-300 bg-blue-600 rounded hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal direction="none" delay={0.6}>
          <div className="mt-12 text-center">
            <button className="px-8 py-3 font-medium text-blue-500 transition-colors duration-300 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white">
              View All Products
            </button>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}