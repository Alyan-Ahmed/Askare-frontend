import { Link } from 'react-router-dom'
import Logo from './Logo'

export function Footer({ role }) {
  const aboutTo = role === 'doctor' ? '/about?role=doctor' : '/about'

  return (
    <footer className="w-full bg-[#f0f4f6] dark:bg-slate-900 border-t border-surface-container-high dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="max-w-sm">
            <div className="mb-3"><Logo size="footer" /></div>
            <p className="text-sm text-[#49636f] dark:text-slate-400 leading-relaxed">
              Redefining cognitive healthcare in Karachi through intelligent AI diagnostics and verified professional care.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-8">
            <Link className="text-sm font-medium text-[#49636f] dark:text-slate-300 hover:text-[#006977] transition-colors" to="/privacy-policy">Privacy Policy</Link>
            <Link className="text-sm font-medium text-[#49636f] dark:text-slate-300 hover:text-[#006977] transition-colors" to="/terms-of-use">Terms of Use</Link>
            <Link className="text-sm font-medium text-[#49636f] dark:text-slate-300 hover:text-[#006977] transition-colors" to={aboutTo}>About Us</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
