export default function Logo({ size = 'header' }) {
  const textClass = size === 'footer' ? 'text-3xl' : 'text-2xl'
  const svgW = size === 'footer' ? 32 : 28
  const svgH = size === 'footer' ? 26 : 22

  return (
    <span className="flex items-center" aria-label="Askare">
      <span className={`${textClass} font-semibold text-[#2C2C2C]`} style={{ fontFamily: "'Comfortaa',sans-serif", letterSpacing: '0.01em' }}>as</span>
      <svg viewBox="0 0 28 24" width={svgW} height={svgH} style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 -1px' }} aria-hidden="true">
        <path d="M0,14 L5,14 L8,7 L11,22 L14,2 L17,20 L21,14 L28,14" stroke="#009688" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`${textClass} font-semibold text-[#2C2C2C]`} style={{ fontFamily: "'Comfortaa',sans-serif", letterSpacing: '0.01em' }}>are</span>
    </span>
  )
}
