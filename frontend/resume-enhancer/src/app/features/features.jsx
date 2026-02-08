import Link from 'next/link';
import '../../styles/features.css';
import Header from '../../components/header.jsx';

const features = [
  {
    icon: (
      <img 
        src="/assets/ATS Compatibility Engine.png" 
        alt="Keyword Icon" 
        className="feat-icon-img"
      />
    ),
    title: 'ATS Compatibility Engine',
    description: 'Deep-scan your resume against 50+ applicant tracking systems. Our AI identifies formatting pitfalls, missing fields, and parsing errors that cause silent rejections.',
    stat: '50+',
    statLabel: 'ATS Systems',
  },
  {
    icon: (
      <img 
        src="/assets/Smart Keyword Optimization.png" 
        alt="Keyword Icon" 
        className="feat-icon-img"
      />
    ),
    title: 'Smart Keyword Optimization',
    description: 'Cross-reference your resume with industry-specific keyword databases. Automatically inject high-impact terms while maintaining natural, human-readable language.',
    stat: '10K+',
    statLabel: 'Keywords',
  },
  {
    icon: (
      <img 
        src="/assets/Intelligent Formatting.png" 
        alt="Keyword Icon" 
        className="feat-icon-img"
      />
    ),
    title: 'Intelligent Formatting',
    description: 'Restructure your resume layout for optimal readability. Clean hierarchy, consistent spacing, and ATS-friendly structure - all handled automatically.',
    stat: '100%',
    statLabel: 'Parse Rate', 
  },
  {
    icon: (
      <img 
        src="/assets/Real-Time AI Analysis.png" 
        alt="Keyword Icon" 
        className="feat-icon-img"
      />
    ),
    title: 'Real-Time AI Analysis',
    description: 'Get instant feedback as our AI scans your document. Watch live as improvements are identified, scored, and applied - no waiting, no guesswork.',
    stat: '<5s',
    statLabel: 'Scan Time',
  },
  {
    icon: (
      <img 
        src="/assets/Achievement Amplifier.png" 
        alt="Keyword Icon" 
        className="feat-icon-img"
      />
    ),
    title: 'Achievement Amplifier',
    description: 'Transform vague responsibilities into quantified, impact-driven bullet points. Our AI rewrites your experience with powerful action verbs and measurable outcomes.',
    stat: '3x',
    statLabel: 'Impact Boost',
  },
  {
    icon: (
      <img 
        src="/assets/Performance Scoring.png" 
        alt="Keyword Icon" 
        className="feat-icon-img"
      />
    ),
    title: 'Performance Scoring',
    description: 'Get a comprehensive score breakdown across multiple dimensions - ATS compatibility, keyword density, formatting, and impact language - with actionable improvement paths.',
    stat: '88+',
    statLabel: 'Avg Score',
  },
];

const workflow = [
  { step: '01', title: 'Upload', description: 'Drop your PDF or DOCX resume into our secure uploader.' },
  { step: '02', title: 'Analyze', description: 'Our AI engine scans structure, keywords, and formatting in real-time.' },
  { step: '03', title: 'Enhance', description: 'Review highlighted improvements and an optimized version side-by-side.' },
  { step: '04', title: 'Download', description: 'Export your enhanced resume - ready to land interviews.' },
];

const Features = () => {
  return (
    <div className="resume-enhancer">
    <div className='features-bg'>

      <Header />

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
          From ATS optimization to achievement rewriting - our AI handles every detail
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
          <Link href="/" className="re-upload-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              <path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3" />
            </svg>
            Get Started - It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="feat-footer">
        <p className="feat-footer-text">© 2026 ResumeAI. Built to get you hired.</p>
      </footer>
    </div>
    </div>
  );
};

export default Features;
