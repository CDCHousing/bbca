"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  order: number;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [order, setOrder] = useState("0");

  async function fetchImages() {
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Please select an image file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      if (caption) formData.append("caption", caption);
      formData.append("order", order);

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Upload failed");
        return;
      }

      setSuccess("Image uploaded successfully");
      setCaption("");
      setOrder("0");
      if (fileRef.current) fileRef.current.value = "";
      await fetchImages();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch {
      alert("Failed to delete image");
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
        <p className="text-sm text-gray-500 mt-1">
          {images.length} image{images.length !== 1 ? "s" : ""} in gallery
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">Upload New Image</h2>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image File <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              required
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#1B2A52] file:text-white hover:file:bg-[#14203D] file:cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
                placeholder="Optional caption"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A52]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-[#1B2A52] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#14203D] transition-colors disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading images...</div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg font-medium mb-2">No images yet</p>
          <p className="text-sm">Upload your first gallery image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow overflow-hidden group"
            >
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={image.imageUrl}
                  alt={image.caption || "Gallery image"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                {image.caption && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {image.caption}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Order: {image.order}
                  </span>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="text-xs bg-red-600 text-white rounded px-2 py-1 hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
