import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, scale } from 'framer-motion'

const LandingAnimation = ({ mode }) => {
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 2300)
    return () => clearTimeout(timer)
  }, [])

  // Colors
  const bgClass = mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
  const textMain = mode === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
  const textSecondary = mode === 'dark' ? 'text-gray-300' : 'text-gray-800'

  // Create background text elements (now more visible)
  const backgroundLines = Array.from({ length: 16 }, (_, i) => i)

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className={`w-screen h-screen fixed top-0 left-0 z-50 overflow-hidden ${bgClass}`}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* VISIBLE Background lines - increased opacity */}
          <div className="absolute inset-0 overflow-hidden">
            {backgroundLines.map((line) => (
              <motion.div
                key={line}
                className={`absolute ${textSecondary} font-mono whitespace-nowrap font-bold text-2xl opacity-40`} // Increased size and opacity
                style={{
                  top: `${(line + 1) * 6}%`,
                  left: '100%',
                }}
                initial={{ x: 0 }}
                animate={{
                  x: '-300%',
                  transition: {
                    duration: 20 + Math.random() * 10,
                    ease: "linear",
                    repeat: Infinity,
                    // delay: Math.random() * 2
                    delay: -3
                  }
                }}
              >
                QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! •  QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! •  QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! • QuickerNotes!! •
              </motion.div>
            ))}
          </div>

          {/* Main centered text */}
          <div className="w-full h-full flex items-center justify-center relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, exit: { scale: 40 } }}
              animate={{
                scale: [1, 1.1, 1, 1.05, 60], // Jiggle sequence
                opacity: 1,
                transition: {
                  scale: {
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                  },
                  opacity: 0
                }
              }}
              className="text-center"
            >
              <motion.h1
                className={`${textMain} font-bold text-6xl md:text-8xl tracking-tighter drop-shadow-lg`}
                whileHover={{ scale: 1.05 }} // Extra interaction
              >
                Quicker
                <span className={mode === 'dark' ? 'text-gray-200' : 'text-gray-800'}>
                  Notes
                </span>
              </motion.h1>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LandingAnimation