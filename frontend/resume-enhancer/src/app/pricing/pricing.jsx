
'use client';

import { useRouter } from 'next/navigation';
import Header from '../../components/header';
import '../../styles/pricing.css';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out ResumeAI on a single resume.',
    features: [
      '1 resume scan per month',
      'Basic ATS compatibility check',
      'Formatting analysis',
      'Overall score breakdown',
      'PDF export',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For active job seekers who need every advantage.',
    features: [
      'Unlimited resume scans',
      'Advanced ATS optimization',
      'Smart keyword injection',
      'Achievement rewriting',
      'Side-by-side comparison',
      'DOCX & PDF export',
      'Priority processing',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams, career coaches, and staffing agencies.',
    features: [
      'Everything in Pro',
      'Bulk resume processing',
      'Team dashboard & analytics',
      'Custom branding',
      'API access',
      'Dedicated account manager',
      'SSO & compliance',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  { 
    q: 'Can I cancel anytime?', 
    a: 'Yes - no contracts, no cancellation fees. You can downgrade or cancel your plan at any time from your account settings.' 
  },
  { 
    q: 'What file formats are supported?', 
    a: 'We support PDF and DOCX uploads. Enhanced resumes can be exported in both formats.' 
  },
  { 
    q: 'Is my data secure?', 
    a: 'Absolutely. All uploads are encrypted end-to-end. We never store your resume longer than necessary and never share it with third parties.' 
  },
  { 
    q: 'How does the free trial work?', 
    a: "The Pro plan includes a 7-day free trial. No credit card required to start - upgrade only when you're ready." 
  },
];

const Pricing = () => {
  const router = useRouter();

  return (
    <div className="resume-enhancer">
      <Header />

      {/* Hero */}
      <section className="pricing-hero">
        <div className="feat-hero-badge">
          <span className="feat-badge-dot" />
          Simple Pricing
        </div>

        <h1 className="pricing-hero-title">
          Plans That Scale<br />
          <span className="feat-hero-accent">With Your Ambition</span>
        </h1>

        <p className="pricing-hero-subtitle">
          Start free. Upgrade when you're ready. No hidden fees, no surprises.
        </p>
      </section>

      {/* Plans Grid */}
      <section className="pricing-plans-section">
        <div className="pricing-plans-grid">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`pricing-plan-card ${plan.popular ? 'pricing-plan-card--popular' : ''}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {plan.popular && (
                <div className="pricing-popular-badge">
                  Most Popular
                </div>
              )}

              <h3 className="pricing-plan-name">{plan.name}</h3>

              <div className="pricing-plan-price">
                <span className="pricing-price-value">{plan.price}</span>
                {plan.period && (
                  <span className="pricing-price-period">
                    {plan.period}
                  </span>
                )}
              </div>

              <p className="pricing-plan-desc">{plan.description}</p>

              <ul className="pricing-feature-list">
                {plan.features.map((feat, j) => (
                  <li key={j} className="pricing-feature-item">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      className="pricing-check-icon"
                    >
                      <path
                        d="M20 6L9 17l-5-5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <button
                className={plan.popular ? 're-upload-btn' : 'pricing-cta-btn'}
                onClick={() => router.push('/')}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="pricing-faq-section">
        <h2 className="feat-section-heading">
          Frequently Asked Questions
        </h2>

        <p className="feat-section-subheading">
          Everything you need to know before getting started
        </p>

        <div className="pricing-faq-grid">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="pricing-faq-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h4 className="pricing-faq-q">{faq.q}</h4>
              <p className="pricing-faq-a">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="feat-cta-section">
        <div className="feat-cta-card">
          <h2 className="feat-cta-title">
            Ready to Land More Interviews?
          </h2>

          <p className="feat-cta-desc">
            Try ResumeAI free - no credit card required.
          </p>

          <button
            className="re-upload-btn"
            onClick={() => router.push('/')}
          >
            Get Started - It's Free
          </button>
        </div>
      </section>

      <footer className="feat-footer">
        <p className="feat-footer-text">
          © 2026 ResumeAI. Built to get you hired.
        </p>
      </footer>
    </div>
  );
};

export default Pricing;