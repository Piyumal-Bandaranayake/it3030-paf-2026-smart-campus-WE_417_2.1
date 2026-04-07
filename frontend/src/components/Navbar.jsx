import { useState, useEffect } from "react";
import { Building2, Menu, X } from "lucide-react";
import "./navbar.css";

const navLinks = ["Home", "Resources", "Bookings", "Maintenance Tickets"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        {/* Logo */}
        <a href="/" className="navbar__logo">
          <span className="navbar__logo-icon">
            <Building2 size={18} color="white" strokeWidth={2} />
          </span>
          Smart Campus Hub
        </a>

        {/* Desktop Links */}
        <ul className="navbar__links">
          {navLinks.map((item) => (
            <li key={item}>
              <a href="#">{item}</a>
            </li>
          ))}
          <li>
            <a href="#" className="navbar__login">Login</a>
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar__mobile${menuOpen ? " navbar__mobile--open" : ""}`}>
        {navLinks.map((item) => (
          <a key={item} href="#" onClick={() => setMenuOpen(false)}>
            {item}
          </a>
        ))}
        <a href="#" className="navbar__mobile-login" onClick={() => setMenuOpen(false)}>
          Login
        </a>
      </div>
    </>
  );
}