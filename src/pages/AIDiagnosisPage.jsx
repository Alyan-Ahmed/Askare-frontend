import { useState, useRef, useEffect } from 'react'

const AI_RESPONSES = [
  "Thank you for sharing that information. I'd like to ask a few follow-up questions to better understand your symptoms. When did you first notice this change?",
  "I understand your concern. These symptoms can have several possible causes, so a specialist consultation would be the safest next step if they continue.",
  "Based on your description, this sounds within the range of common conditions, but only a qualified clinician can provide a diagnosis. I can help you decide which specialist to consult.",
  "That is helpful context. Have you noticed any other symptoms recently, such as changes in appetite, sleep, energy, or pain level?",
]

const INITIAL_MESSAGES = [
  {
    role: 'ai',
    text: "Hello. I'm here to help you understand your symptoms. How are you feeling today? Please try to be as specific as possible about any pain, duration, or recent changes.",
    time: '09:30',
  },
  {
    role: 'user',
    text: "I've had a persistent dull ache in my lower back for about three days now. It gets worse when I sit at my desk for a long time.",
    time: '09:31',
  },
  {
    role: 'ai',
    text: 'I understand. Lower back pain related to sitting is common. Does the pain radiate down your legs, or do you feel any numbness, tingling, or weakness?',
    time: '09:31',
  },
]

function formatFileSize(size) {
  const kb = size / 1024
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(1)} KB`
}

export default function AIDiagnosisPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [attachMenuOpen, setAttachMenuOpen] = useState(false)
  const [attachment, setAttachment] = useState(null)
  const chatRef = useRef(null)
  const fileInputRef = useRef(null)
  const attachRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, isTyping])

  useEffect(() => {
    const handler = (e) => {
      if (attachRef.current && !attachRef.current.contains(e.target)) setAttachMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const resizeInput = (target = inputRef.current) => {
    if (!target) return
    target.style.height = 'auto'
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`
  }

  const pickFile = (accept, icon, useCamera = false) => {
    const inputEl = fileInputRef.current
    if (!inputEl) return
    inputEl.accept = accept
    inputEl.dataset.icon = icon
    if (useCamera) inputEl.setAttribute('capture', 'environment')
    else inputEl.removeAttribute('capture')
    setAttachMenuOpen(false)
    inputEl.click()
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const hintedIcon = e.target.dataset.icon || 'description'
    const icon = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'picture_as_pdf' : hintedIcon
    setAttachment({ name: file.name, size: formatFileSize(file.size), icon })
  }

  const removeAttachment = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
    setAttachment(null)
  }

  const sendMessage = () => {
    const text = input.trim()
    if (!text && !attachment) return

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', text, attachment, time }])
    setInput('')
    removeAttachment()
    resizeInput()
    setIsTyping(true)

    setTimeout(() => {
      const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => [...prev, { role: 'ai', text: response, time: replyTime }])
      setIsTyping(false)
    }, 1500 + Math.random() * 1500)
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden animate-fade-in">
      <header className="hidden md:flex justify-between items-center px-12 py-8 bg-surface-bright/80 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary editorial-pulse w-fit">Live Diagnostic Session</span>
          <h2 className="text-3xl font-medium text-on-surface font-headline">Describe your symptoms</h2>
        </div>
      </header>

      <section ref={chatRef} className="flex-1 overflow-y-auto px-6 md:px-12 py-6 space-y-10 max-w-4xl mx-auto w-full no-scrollbar">
        <div className="bg-tertiary-container/10 p-6 rounded-2xl border-l-4 border-tertiary flex items-start gap-4">
          <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: '"FILL" 1' }}>warning</span>
          <div>
            <p className="text-sm font-semibold text-on-tertiary-container">Medical Disclaimer</p>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
              This AI assistant provides information for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a medical emergency, please call your local emergency services immediately.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-4 max-w-2xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-secondary' : 'bg-primary-container'}`}>
                <span className={`material-symbols-outlined text-sm ${m.role === 'user' ? 'text-on-secondary' : 'text-on-primary-container'}`} style={m.role === 'ai' ? { fontVariationSettings: '"FILL" 1' } : undefined}>
                  {m.role === 'user' ? 'person' : 'smart_toy'}
                </span>
              </div>
              <div className={`p-6 rounded-2xl shadow-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-on-primary rounded-tr-none' : 'bg-surface-container-lowest text-on-surface rounded-tl-none'}`}>
                {m.text && <p>{m.text}</p>}
                {m.attachment && (
                  <div className={`mt-3 rounded-xl px-3 py-2 flex items-center gap-2 text-xs ${m.role === 'user' ? 'bg-on-primary/10 text-on-primary' : 'bg-surface-container-low text-on-surface'}`}>
                    <span className="material-symbols-outlined text-base">{m.attachment.icon}</span>
                    <span className="font-semibold truncate">{m.attachment.name}</span>
                  </div>
                )}
                <span className={`block text-[10px] mt-2 ${m.role === 'user' ? 'text-on-primary/60' : 'text-outline'}`}>{m.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 max-w-2xl">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-container text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>smart_toy</span>
              </div>
              <div className="bg-surface-container-lowest p-6 rounded-2xl rounded-tl-none shadow-sm text-on-surface leading-relaxed">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="text-sm text-secondary ml-2">Analyzing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="sticky bottom-0 bg-surface-bright/95 backdrop-blur-md border-t border-outline-variant/10 px-6 md:px-12 py-4">
        <div className="max-w-4xl mx-auto">
          {attachment && (
            <div className="mb-3 p-3 bg-surface-container-low rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">{attachment.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{attachment.name}</p>
                <p className="text-[10px] text-secondary">{attachment.size}</p>
              </div>
              <button onClick={removeAttachment} className="p-1 rounded-full hover:bg-surface-container-high transition-colors" type="button">
                <span className="material-symbols-outlined text-sm text-secondary">close</span>
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="relative" ref={attachRef}>
              <button onClick={() => setAttachMenuOpen(open => !open)} className="w-12 h-12 rounded-xl bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center transition-colors" type="button">
                <span className="material-symbols-outlined text-primary">attach_file</span>
              </button>
              {attachMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 overflow-hidden w-52 z-50">
                  <button onClick={() => pickFile('image/*', 'image')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-left" type="button">
                    <span className="material-symbols-outlined text-primary text-[20px]">image</span>
                    <span className="text-sm font-medium text-on-surface">Upload Image</span>
                  </button>
                  <button onClick={() => pickFile('.pdf,.doc,.docx', 'description')} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-left" type="button">
                    <span className="material-symbols-outlined text-tertiary text-[20px]">description</span>
                    <span className="text-sm font-medium text-on-surface">Upload Document</span>
                  </button>
                  <button onClick={() => pickFile('image/*', 'photo_camera', true)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-left" type="button">
                    <span className="material-symbols-outlined text-secondary text-[20px]">photo_camera</span>
                    <span className="text-sm font-medium text-on-surface">Take Photo</span>
                  </button>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); resizeInput(e.target) }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                rows="1"
                placeholder="Describe your symptoms..."
                className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl px-4 py-3 pr-12 text-sm text-on-surface resize-none overflow-hidden no-scrollbar focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                style={{ maxHeight: 120, resize: 'none', overflowY: 'hidden' }}
              ></textarea>
            </div>

            <button onClick={sendMessage} disabled={!input.trim() && !attachment} className="w-12 h-12 rounded-xl bg-primary hover:bg-primary-dim text-on-primary flex items-center justify-center transition-colors shadow-md shadow-primary/20 active:scale-95 disabled:opacity-50" type="button">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>send</span>
            </button>
          </div>
          <p className="text-[10px] text-outline text-center mt-2">AI analysis is not a substitute for professional medical advice. Press Shift+Enter for a new line.</p>
        </div>
      </div>
    </div>
  )
}
