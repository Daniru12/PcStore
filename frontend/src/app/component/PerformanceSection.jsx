'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'

export default function PerformanceSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 45])

  // Animated counters
  const [fps, setFps] = useState(0)
  const [refresh, setRefresh] = useState(0)
  const [resolution, setResolution] = useState(0)

  const targetFps = 240
  const targetRefresh = 360
  const targetResolution = 4

  useEffect(() => {
    const fpsInterval = setInterval(() => {
      setFps((prev) => {
        if (prev < targetFps) {
          return Math.min(prev + 5, targetFps)
        }
        return prev
      })
    }, 20)

    const refreshInterval = setInterval(() => {
      setRefresh((prev) => {
        if (prev < targetRefresh) {
          return Math.min(prev + 7, targetRefresh)
        }
        return prev
      })
    }, 20)

    const resolutionInterval = setInterval(() => {
      setResolution((prev) => {
        if (prev < targetResolution) {
          return Math.min(prev + 0.1, targetResolution)
        }
        return prev
      })
    }, 100)

    return () => {
      clearInterval(fpsInterval)
      clearInterval(refreshInterval)
      clearInterval(resolutionInterval)
    }
  }, [])

  return (
    <div ref={ref} className="relative py-24 overflow-hidden bg-gray-900">
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, #4c8bf5 0%, transparent 70%)',
          rotate: rotation,
        }}
      />
      <div className="container relative z-10 px-4 mx-auto">
        <ScrollReveal>
          <h2 className="mb-2 text-4xl font-bold text-center text-white">
            Unmatched Performance
          </h2>
          <div className="w-24 h-1 mx-auto mb-12 bg-blue-500"></div>
        </ScrollReveal>
        <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-2">
          <ScrollReveal direction="left">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1629429408209-1f912961dbd8?q=80&w=2070&auto=format&fit=crop"
                alt="Gaming PC"
                className="rounded-lg shadow-2xl"
              />
              
            </div>
          </ScrollReveal>
          <div>
            <ScrollReveal direction="right">
              <h3 className="mb-6 text-3xl font-bold text-white">
                Experience Next-Level Gaming
              </h3>
              <p className="mb-8 text-gray-300">
                Our custom-built gaming PCs deliver exceptional performance,
                allowing you to experience games at their full potential with
                ultra-high frame rates and stunning visuals.
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <ScrollReveal direction="up" delay={0.1}>
                <div className="p-6 text-center bg-gray-800 rounded-lg">
                  <div className="mb-2 text-4xl font-bold text-blue-500">
                    {fps}+
                  </div>
                  <div className="text-gray-400">FPS</div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.2}>
                <div className="p-6 text-center bg-gray-800 rounded-lg">
                  <div className="mb-2 text-4xl font-bold text-blue-500">
                    {refresh}Hz
                  </div>
                  <div className="text-gray-400">Refresh Rate</div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.3}>
                <div className="p-6 text-center bg-gray-800 rounded-lg">
                  <div className="mb-2 text-4xl font-bold text-blue-500">
                    {resolution.toFixed(1)}K
                  </div>
                  <div className="text-gray-400">Resolution</div>
                </div>
              </ScrollReveal>
            </div>
            <ScrollReveal direction="up" delay={0.4}>
              <button className="px-8 py-3 mt-8 font-medium text-white transition-colors duration-300 bg-blue-600 rounded-md hover:bg-blue-700">
                Explore Gaming PCs
              </button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}