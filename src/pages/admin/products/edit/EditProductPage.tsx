"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import api from "@/lib/api";
import { Product } from "@/types/product";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const productId = Number(params?.id);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      if (!Number.isFinite(productId)) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await api<{
          success: boolean;
          message: string;
          data: Product;
        }>(`/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProduct(response.data);
        setName(response.data.name);
        setDescription(response.data.description ?? "");
        setPrice(response.data.price);
        setImagePreview(response.data.imageUrl);
      } catch (error) {
        console.error("Failed to load product:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load product",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, router]);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setImage(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!Number.isFinite(productId)) {
      setError("Invalid product ID.");
      return;
    }

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", price);

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update product",
        );
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update product",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 text-sm text-muted">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">
            {error || "Product not found."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="mt-4 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="px-4 py-7 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-7 sm:mb-9">
              <button
                type="button"
                onClick={() =>
                  router.push("/admin/products")
                }
                className="mb-4 text-sm font-semibold text-muted transition hover:text-primary"
              >
                ← Back to Products
              </button>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Store
              </p>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Edit Product
              </h1>

              <p className="mt-2 text-sm text-muted">
                Update product information or change its image.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  Product Information
                </h2>

                <div className="mt-5 space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Product Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Description
                    </label>

                    <textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-semibold text-foreground"
                    >
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">
                        ৳
                      </span>

                      <input
                        id="price"
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={price}
                        onChange={(event) =>
                          setPrice(event.target.value)
                        }
                        className="h-12 w-full rounded-xl border border-border bg-white pl-9 pr-4 text-sm outline-none transition focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-base font-bold text-foreground sm:text-lg">
                  Product Image
                </h2>

                <label
                  htmlFor="product-image"
                  className="mt-5 block cursor-pointer"
                >
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <img
                      src={imagePreview}
                      alt={product.name}
                      className="aspect-[4/3] w-full object-cover"
                    />

                    <div className="border-t border-border px-4 py-3 text-center text-sm font-semibold text-primary">
                      Click to change image
                    </div>
                  </div>
                </label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {image && (
                  <p className="mt-3 truncate text-xs text-muted">
                    Selected: {image.name}
                  </p>
                )}
              </section>

              <div className="sticky bottom-3 z-10 rounded-2xl border border-border bg-white/95 p-3 shadow-xl backdrop-blur-md">
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-12 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
