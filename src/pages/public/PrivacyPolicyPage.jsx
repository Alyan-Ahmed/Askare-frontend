export default function PrivacyPolicyPage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-medium text-on-background tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-on-surface-variant">Last updated: April 18, 2026</p>
      </header>
      <div className="space-y-10">
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">1. Introduction</h2>
          <p className="text-on-surface-variant leading-relaxed">Askare Digital Healthcare ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, including our website, AI diagnosis tools, and video consultation services. By using Askare, you consent to the practices described in this policy.</p>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">2. Information We Collect</h2>
          <div className="space-y-4 text-on-surface-variant leading-relaxed">
            <p><strong className="text-on-surface">Personal Information:</strong> Name, email address, phone number, date of birth, and profile photo when you create an account.</p>
            <p><strong className="text-on-surface">Medical Information:</strong> Symptoms you describe, AI diagnosis results, consultation notes, prescriptions, and medical records shared during video consultations.</p>
            <p><strong className="text-on-surface">Payment Information:</strong> Billing details and transaction records processed through our secure payment partners.</p>
            <p><strong className="text-on-surface">Usage Data:</strong> Device information, IP address, browser type, pages visited, and interaction patterns to improve our services.</p>
          </div>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">3. How We Use Your Information</h2>
          <ul className="space-y-3 text-on-surface-variant leading-relaxed list-disc pl-5">
            <li>To provide AI-powered symptom analysis and diagnostic suggestions</li>
            <li>To facilitate video consultations with verified healthcare professionals</li>
            <li>To maintain and update your medical records securely</li>
            <li>To process payments and send appointment reminders</li>
            <li>To improve our AI models and platform functionality</li>
            <li>To comply with legal and regulatory requirements in Pakistan</li>
          </ul>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">4. Data Security</h2>
          <p className="text-on-surface-variant leading-relaxed">We implement industry-standard security measures including end-to-end encryption for video consultations, encrypted data storage, and secure access controls. Our platform is designed to comply with HIPAA guidelines and Pakistan's data protection regulations. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">5. Data Sharing</h2>
          <div className="space-y-4 text-on-surface-variant leading-relaxed">
            <p>We do not sell your personal or medical information. We may share your data with:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Verified healthcare professionals you consult with on the platform</li>
              <li>Payment processors to complete transactions</li>
              <li>Law enforcement or regulatory bodies when required by law</li>
              <li>Service providers who help us operate the platform (under strict confidentiality agreements)</li>
            </ul>
          </div>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">6. Your Rights</h2>
          <ul className="space-y-3 text-on-surface-variant leading-relaxed list-disc pl-5">
            <li>Access, update, or delete your personal information through your account settings</li>
            <li>Request a copy of all data we hold about you</li>
            <li>Opt out of non-essential communications</li>
            <li>Withdraw consent for data processing at any time</li>
            <li>File a complaint with the relevant data protection authority</li>
          </ul>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">7. Cookies</h2>
          <p className="text-on-surface-variant leading-relaxed">We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can manage cookie preferences through your browser settings. Essential cookies required for platform functionality cannot be disabled.</p>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">8. Contact Us</h2>
          <p className="text-on-surface-variant leading-relaxed">If you have questions about this Privacy Policy, please contact us at:</p>
          <div className="mt-4 space-y-2 text-on-surface-variant">
            <p><strong className="text-on-surface">Email:</strong> privacy@askare.health</p>
            <p><strong className="text-on-surface">Address:</strong> Suite 402, Medical Heights, DHA Phase 6, Karachi</p>
            <p><strong className="text-on-surface">Phone:</strong> +92 21 3456 7890</p>
          </div>
        </section>
      </div>
    </main>
  )
}
