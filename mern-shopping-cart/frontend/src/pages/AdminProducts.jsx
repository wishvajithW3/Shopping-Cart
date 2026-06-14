import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  category: "",
};

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const [p, c] = await Promise.all([
      API.get("/products"),
      API.get("/categories"),
    ]);

    setProducts(p.data);
    setCategories(c.data);

    if (!form.category && c.data[0]) {
      setForm((prev) => ({ ...prev, category: c.data[0]._id }));
    }
  };

  useEffect(() => {
    loadData().catch(() => alert("Load failed"));
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <main className="container empty-state page-empty">
        <h2>Admin access only</h2>
        <p>Please login using an admin account.</p>
      </main>
    );
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) await API.put(`/products/${editingId}`, payload);
      else await API.post("/products", payload);

      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Save failed");
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image,
      category: product.category?._id,
    });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;

    await API.delete(`/products/${id}`);
    await loadData();
  };

  return (
    <main className="container admin-page">
      <div className="page-title">
        <span className="eyebrow">Admin Panel</span>
        <h1>Product Management</h1>
        <p>Add, update, and manage FreshCart products.</p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          required
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          min="0"
          placeholder="Price"
          required
        />

        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          type="number"
          min="0"
          placeholder="Stock"
          required
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            className="outline"
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="admin-list">
        {products.map((product) => (
          <div className="admin-row" key={product._id}>
            <img src={product.image} alt={product.name} />

            <div>
              <strong>{product.name}</strong>
              <p>
                Rs. {product.price} • Stock {product.stock} •{" "}
                {product.category?.name || "Category"}
              </p>
            </div>

            <button onClick={() => editProduct(product)}>Edit</button>
            <button className="danger" onClick={() => deleteProduct(product._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminProducts;