'use client'

import React, { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from 'lucide-react'

export default function Testimonials() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  const testimonials = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Professional Gamer',
      image:
        'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop',
      quote:
        "The performance of my Quantum PC is incredible. I've never experienced such smooth gameplay and quick response times. It's given me a competitive edge in tournaments.",
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Content Creator',
      image:
        ' https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop',
      quote:
        'As a streamer and video editor, I need reliable performance. My custom PC from QuantumPC handles everything I throw at it without breaking a sweat.',
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'Software Developer',
      image:
        ' https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
      quote:
        'The workstation I purchased has dramatically improved my workflow. Compiling code is lightning fast, and I can run multiple VMs with ease.',
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  return (
    <div ref={ref} className="relative py-24 overflow-hidden bg-gray-800">
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'url(" https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y,
        }}
      />
      <div className="container relative z-10 px-4 mx-auto">
        <ScrollReveal>
          <h2 className="mb-2 text-4xl font-bold text-center text-white">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 mx-auto mb-12 bg-blue-500"></div>
        </ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-gray-900 rounded-lg shadow-xl md:p-12"
            >
              <div className="flex flex-col items-center gap-8 md:flex-row">
                <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-full md:w-32 md:h-32">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        size={20}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-lg italic text-gray-300">
                    "{testimonials[activeIndex].quote}"
                  </p>
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="text-blue-400">
                      {testimonials[activeIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="flex items-center justify-center w-10 h-10 transition-colors duration-300 bg-gray-700 rounded-full hover:bg-blue-600"
              >
                <ChevronLeftIcon size={24} />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === activeIndex
                        ? 'bg-blue-500'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="flex items-center justify-center w-10 h-10 transition-colors duration-300 bg-gray-700 rounded-full hover:bg-blue-600"
              >
                <ChevronRightIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}