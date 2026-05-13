export default function TermsOfUsePage() {
  return (
    <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-medium text-on-background tracking-tight mb-4">Terms of Use</h1>
        <p className="text-on-surface-variant">Last updated: April 18, 2026</p>
      </header>
      <div className="space-y-10">
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">1. Acceptance of Terms</h2>
          <p className="text-on-surface-variant leading-relaxed">By accessing or using the Askare Digital Healthcare platform ("Platform"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Platform. These terms apply to all users, including patients, healthcare professionals, and visitors.</p>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">2. Description of Services</h2>
          <div className="space-y-4 text-on-surface-variant leading-relaxed">
            <p>Askare provides the following services:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong className="text-on-surface">AI Symptom Analysis:</strong> Automated preliminary health assessments based on symptoms you describe. These are for informational purposes only and do not constitute medical advice.</li>
              <li><strong className="text-on-surface">Video Consultations:</strong> Secure video calls connecting you with PMDC-certified healthcare professionals based in Karachi.</li>
              <li><strong className="text-on-surface">Medical Records:</strong> Digital storage and management of your health records and consultation history.</li>
              <li><strong className="text-on-surface">E-Prescriptions:</strong> Digital prescriptions issued by verified doctors during consultations.</li>
            </ul>
          </div>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">3. Medical Disclaimer</h2>
          <div className="bg-tertiary-container/20 border-l-4 border-tertiary p-4 rounded-lg mb-4">
            <p className="text-on-tertiary-container font-semibold text-sm">Important: Please read this section carefully.</p>
          </div>
          <div className="space-y-4 text-on-surface-variant leading-relaxed">
            <p>Askare's AI-powered tools provide preliminary health information only and are <strong className="text-on-surface">not a substitute for professional medical advice, diagnosis, or treatment.</strong> Always consult a qualified healthcare provider for medical concerns.</p>
            <p>In case of a medical emergency, call 1122 or visit the nearest hospital emergency room immediately. Askare is not an emergency medical service.</p>
          </div>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">4. User Accounts</h2>
          <ul className="space-y-3 text-on-surface-variant leading-relaxed list-disc pl-5">
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials</li>
            <li>You must be at least 18 years old to create an account (minors require parental consent)</li>
            <li>You agree to notify us immediately of any unauthorized use of your account</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
          </ul>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">5. Payment Terms</h2>
          <div className="space-y-4 text-on-surface-variant leading-relaxed">
            <p>Consultation fees are displayed before booking and are charged upon confirmation. We accept payments via credit/debit cards and cryptocurrency (BTC, ETH, USDT).</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>All fees are in Pakistani Rupees (PKR) unless otherwise stated</li>
              <li>Refunds are available if the consultation is cancelled at least 2 hours before the scheduled time</li>
              <li>No-show patients may be charged the full consultation fee</li>
              <li>We do not store complete payment card details on our servers</li>
            </ul>
          </div>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">6. Prohibited Conduct</h2>
          <ul className="space-y-3 text-on-surface-variant leading-relaxed list-disc pl-5">
            <li>Providing false or misleading information during registration or consultations</li>
            <li>Impersonating another person or healthcare professional</li>
            <li>Attempting to access other users' accounts or medical records</li>
            <li>Using the Platform for any unlawful purpose</li>
            <li>Recording video consultations without consent of all parties</li>
            <li>Interfering with or disrupting Platform services</li>
          </ul>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">7. Intellectual Property</h2>
          <p className="text-on-surface-variant leading-relaxed">All content, features, and functionality of the Askare Platform — including text, graphics, logos, icons, AI models, and software — are owned by Askare and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">8. Limitation of Liability</h2>
          <p className="text-on-surface-variant leading-relaxed">To the maximum extent permitted by law, Askare shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. This includes but is not limited to damages arising from reliance on AI-generated health information, service interruptions, or unauthorized access to your data.</p>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">9. Governing Law</h2>
          <p className="text-on-surface-variant leading-relaxed">These Terms of Use shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts located in Karachi, Sindh.</p>
        </section>
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface mb-4">10. Contact Us</h2>
          <p className="text-on-surface-variant leading-relaxed">If you have questions about these Terms of Use, please contact us at:</p>
          <div className="mt-4 space-y-2 text-on-surface-variant">
            <p><strong className="text-on-surface">Email:</strong> legal@askare.health</p>
            <p><strong className="text-on-surface">Address:</strong> Suite 402, Medical Heights, DHA Phase 6, Karachi</p>
            <p><strong className="text-on-surface">Phone:</strong> +92 21 3456 7890</p>
          </div>
        </section>
      </div>
    </main>
  )
}
