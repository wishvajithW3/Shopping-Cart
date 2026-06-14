import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand-area">
          <Link to="/" className="footer-brand">
            <span className="brand-icon">🛒</span>
            <span>FreshCart</span>
          </Link>

          <p>
            FreshCart is a modern online shopping cart application for browsing
            fresh groceries, adding items to cart, and reviewing orders before
            checkout.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Instagram">
              ig
            </a>
            <a href="#" aria-label="Twitter">
              x
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-links">
          <h4>Categories</h4>
          <a href="/#products">Vegetables</a>
          <a href="/#products">Fruits</a>
          <a href="/#products">Cakes</a>
          <a href="/#products">Biscuits</a>
        </div>

        <div className="footer-links">
          <h4>Contact</h4>
          <p>Malabe, Sri Lanka</p>
          <p>support@freshcart.com</p>
          <p>+94 71 234 5678</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} FreshCart. All rights reserved.</p>
        <p>Built with MERN Stack</p>
      </div>
    </footer>
  );
}