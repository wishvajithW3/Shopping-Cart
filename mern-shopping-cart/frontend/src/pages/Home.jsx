import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import ProductCard from "../components/product/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    const { data } = await API.get("/categories");
    setCategories(Array.isArray(data) ? data : []);
  };

  const loadProducts = async () => {
    const params = {};

    if (category !== "all") params.category = category;
    if (search.trim()) params.search = search.trim();

    const { data } = await API.get("/products", { params });
    setProducts(Array.isArray(data) ? data : []);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadCategories(), loadProducts()]);
    } catch (error) {
      console.error("HOME LOAD ERROR:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProducts().catch((error) => {
      console.error("PRODUCT FILTER ERROR:", error);
    });
  }, [category, search]);

  const selectedCategoryName = useMemo(() => {
    if (category === "all") return "All Categories";
    return categories.find((cat) => cat._id === category)?.name || "Category";
  }, [category, categories]);

  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">Fresh daily essentials</span>
          <h1>Shop groceries faster, fresher, and easier.</h1>
          <p>
            Browse vegetables, fruits, cakes, biscuits and more. Add your
            favourites to cart and review your order before checkout.
          </p>

          <div className="hero-actions">
            <a href="#products" className="hero-btn">
              Start Shopping
            </a>
            <span className="hero-note">Secure login • Fast cart • Mobile ready</span>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-top">
            <span>Today&apos;s basket</span>
            <strong>FreshCart</strong>
          </div>
          <div className="hero-mini-list">
            <div>🥦 Vegetables</div>
            <div>🍎 Fruits</div>
            <div>🍰 Cakes</div>
            <div>🍪 Biscuits</div>
          </div>
        </div>
      </section>

      <section className="container section-head" id="products">
        <div>
          <span className="eyebrow">Products</span>
          <h2>{selectedCategoryName}</h2>
        </div>

        <p>{products.length} product{products.length === 1 ? "" : "s"} available</p>
      </section>

      <section className="container filters">
        <div className="search-box">
          <span>🔎</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products..."
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </section>

      <section className="container">
        {loading ? (
          <div className="loading-grid">
            <div />
            <div />
            <div />
            <div />
          </div>
        ) : (
          <div className="grid">
            {products.length === 0 ? (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try another search keyword or category.</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;