import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [edit, setEdit] = useState(null);

  const load = () => API.get("/categories").then((r) => setCategories(r.data));

  useEffect(() => {
    load();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <main className="container empty-state page-empty">
        <h2>Admin access only</h2>
        <p>Please login using an admin account.</p>
      </main>
    );
  }

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (edit) await API.put(`/categories/${edit}`, form);
      else await API.post("/categories", form);

      setForm({ name: "", description: "" });
      setEdit(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const del = async (id) => {
    if (confirm("Delete category?")) {
      try {
        await API.delete(`/categories/${id}`);
        load();
      } catch (e) {
        alert(e.response?.data?.message || "Delete failed");
      }
    }
  };

  const start = (category) => {
    setEdit(category._id);
    setForm({
      name: category.name,
      description: category.description || "",
    });
  };

  return (
    <main className="container admin-page">
      <div className="page-title">
        <span className="eyebrow">Admin Panel</span>
        <h1>Category Management</h1>
        <p>Create and manage product categories.</p>
      </div>

      <form className="admin-form category-form" onSubmit={submit}>
        <input
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button>{edit ? "Update Category" : "Add Category"}</button>

        {edit && (
          <button
            type="button"
            className="outline"
            onClick={() => {
              setEdit(null);
              setForm({ name: "", description: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="category-list">
        {categories.map((category) => (
          <div className="category-row" key={category._id}>
            <div>
              <strong>{category.name}</strong>
              <p>{category.description || "No description"}</p>
            </div>

            <div>
              <button onClick={() => start(category)}>Edit</button>
              <button className="danger" onClick={() => del(category._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}