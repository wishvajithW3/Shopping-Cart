import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const cartContext = useCart();
  const navigate = useNavigate();

  const cartItems =
    cartContext.cartItems ||
    cartContext.items ||
    cartContext.cart?.items ||
    [];

  const clearCart = cartContext.clearCart;

  const cartTotal =
    cartContext.cartTotal ||
    cartContext.total ||
    cartItems.reduce((sum, item) => {
      const product = item.product || item;
      return sum + Number(product.price || 0) * Number(item.quantity || 1);
    }, 0);

  const handleConfirmOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty");
      navigate("/");
      return;
    }

    const confirmOrder = window.confirm("Do you want to confirm this order?");
    if (!confirmOrder) return;

    try {
      if (clearCart) await clearCart();

      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      alert("Order confirmed, but cart clear failed. Please refresh.");
      navigate("/");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="container empty-state page-empty">
        <h2>Checkout Summary</h2>
        <p>Your cart is empty.</p>
        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </main>
    );
  }

  return (
    <main className="container checkout-container">
      <div className="page-title">
        <span className="eyebrow">Final Step</span>
        <h1>Checkout Summary</h1>
        <p>Review your order before confirming.</p>
      </div>

      <div className="checkout-card">
        <div className="checkout-table">
          <div className="checkout-row checkout-title">
            <span>Product</span>
            <span>Price</span>
            <span>Qty</span>
            <span>Subtotal</span>
          </div>

          {cartItems.map((item) => {
            const product = item.product || item;
            const quantity = item.quantity || 1;
            const subtotal = Number(product.price || 0) * Number(quantity);

            return (
              <div className="checkout-row" key={product._id || item._id}>
                <div className="checkout-product">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop";
                    }}
                  />

                  <div>
                    <h4>{product.name}</h4>
                    <p>{product.category?.name || product.category || "Category"}</p>
                  </div>
                </div>

                <span>Rs. {Number(product.price || 0).toFixed(2)}</span>
                <span>{quantity}</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        <aside className="checkout-total-box">
          <span className="eyebrow">Payment Future Scope</span>
          <h2>Order Total</h2>

          <div className="summary-line">
            <span>Total Items</span>
            <strong>
              {cartItems.reduce(
                (total, item) => total + Number(item.quantity || 1),
                0
              )}
            </strong>
          </div>

          <div className="summary-line grand-total">
            <span>Grand Total</span>
            <strong>Rs. {Number(cartTotal || 0).toFixed(2)}</strong>
          </div>

          <button className="confirm-btn" onClick={handleConfirmOrder}>
            Confirm Order
          </button>

          <button className="outline" onClick={() => navigate("/cart")}>
            Back to Cart
          </button>
        </aside>
      </div>
    </main>
  );
}