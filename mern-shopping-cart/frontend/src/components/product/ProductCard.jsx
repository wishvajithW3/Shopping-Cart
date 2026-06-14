import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!user) return alert("Please login first");

    try {
      setLoading(true);
      await addToCart(product._id, 1);
      alert("Added to cart");
    } catch (error) {
      alert(error.response?.data?.message || "Add to cart failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop";
          }}
        />

        <span className={product.stock > 0 ? "stock-badge" : "stock-badge out"}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>

      <div className="product-body">
        <span className="category">{product.category?.name || "Product"}</span>

        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-footer">
          <strong>Rs. {Number(product.price || 0).toFixed(2)}</strong>
        </div>

        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={loading || product.stock <= 0}
        >
          {product.stock <= 0 ? "Out of stock" : loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;