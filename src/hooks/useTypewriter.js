// src/hooks/useTypewriter.js
import { useEffect, useState } from 'react'

/**
 * Custom hook that cycles through an array of strings with a typewriter effect.
 * Types character by character, pauses, erases, then moves to the next string.
 * Respects prefers-reduced-motion — returns the first string statically if set.
 *
 * @param {string[]} words - Array of strings to cycle through
 * @param {number} typeSpeed - Milliseconds per character when typing (default: 80)
 * @param {number} eraseSpeed - Milliseconds per character when erasing (default: 40)
 * @param {number} pauseDuration - Milliseconds to pause after typing (default: 2000)
 * @returns {string} The currently displayed text
 */
export function useTypewriter(words, typeSpeed = 80, eraseSpeed = 40, pauseDuration = 2000) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handler = (e) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // If reduced motion, just show the first word statically
  useEffect(() => {
    if (isReducedMotion && words.length > 0) {
      setText(words[0])
    }
  }, [isReducedMotion, words])

  useEffect(() => {
    // Skip animation entirely if reduced motion is preferred
    if (isReducedMotion) return

    const currentWord = words[wordIndex]
    let timeout

    if (!isDeleting) {
      // Typing
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1))
        }, typeSpeed)
      } else {
        // Pause before erasing
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, pauseDuration)
      }
    } else {
      // Erasing
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1))
        }, eraseSpeed)
      } else {
        // Move to next word
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, typeSpeed, eraseSpeed, pauseDuration, isReducedMotion])

  return text
}
