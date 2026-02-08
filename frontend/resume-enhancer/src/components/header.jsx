import Link from "next/link";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="main-header">

      <div className="logo">
        <Link href="/">
          <img
            src="/assets/logo-removebg-preview.png"
            alt="ResumeAI Logo"
            className="logo-img"
          />
        </Link>
      </div>

      <nav className="nav-links">
        <Link href="/features">Features</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/about">About</Link>
      </nav>

    </header>
  );
}
