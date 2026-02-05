import "../header.css";

export default function Header() {
  return (
    <header className="main-header">

      {/* Logo */}
      <div className="logo">
        <img
          src="/assets/logo.png"
          alt="ResumeAI Logo"
          className="logo-img"
        />
        <span className="logo-text"></span>
      </div>

      {/* Navbar */}
      <nav className="nav-links">
        <a href="#">Features</a>
        <a href="#">Pricing</a>
        <a href="#">About</a>
      </nav>

    </header>
  );
}
