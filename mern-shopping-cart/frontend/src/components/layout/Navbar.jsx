import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon">🛒</span>
        <span>FreshCart</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/cart" className="cart-link">
          Cart <span>{cart.totalItems || 0}</span>
        </NavLink>

        {user?.role === "admin" && (
          <>
            <NavLink to="/admin/products">Products</NavLink>
            <NavLink to="/admin/categories">Categories</NavLink>
          </>
        )}

        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <Link to="/register" className="nav-cta">
              Register
            </Link>
          </>
        ) : (
          <div className="user-area">
            <span className="user-chip">{user.name?.charAt(0) || "U"}</span>
            <button onClick={logout} className="logout">
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;