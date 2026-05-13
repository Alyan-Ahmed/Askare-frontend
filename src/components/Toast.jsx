import { useState, useEffect, useRef } from 'react'

export default function Toast({ message, onClose, duration = 4000 }) {
  const [visible, setVisible] = useState(true)
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)
    return () => clearTimeout(timer.current)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div className="fixed bottom-8 right-8 z-[90] toast-enter">
      <div className="bg-primary text-on-primary px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
        <span>{message}</span>
      </div>
    </div>
  )
}
