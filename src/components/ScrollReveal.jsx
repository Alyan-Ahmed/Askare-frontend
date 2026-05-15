import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Global scroll-reveal observer.
 * Watches for any element with the `.reveal` class and fades it in when visible.
 * Re-scans whenever the route changes so new pages get animated.
 */
export default function ScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    // Small delay so the DOM has time to render after route change
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        observer.observe(el)
      })
    }, 60)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [pathname])

  return null
}
