'use client' // This tells Next.js this is a Client Component

import React, { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDownIcon } from 'lucide-react'

export default function Hero() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      <motion.div
        style={{
          y,
          opacity,
          scale,
        }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?q=80&w=1932&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
      </motion.div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
        >
          <h1 className="mb-4 text-5xl font-bold md:text-7xl">
            <span className="text-blue-500">Next-Gen</span> <span className="text-white">Gaming</span>
            <br />
            <span className="text-white">Experience</span>
          </h1>
        </motion.div>
        <motion.p
          className="max-w-2xl mb-8 text-lg text-gray-300 md:text-xl"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.4,
          }}
        >
          Unleash the power of cutting-edge PC hardware. Custom-built machines
          designed for ultimate performance and stunning visuals.
        </motion.p>
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.6,
          }}
        >
          <button className="px-8 py-3 font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-700 hover:scale-105">
            Shop Now
          </button>
          <button className="px-8 py-3 font-medium text-white transition-colors duration-300 border border-white rounded-md hover:border-blue-500 hover:text-blue-500">
            Build Your PC
          </button>
        </motion.div>
      </div>
      <motion.button
        onClick={handleScrollDown}
        className="absolute text-white transform -translate-x-1/2 bottom-10 left-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
      >
        <ChevronDownIcon size={32} />
      </motion.button>
    </div>
  )
}