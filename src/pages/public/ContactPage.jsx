import { useState, useRef, useEffect } from 'react'

function getTime() {
  const d = new Date()
  let h = d.getHours(), m = d.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  m = m < 10 ? '0' + m : m
  return h + ':' + m + ' ' + ampm
}

function getAgentResponse(userText) {
  const t = userText.toLowerCase()
  if (t.match(/\b(appointment|book|schedule|consult|visit)\b/))
    return "I'd be happy to help you book an appointment! 🗓️ You can schedule directly from your Patient Dashboard, or I can guide you through the process. Would you like an in-person visit or a video consultation?"
  if (t.match(/\b(bill|billing|payment|pay|charge|invoice|cost|price|fee)\b/))
    return "For billing inquiries, our finance team is here to help. Common questions:<br><br>• <b>Consultation fee:</b> PKR 2,500 – 5,000<br>• <b>AI Diagnosis:</b> Included in your plan<br>• <b>Video Call:</b> PKR 3,000 per session<br><br>Need help with a specific charge?"
  if (t.match(/\b(data|privacy|secure|security|hipaa|encrypt|protect)\b/))
    return "Your data security is our top priority. 🔒 Askare uses AES-256 encryption for all stored data, end-to-end encryption for video consultations, and is fully HIPAA-compliant. Want to know about a specific aspect of our security?"
  if (t.match(/\b(technical|bug|error|crash|not working|broken|issue|problem|glitch)\b/))
    return "I'm sorry you're experiencing a technical issue! 🛠️ Let me help troubleshoot:<br><br>1. Try clearing your browser cache and refreshing<br>2. Ensure you're using Chrome, Firefox, or Safari<br>3. Check that JavaScript is enabled<br><br>If the issue persists, please describe what you're seeing."
  if (t.match(/\b(doctor|specialist|psychiat|neurolog|therapist)\b/))
    return "We have a network of verified specialists in Karachi including:<br><br>• <b>Dr. Arsalan Khan</b> — Cognitive Neurology<br>• <b>Dr. Farah Ahmed</b> — Clinical Psychiatry<br>• <b>Dr. Imran Siddiqui</b> — Neuropsychology<br><br>Would you like me to help you book a consultation?"
  if (t.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|greet|salam|assalam)\b/))
    return "Hello! 👋 Welcome to Askare Support. I'm here to help with anything — from booking appointments and billing questions to technical support. How can I assist you today?"
  if (t.match(/\b(thank|thanks|thx|appreciate|helpful)\b/))
    return "You're welcome! 😊 Is there anything else you'd like to know about Askare? You can also reach us at <b>care@askare.health</b> or <b>+92 21 3456 7890</b>."
  if (t.match(/\b(video|call|telemedicine|online)\b/))
    return "Video consultations are available through our platform! 📹 Each session is 30-45 minutes with end-to-end encryption. Would you like to schedule one now?"
  if (t.match(/\b(hours|timing|available|open|when)\b/))
    return "Our support channels are available:<br><br>• <b>Live Chat:</b> 24/7 (AI-powered)<br>• <b>Phone Support:</b> Mon–Sat, 9 AM – 8 PM PKT<br>• <b>Email:</b> Responses within 1 business day<br>• <b>In-Person:</b> Mon–Fri, 10 AM – 6 PM at DHA Phase 6"
  const fallbacks = [
    "Thank you for your message! Could you tell me more about what you need help with? I can assist with appointments, billing, technical issues, or general inquiries.",
    "I appreciate you reaching out! To give you the best assistance, could you provide a bit more detail?",
    "Thanks for contacting Askare Support! Could you share more details about your inquiry?"
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

// FAQ data from original
const FAQS = [
  { q: 'How secure is my patient data?', a: 'Your data is protected with AES-256 encryption at rest and TLS 1.3 in transit. Askare is fully HIPAA-compliant, with regular third-party security audits. All video consultations use end-to-end encryption, and your medical records are stored in SOC 2 Type II certified data centers located in Pakistan. Only your authorized healthcare provider can access your records.' },
  { q: 'Is this covered by insurance?', a: 'Askare partners with select insurance providers in Pakistan including EFU Life & Health, Jubilee Insurance, and Adamjee Insurance. Coverage depends on your specific plan. We recommend contacting your insurance provider to confirm cognitive healthcare coverage. For self-pay patients, consultation fees range from PKR 2,500 – 5,000, and video consultations are PKR 3,000 per session.' },
  { q: 'How do I book a video consultation?', a: 'You can book a video consultation directly from your Patient Dashboard. Simply navigate to the "Book Video Call" section, choose your preferred specialist and available time slot, and confirm your booking. You\'ll receive a confirmation email with a link to join the video session at the scheduled time. Each session is typically 30–45 minutes.' },
  { q: 'What is the AI Diagnosis tool?', a: 'Our AI-powered diagnostic tool uses advanced cognitive assessment algorithms to help identify patterns and potential conditions. It\'s designed to complement — not replace — professional clinical evaluation. The tool analyzes your responses to provide preliminary insights that your doctor can use during your consultation. Access it from the AI Diagnosis section in your dashboard.' },
]

export default function ContactPage() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMinimized, setChatMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatInitialized, setChatInitialized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const chatRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, isTyping])

  const openChat = () => {
    setChatOpen(true)
    setChatMinimized(false)
    setUnreadCount(0)
    if (!chatInitialized) {
      setChatInitialized(true)
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'agent', text: "Hi there! 👋 Welcome to <b>Askare Live Support</b>. I'm your virtual assistant.", time: getTime() }])
      }, 600)
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'agent', text: "I can help you with appointments, billing, technical questions, data privacy, or connect you with our medical team. What can I do for you today?", time: getTime() }])
      }, 2200)
    }
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const closeChat = () => { setChatOpen(false); setChatMinimized(false) }
  const minimizeChat = () => { setChatOpen(false); setChatMinimized(true); setUnreadCount(0) }
  const restoreChat = () => { setChatOpen(true); setChatMinimized(false); setUnreadCount(0); setTimeout(() => inputRef.current?.focus(), 100) }

  const sendMessage = (text) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { type: 'user', text: text.trim(), time: getTime() }])
    setChatInput('')
    setShowQuickReplies(false)
    const response = getAgentResponse(text)
    const delay = 1200
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { type: 'agent', text: response, time: getTime() }])
    }, delay)
  }

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(chatInput) }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && chatOpen) minimizeChat() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [chatOpen])

  return (
    <main className="pt-20 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Hero & Emergency Disclaimer */}
      <header className="mb-16 reveal">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium text-on-background tracking-tight mb-8">Connect with <span className="text-primary italic">Askare</span></h1>
        <div className="bg-tertiary-container/30 border-l-4 border-tertiary p-6 rounded-xl max-w-3xl">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-tertiary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            <div>
              <p className="font-bold text-on-tertiary-container text-lg">Medical Emergency Disclaimer</p>
              <p className="text-on-tertiary-container/80 text-sm leading-relaxed mt-1">
                Askare is not a crisis response service. If you or someone you know is in immediate danger or experiencing a medical emergency in Karachi, please call 1122 or visit the nearest hospital emergency room immediately.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8 reveal">
          <section className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
            <form className="space-y-6" onSubmit={e => {
              e.preventDefault()
              const form = e.target
              const name = form.querySelector('[data-field="name"]').value.trim()
              const email = form.querySelector('[data-field="email"]').value.trim()
              const message = form.querySelector('[data-field="message"]').value.trim()
              const errEl = form.querySelector('[data-error]')
              if (!name) { errEl.textContent = 'Please enter your full name.'; errEl.style.display = 'block'; return }
              if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; return }
              if (!message) { errEl.textContent = 'Please enter a message.'; errEl.style.display = 'block'; return }
              errEl.style.display = 'none'
              form.reset()
              const toast = document.createElement('div')
              toast.className = 'fixed bottom-8 right-8 z-[90] bg-primary text-on-primary px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm'
              toast.innerHTML = '<span class="material-symbols-outlined" style="font-variation-settings:\'FILL\' 1">check_circle</span>Message sent successfully!'
              document.body.appendChild(toast)
              setTimeout(() => toast.remove(), 3000)
            }}>
              <div data-error style={{ display: 'none' }} className="bg-error-container/10 text-error border border-error/20 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Full Name</label>
                  <input data-field="name" className="bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20" placeholder="Dr. Sarah Khan" type="text" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Email Address</label>
                  <input data-field="email" className="bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20" placeholder="sarah@example.com" type="email" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Subject</label>
                <select className="bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20">
                  <option>General Inquiry</option>
                  <option>Patient Support</option>
                  <option>Partner / Doctor Inquiry</option>
                  <option>Technical Assistance</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Message</label>
                <textarea data-field="message" className="bg-surface-container-low border-none rounded-lg p-3 text-on-surface focus:ring-2 focus:ring-primary/20" placeholder="How can we assist your cognitive health journey today?" rows="5"></textarea>
              </div>
              <button className="w-full bg-[#006977] text-white py-4 rounded-xl font-bold tracking-tight hover:opacity-90 transition-all" type="submit">Submit Message</button>
            </form>
          </section>

          {/* Chat Trigger */}
          <div className="bg-secondary-container/40 p-8 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-secondary-container/60 transition-all" onClick={openChat}>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#006977] relative">
                <span className="material-symbols-outlined text-3xl">forum</span>
                <span className="absolute top-0 right-0 w-3 h-3 bg-tertiary rounded-full border-2 border-white animate-pulse"></span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-on-secondary-container">Live Support Chat</h3>
                <p className="text-on-secondary-container/70 text-sm">Typical response time: 2 minutes</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#006977] group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-8 reveal reveal-delay-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-surface-container-high/50 p-6 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">mail</span></div>
              <div><p className="text-xs font-label uppercase tracking-widest text-on-surface-variant text-[10px]">EMAIL US</p><p className="font-semibold text-on-surface">care@askare.health</p></div>
            </div>
            <div className="bg-surface-container-high/50 p-6 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">call</span></div>
              <div><p className="text-xs font-label uppercase tracking-widest text-on-surface-variant text-[10px]">PHONE SUPPORT</p><p className="font-semibold text-on-surface">+92 21 3456 7890</p></div>
            </div>
            <div className="bg-surface-container-high/50 p-6 rounded-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">location_on</span></div>
              <div><p className="text-xs font-label uppercase tracking-widest text-on-surface-variant text-[10px]">KARACHI HQ</p><p className="font-semibold text-on-surface">Suite 402, Medical Heights, DHA Phase 6</p></div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-sm aspect-video relative group">
            <img className="w-full h-full object-cover" alt="Karachi office map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQS0RrFF5CSw5Z1ZTVMKZBjMiMEWY0078MSlAWlNB0cB46WALJM7M3OXrGQocPF7P22c-JowbyCImZcOformyReTIHp6rkCQma6myqEoEpyvGF97vHtLeRq-aUllsWUHxX46UFWtH3ugVfnfRn_SVhDaCGKmRX4VScd1OPhSsqphQsg74LXlymnDVLjS-KluLaGSDK7B0adPJPl9kQZmlKo8nHTvjfrLiNr98sYk9yK01IbM11bebVTdFANP_Ee0MDc0urTfm7_i4" />
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-all"></div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-on-surface">Clifton &amp; DHA Branch Map</span>
              <button className="text-[10px] font-bold text-primary flex items-center gap-1">GET DIRECTIONS <span className="material-symbols-outlined text-[12px]">north_east</span></button>
            </div>
          </div>

          {/* Partner CTA */}
          <div className="bg-[#006977] text-white p-8 rounded-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-2">Medical Partnerships</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Are you a licensed psychiatrist or neurologist looking to integrate AI-driven diagnostics into your practice? Let's collaborate.</p>
              <a className="inline-flex items-center gap-2 bg-white text-[#006977] px-6 py-2 rounded-full text-xs font-bold" href="#">Partner with Us <span className="material-symbols-outlined text-sm">trending_flat</span></a>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-10">
              <span className="material-symbols-outlined text-[12rem]">stethoscope</span>
            </div>
          </div>

          {/* FAQ */}
          <section>
            <h4 className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-4">COMMON QUESTIONS</h4>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="bg-surface-container-low rounded-lg overflow-hidden">
                  <button className="w-full p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-sm font-medium text-on-surface">{faq.q}</span>
                    <span className="material-symbols-outlined text-primary text-lg transition-transform duration-200" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>{openFaq === i ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Non-Emergency Note */}
      <div className="mt-20 max-w-3xl mx-auto text-center">
        <p className="text-on-surface-variant text-sm italic leading-relaxed flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-primary">info</span>
          Please note: For general health advice and non-urgent cognitive assessments, our AI-curated resources are available 24/7. Standard email response times are within 1 business day.
        </p>
      </div>

      {/* Live Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/15 z-[100] flex flex-col overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10" style={{ background: 'linear-gradient(135deg, #006977 0%, #008a9a 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">support_agent</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Askare Support</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-white/80 font-medium">Online Now</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={minimizeChat} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors" title="Minimize"><span className="material-symbols-outlined text-white text-lg">remove</span></button>
              <button onClick={closeChat} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors" title="Close"><span className="material-symbols-outlined text-white text-lg">close</span></button>
            </div>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
            {messages.map((m, i) => m.type === 'agent' ? (
              <div key={i} className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-[#006977] flex items-center justify-center shrink-0 mt-1"><span className="material-symbols-outlined text-white text-xs">support_agent</span></div>
                <div className="max-w-[75%]">
                  <div className="bg-surface-container-low rounded-2xl rounded-tl-sm px-4 py-2.5"><p className="text-sm text-on-surface leading-relaxed" dangerouslySetInnerHTML={{ __html: m.text }}></p></div>
                  <p className="text-[10px] text-outline mt-1 ml-1">{m.time}</p>
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-2 justify-end">
                <div className="max-w-[75%]">
                  <div className="bg-[#006977] rounded-2xl rounded-tr-sm px-4 py-2.5"><p className="text-sm text-white leading-relaxed">{m.text}</p></div>
                  <p className="text-[10px] text-outline mt-1 text-right mr-1">{m.time}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-[#006977] flex items-center justify-center shrink-0 mt-1"><span className="material-symbols-outlined text-white text-xs">support_agent</span></div>
                <div className="bg-surface-container-low rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#006977] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#006977] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#006977] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {showQuickReplies && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {['Book an appointment', 'Billing question', 'Data & Privacy', 'Technical issue'].map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary-container/20 hover:bg-primary-container/40 transition-colors">{q}</button>
              ))}
            </div>
          )}
          <div className="px-4 pb-4 pt-2 border-t border-outline-variant/10">
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <input ref={inputRef} value={chatInput} onChange={e => setChatInput(e.target.value)} type="text" placeholder="Type your message..." autoComplete="off" className="flex-1 bg-surface-container-low border-none rounded-xl py-3 pl-4 pr-10 text-sm text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/25 transition-all" />
              <button type="submit" disabled={!chatInput.trim()} className="w-10 h-10 rounded-xl bg-[#006977] hover:bg-[#005a66] text-white flex items-center justify-center transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"><span className="material-symbols-outlined text-lg">send</span></button>
            </form>
            <p className="text-[10px] text-outline mt-2 text-center">Powered by Askare AI · Available 24/7</p>
          </div>
        </div>
      )}

      {/* Minimized Chat Bubble */}
      {chatMinimized && !chatOpen && (
        <div className="fixed bottom-6 right-6 z-[100]">
          <button onClick={restoreChat} className="w-14 h-14 rounded-full bg-[#006977] text-white shadow-xl hover:scale-110 transition-transform flex items-center justify-center relative">
            <span className="material-symbols-outlined text-2xl">chat</span>
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
          </button>
        </div>
      )}
    </main>
  )
}
