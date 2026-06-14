import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className="container empty-state page-empty">
        <h2>Please login to view your cart</h2>
        <p>Your cart is saved safely after you login.</p>
        <Link to="/login" className="primary-link">
          Login Now
        </Link>
      </main>
    );
  }

  if (!cart.items?.length) {
    return (
      <main className="container empty-state page-empty">
        <h2>Your cart is empty</h2>
        <p>Add some fresh products and come back here.</p>
        <Link to="/" className="primary-link">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container cart-page">
      <div className="page-title">
        <span className="eyebrow">Shopping Cart</span>
        <h1>Your Cart</h1>
      </div>

      <section className="cart-layout">
        <div className="cart-list">
          {cart.items.map((item) => (
            <article className="cart-item" key={item.product._id}>
              <img
                src={item.product.image}
                alt={item.product.name}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop";
                }}
              />

              <div className="cart-details">
                <span>{item.product.category?.name || "Product"}</span>
                <h3>{item.product.name}</h3>
                <p>Rs. {Number(item.product.price || 0).toFixed(2)}</p>

                <label>
                  Quantity
                  <input
                    type="number"
                    min="1"
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.product._id, e.target.value).catch(
                        (error) =>
                          alert(error.response?.data?.message || "Update failed")
                      )
                    }
                  />
                </label>
              </div>

              <div className="cart-price">
                <strong>
                  Rs. {(item.product.price * item.quantity).toFixed(2)}
                </strong>
                <button
                  className="danger outline"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary">
          <span className="eyebrow">Summary</span>
          <h2>Order Summary</h2>

          <div className="summary-line">
            <span>Total Items</span>
            <strong>{cart.totalItems}</strong>
          </div>

          <div className="summary-line grand-total">
            <span>Total</span>
            <strong>Rs. {cart.totalPrice?.toFixed(2)}</strong>
          </div>

          <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>

          <button className="danger outline" onClick={clearCart}>
            Clear Cart
          </button>
        </aside>
      </section>
    </main>
  );
};

export default Cart;