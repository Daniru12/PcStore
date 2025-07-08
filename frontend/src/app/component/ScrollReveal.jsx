'use client'

import React, { useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 50,
  className = '',
  once = true,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once,
    margin: '-100px 0px',
  })
  const controls = useAnimation()

  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance }
      case 'down':
        return { opacity: 0, y: -distance }
      case 'left':
        return { opacity: 0, x: distance }
      case 'right':
        return { opacity: 0, x: -distance }
      case 'none':
        return { opacity: 0 }
      default:
        return { opacity: 0, y: distance }
    }
  }

  React.useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration, delay },
      })
    }
  }, [isInView, controls, duration, delay])

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  )
}