import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <a href="/">
          {/* Replace with your logo image path */}
          <img src="/public/assets/logo.png" alt="Company Logo" />
          <span className="logo-text">MyBrand</span>
        </a>
      </div>
      <nav className="navbar-links">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">Features</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/contact">About</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;