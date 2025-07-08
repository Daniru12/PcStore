'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'

export default function Categories() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  const categories = [
    {
      id: 1,
      name: 'Gaming PCs',
      image:
        'https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=2069&auto=format&fit=crop',
      description:
        'Custom-built gaming rigs designed for maximum performance and stunning visuals.',
    },
    {
      id: 2,
      name: 'Components',
      image:
        ' https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop',
      description:
        'Premium components from top brands for your custom PC builds and upgrades.',
    },
    {
      id: 3,
      name: 'Peripherals',
      image:
        ' https://i.postimg.cc/RCTnMT0L/image.png',
      description:
        'Gaming keyboards, mice, headsets, and more to complete your setup.',
    },
    {
      id: 4,
      name: 'Monitors',
      image:
        ' https://i.postimg.cc/Pq3T3PfZ/image.png',
      description:
        'High refresh rate monitors with vibrant colors for immersive gaming experiences.',
    },
  ]

  return (
    <div ref={ref} className="relative py-24 overflow-hidden bg-gray-800">
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'url(" https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y,
        }}
      />
      <div className="container relative z-10 px-4 mx-auto">
        <ScrollReveal>
          <h2 className="mb-2 text-4xl font-bold text-center">
            Product Categories
          </h2>
          <div className="w-24 h-1 mx-auto mb-12 bg-blue-500"></div>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {categories.map((category, index) => (
            <ScrollReveal
              key={category.id}
              direction={index % 2 === 0 ? 'left' : 'right'}
              delay={index * 0.15}
            >
              <div className="relative overflow-hidden rounded-lg cursor-pointer group h-80">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-black/20" />
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full text-white transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 transition-all duration-300">
                  <h3 className="mb-2 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">
                    {category.name}
                  </h3>
                  <p className="mb-4 text-gray-300 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    {category.description}
                  </p>
                  <div className="transition-transform duration-300 transform translate-y-8 group-hover:translate-y-0">
                    <button className="px-4 py-2 text-white transition-colors duration-300 bg-blue-600 rounded hover:bg-blue-700">
                      Explore {category.name}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  )
}