// src/pages/admin/AdminGallery.tsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { AuthContext } from "../../App";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

import { Plus, Trash2, Upload, Image as ImageIcon, X } from "lucide-react";

import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export default function AdminGallery() {
  const { accessToken } = useContext(AuthContext);

  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Events",
    year: new Date().getFullYear(),
  });

  const categories = ["Events", "Studio", "Outdoor", "Portrait"];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/gallery`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );

      const data = await response.json();
      setGalleryItems(data.galleryItems || []);
    } catch {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid image file");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedFile) return toast.error("Please select an image");

  setUploading(true);

  const reader = new FileReader();

  reader.onload = async () => {
    try {
      const base64 = reader.result as string; // FIXED

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/gallery/upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formData,
            image: base64,
            fileName: selectedFile.name,
            mimeType: selectedFile.type,
          }),
        }
      );

      // Safely parse response: some errors return HTML/text (404 pages),
      // so try JSON parse and fall back to raw text to avoid the JSON parse error.
      const resText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(resText);
      } catch (err) {
        data = { error: resText };
      }

      if (!response.ok) {
        console.error('Upload failed', response.status, data);
        throw new Error(data.error || `Upload failed (${response.status})`);
      }

      toast.success("Uploaded successfully");
      setShowAddModal(false);
      resetForm();
      fetchGallery();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  reader.readAsDataURL(selectedFile);
};


  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Events",
      year: new Date().getFullYear(),
    });
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete photo?")) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-52d68140/gallery/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success("Deleted");
      fetchGallery();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar onSidebarWidthChange={(w) => setSidebarWidth(w)} />

      {/* Main Page */}
      <div className="p-4 md:p-8 w-full" style={{ marginLeft: isDesktop ? sidebarWidth : 0 }}>
        <div className="max-w-7xl mx-auto pt-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Gallery Management
              </h1>
              <p className="text-gray-500 mt-1">Manage uploaded photos</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Photo
            </button>
          </div>

          {/* Gallery */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 border-b-2 rounded-full animate-spin border-gray-700" />
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No photos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <ImageWithFallback
                    src={item.thumbUrl || item.image}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-56 object-cover"
                    alt={item.title}
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between text-gray-500 text-sm mb-3">
                      <span>{item.category}</span>
                      <span>{item.year}</span>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent">
                  Add New Photo
                </h2>
                <p className="text-sm text-gray-600 mt-1">Upload a photo to your gallery</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="hover:bg-white/50 p-2 rounded-full transition-all hover:rotate-90 duration-300"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="p-6 pr-2 max-h-[calc(90vh-200px)] overflow-y-scroll custom-scrollbar">
            <form onSubmit={handleUpload} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block font-medium text-gray-700 mb-2">Photo *</label>

                {previewUrl && (
                  <div className="mb-4 relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl("");
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pb-4">
                      <Upload className="w-12 h-12 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all form-input"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all form-input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all form-input"
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-1">Year *</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all form-input"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: parseInt(e.target.value),
                    })
                  }
                  min={2000}
                  max={2099}
                />
              </div>

              <div className="flex gap-4 pt-6 border-t mt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold
                             hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>? Upload Photo</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold
                             hover:bg-gray-50 hover:border-gray-400 transition-all"
                  disabled={uploading}
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
