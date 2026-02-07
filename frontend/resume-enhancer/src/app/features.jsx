import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/features.css';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'ATS Compatibility Engine',
    description: 'Deep-scan your resume against 50+ applicant tracking systems. Our AI identifies formatting pitfalls, missing fields, and parsing errors that cause silent rejections.',
    stat: '50+',
    statLabel: 'ATS Systems',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <path d="M7 7h.01M7 3h5a4 4 0 010 8h-1m4 4h.01M17 21h-5a4 4 0 010-8h1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Smart Keyword Optimization',
    description: 'Cross-reference your resume with industry-specific keyword databases. Automatically inject high-impact terms while maintaining natural, human-readable language.',
    stat: '10K+',
    statLabel: 'Keywords',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Intelligent Formatting',
    description: 'Restructure your resume layout for optimal readability. Clean hierarchy, consistent spacing, and ATS-friendly structure — all handled automatically.',
    stat: '100%',
    statLabel: 'Parse Rate',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Real-Time AI Analysis',
    description: 'Get instant feedback as our AI scans your document. Watch live as improvements are identified, scored, and applied — no waiting, no guesswork.',
    stat: '<5s',
    statLabel: 'Scan Time',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Achievement Amplifier',
    description: 'Transform vague responsibilities into quantified, impact-driven bullet points. Our AI rewrites your experience with powerful action verbs and measurable outcomes.',
    stat: '3x',
    statLabel: 'Impact Boost',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Performance Scoring',
    description: 'Get a comprehensive score breakdown across multiple dimensions — ATS compatibility, keyword density, formatting, and impact language — with actionable improvement paths.',
    stat: '88+',
    statLabel: 'Avg Score',
  },
];

const workflow = [
  { step: '01', title: 'Upload', description: 'Drop your PDF or DOCX resume into our secure uploader.' },
  { step: '02', title: 'Analyze', description: 'Our AI engine scans structure, keywords, and formatting in real-time.' },
  { step: '03', title: 'Enhance', description: 'Review highlighted improvements and an optimized version side-by-side.' },
  { step: '04', title: 'Download', description: 'Export your enhanced resume — ready to land interviews.' },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="resume-enhancer">
      <header className="re-header">
        <div className="re-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="re-logo-icon">RE</div>
          <span className="re-logo-text">ResumeAI</span>
        </div>
        <nav className="re-nav">
          <a href="/features" className="re-nav-link re-nav-link--active">Features</a>
          <a href="#" className="re-nav-link">Pricing</a>
          <a href="#" className="re-nav-link">About</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="feat-hero">
        <div className="feat-hero-badge">
          <span className="feat-badge-dot" />
          Powered by Advanced AI
        </div>
        <h1 className="feat-hero-title">
          Everything You Need to<br />
          <span className="feat-hero-accent">Land the Interview</span>
        </h1>
        <p className="feat-hero-subtitle">
          From ATS optimization to achievement rewriting — our AI handles every detail
          so your resume speaks louder than the competition.
        </p>
      </section>

      {/* Features Grid */}
      <section className="feat-grid-section">
        <div className="feat-grid">
          {features.map((feature, index) => (
            <div key={index} className="feat-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feat-card-header">
                <div className="feat-card-icon">
                  {feature.icon}
                </div>
                <div className="feat-card-stat">
                  <span className="feat-stat-value">{feature.stat}</span>
                  <span className="feat-stat-label">{feature.statLabel}</span>
                </div>
              </div>
              <h3 className="feat-card-title">{feature.title}</h3>
              <p className="feat-card-desc">{feature.description}</p>
              <div className="feat-card-shimmer" />
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="feat-workflow-section">
        <h2 className="feat-section-heading">How It Works</h2>
        <p className="feat-section-subheading">Four steps from upload to optimized resume</p>
        <div className="feat-workflow">
          {workflow.map((item, index) => (
            <div key={index} className="feat-workflow-step" style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="feat-step-number">{item.step}</div>
              <div className="feat-step-connector" />
              <h3 className="feat-step-title">{item.title}</h3>
              <p className="feat-step-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="feat-cta-section">
        <div className="feat-cta-card">
          <h2 className="feat-cta-title">Ready to Optimize?</h2>
          <p className="feat-cta-desc">
            Upload your resume and get an AI-enhanced version in under 30 seconds.
          </p>
          <button className="re-upload-btn" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              <path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3" />
            </svg>
            Get Started — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="feat-footer">
        <p className="feat-footer-text">© 2026 ResumeAI. Built to get you hired.</p>
      </footer>
    </div>
  );
};

export default Features;
