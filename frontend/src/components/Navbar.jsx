import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Serv<span>Ease.</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>
        <Link to="/register" className="register-btn">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
