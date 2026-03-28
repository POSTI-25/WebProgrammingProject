'use client';

import { useRouter } from 'next/navigation';
import Header from '../../components/header';
import '../../styles/about.css';

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <path
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'AI-First Approach',
    description:
      'Every feature is built on cutting-edge machine learning models trained specifically for resume optimization and ATS compatibility.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Privacy by Design',
    description:
      'Your resume data is encrypted end-to-end. We never store your documents longer than needed and never share them with third parties.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
        <path
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Built for Everyone',
    description:
      "Whether you're a fresh graduate or a seasoned executive, our AI adapts to your experience level and industry to deliver tailored results.",
  },
];

const stats = [
  { value: '250K+', label: 'Resumes Enhanced' },
  { value: '94%', label: 'Interview Rate Increase' },
  { value: '50+', label: 'ATS Systems Tested' },
  { value: '<5s', label: 'Average Scan Time' },
];

const team = [
  {
    name: 'Alex Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former Google ML engineer with a passion for democratizing career tools.',
  },
  {
    name: 'Sarah Mitchell',
    role: 'CTO & Co-Founder',
    bio: 'Built NLP pipelines at scale. Obsessed with parsing accuracy and ATS compatibility.',
  },
  {
    name: 'David Park',
    role: 'Head of Product',
    bio: '10 years in HR tech. Knows what recruiters look for before they do.',
  },
];

const About = () => {
  const router = useRouter();

  return (
    <div className="resume-enhancer">
    <Header />      

      {/* Hero */}
      <section className="about-hero">
        <div className="feat-hero-badge">
          <span className="feat-badge-dot" />
          Our Mission
        </div>

        <h1 className="about-hero-title">
          Making Every Resume
          <br />
          <span className="feat-hero-accent">Interview-Ready</span>
        </h1>

        <p className="about-hero-subtitle">
          We believe talent shouldn't be filtered out by formatting errors or
          missing keywords. ResumeAI exists to level the playing field.
        </p>
      </section>

      {/* Stats */}
      <section className="about-stats-section">
        <div className="about-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="about-stat-card">
              <span className="about-stat-value">{stat.value}</span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="about-values-section">
        <h2 className="feat-section-heading">What Drives Us</h2>
        <p className="feat-section-subheading">
          The principles behind every feature we build
        </p>

        <div className="about-values-grid">
          {values.map((value, i) => (
            <div key={i} className="about-value-card">
              <div className="feat-card-icon">{value.icon}</div>
              <h3 className="feat-card-title">{value.title}</h3>
              <p className="feat-card-desc">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team section removed (content was placeholder/fake) */}

      {/* CTA */}
      <section className="feat-cta-section">
        <div className="feat-cta-card">
          <h2 className="feat-cta-title">Join 250K+ Job Seekers</h2>
          <p className="feat-cta-desc">
            Upload your resume and see the difference AI-powered optimization makes.
          </p>

          <button
            className="re-upload-btn"
            onClick={() => router.push('/')}
          >
            Get Started — It's Free
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

export default About;
