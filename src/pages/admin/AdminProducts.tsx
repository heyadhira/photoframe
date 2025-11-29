import React, { useEffect, useState, useContext } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { AuthContext } from "../../App";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { toast } from "sonner";
import AdminSidebar from "./AdminSidebar";

export default function AdminProducts() {
  const { accessToken } = useContext(AuthContext);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Modern",
    material: "Wood",
    image: "",
    colors: ["White", "Black","Wood", "Gold", "Brown", "silver"],
    sizes: ["8x10", "10x12", "18×24", "20X30","24x36", "30x40", "36x48"],
  });

  // Fetch Products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        category: product.category,
        material: product.material,
        image: product.image,
        colors: product.colors || [],
        sizes: product.sizes || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Modern",
        material: "Wood",
        image: "",
        colors: ["White", "Black","Wood", "Gold", "Brown", "silver"],
        sizes: ["8x10", "10x12", "18×24", "20X30","24x36", "30x40", "36x48"],
      });
    }

    setShowModal(true);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const bodyData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    try {
      const url = editingProduct
        ? `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products/${editingProduct.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products`;

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        toast.success(editingProduct ? "Product updated" : "Product created");
        setShowModal(false);
        fetchProducts(); // reload list
      } else {
        toast.error("Failed to save product");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product");
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Could not delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-64 w-full p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Manage Products
          </h1>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 border-b-2 border-gray-800 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-900">Image</th>
                  <th className="px-6 py-3 text-left text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-gray-900">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>

                    <td className="px-6 py-4 text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ₹{product.price.toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openModal(product)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

{showModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    {/* MODAL BOX */}
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fadeIn">

      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-900">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="hover:bg-gray-200 p-2 rounded-full transition"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* BODY - Scrollable */}
      <div className="p-6 max-h-[75vh] overflow-y-auto">

        {/* FORM (NO MAX-WRAPPER) */}
        <form onSubmit={saveProduct} className="space-y-6">

          {/* NAME */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg bg-[var(--input-background)] 
                         border border-[var(--border)] focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-[var(--input-background)] 
                         border border-[var(--border)] focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* PRICE + CATEGORY RESPONSIVE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full px-4 py-2 rounded-lg bg-[var(--input-background)] 
                           border border-[var(--border)] focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-4 py-2 rounded-lg bg-[var(--input-background)] 
                           border border-[var(--border)] focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Modern">Modern</option>
                <option value="Vintage">Vintage</option>
                <option value="Traditional">Traditional</option>
                <option value="Luxury Wood">Luxury Wood</option>
                <option value="Minimalist">Minimalist</option>
              </select>
            </div>
          </div>

          {/* MATERIAL */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Material</label>
            <select
              className="w-full px-4 py-2 rounded-lg bg-[var(--input-background)] 
                         border border-[var(--border)] focus:ring-2 focus:ring-blue-500"
              value={formData.material}
              onChange={(e) =>
                setFormData({ ...formData, material: e.target.value })
              }
            >
              <option value="Wood">Wood</option>
              <option value="Metal">Metal</option>
              <option value="Plastic">Plastic</option>
              <option value="Glass">Glass</option>
            </select>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              className="w-full px-4 py-2 rounded-lg bg-[var(--input-background)] 
                         border border-[var(--border)] focus:ring-2 focus:ring-blue-500"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
          </div>

          {/* COLORS */}
          <h3 className="text-lg font-semibold text-[var(--primary)] mt-4">Available Colors</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["White", "Black", "Wood", "Gold", "Brown", "Silver"].map((color) => (
              <label
                key={color}
                className="flex items-center gap-2 border border-[var(--border)] 
                           rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition"
              >
                <input
                  type="checkbox"
                  checked={formData.colors.includes(color)}
                  onChange={() => {
                    let updated = [...formData.colors];
                    updated = updated.includes(color)
                      ? updated.filter((c) => c !== color)
                      : [...updated, color];
                    setFormData({ ...formData, colors: updated });
                  }}
                />
                <span className="text-gray-700">{color}</span>
              </label>
            ))}
          </div>

          {/* SIZES */}
          <h3 className="text-lg font-semibold text-[var(--primary)] mt-4">Available Sizes</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["8x10", "10x12", "18x24", "20x30", "24x36", "30x40", "36x48"].map((size) => (
              <label
                key={size}
                className="flex items-center gap-2 border border-[var(--border)] 
                           rounded-lg p-2 cursor-pointer hover:bg-gray-100 transition"
              >
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size)}
                  onChange={() => {
                    let updated = [...formData.sizes];
                    updated = updated.includes(size)
                      ? updated.filter((s) => s !== size)
                      : [...updated, size];
                    setFormData({ ...formData, sizes: updated });
                  }}
                />
                <span className="text-gray-700">{size}</span>
              </label>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-black 
                         hover:bg-[var(--primary-dark)] shadow-md transition"
            >
              {editingProduct ? "Update Product" : "Create Product"}
            </button>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 rounded-lg border border-[var(--border)]
                         hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
