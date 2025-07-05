import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LandingAnimation = ({ mode }) => {
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 1700) // 1.5 seconds

    return () => clearTimeout(timer)
  }, [])

  // Set classes based on mode
  const bgClass = mode === 'dark' ? 'bg-gray-900' : 'bg-white'
  const textMain = mode === 'dark' ? 'text-green-400' : 'text-green-600'
  const textSpan = mode === 'dark' ? 'text-white' : 'text-black'

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className={`w-screen h-screen flex items-center justify-center ${bgClass} fixed top-0 left-0 z-50`}
          initial={{ opacity: 0 }} //scale: 0.2 
          animate={{ opacity: 1 }} //scale: 1
          exit={{ opacity: 0 }} //scale: 1.1
          transition={{ duration: 1.2 }}
        >
          <motion.h1
            className={`${textMain} font-extrabold text-3xl`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1,scale:2 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Quicker
            <span className={textSpan}>Notes</span>
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LandingAnimation
