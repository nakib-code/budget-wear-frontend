"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import { createProduct } from "@/services/product.service";

interface SizeStock {
  size: string;
  stock: number;
}

const defaultSizes: SizeStock[] = [
  { size: "M", stock: 0 },
  { size: "L", stock: 0 },
  { size: "XL", stock: 0 },
  { size: "XXL", stock: 0 },
];

export default function AddProductPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [sizes, setSizes] =
    useState<SizeStock[]>(defaultSizes);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
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

    setImagePreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return URL.createObjectURL(file);
    });
  };

  const handleStockChange = (
    size: string,
    value: string,
  ) => {
    const stock = Math.max(
      0,
      Number(value) || 0,
    );

    setSizes((currentSizes) =>
      currentSizes.map((item) =>
        item.size === size
          ? {
              ...item,
              stock,
            }
          : item,
      ),
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!image) {
      setError("Please select a product image.");
      return;
    }

    const totalStock = sizes.reduce(
      (total, item) => total + item.stock,
      0,
    );

    if (totalStock <= 0) {
      setError(
        "Please add stock for at least one size.",
      );
      return;
    }

    try {
      setLoading(true);

      await createProduct({
        name: name.trim(),
        description: description.trim(),
        price,
        sizes,
        image,
      });

      router.push("/admin/products");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create product.",
      );
    } finally {
      setLoading(false);
    }
  };

  const totalStock = sizes.reduce(
    (total, item) => total + item.stock,
    0,
  );

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
          <div className="mx-auto max-w-5xl">
            {/* Page Header */}
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
                Add Product
              </h1>

              <p className="mt-2 text-sm text-muted">
                Add a new shirt with its image, price and stock.
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
              {/* Product Information */}
              <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-foreground sm:text-lg">
                    Product Information
                  </h2>

                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    Basic information about the shirt.
                  </p>
                </div>

                <div className="space-y-5">
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
                      placeholder="Enter product name"
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
                        setDescription(
                          event.target.value,
                        )
                      }
                      placeholder="Enter product description"
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
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">
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
                        placeholder="799"
                        className="h-12 w-full rounded-xl border border-border bg-white pl-9 pr-4 text-sm outline-none transition focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Product Image */}
              <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-foreground sm:text-lg">
                    Product Image
                  </h2>

                  <p className="mt-1 text-xs text-muted sm:text-sm">
                    Upload a clear product image.
                  </p>
                </div>

                <label
                  htmlFor="product-image"
                  className="block cursor-pointer"
                >
                  {imagePreview ? (
                    <div className="overflow-hidden rounded-2xl border border-border">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="aspect-[4/3] w-full object-cover"
                      />

                      <div className="border-t border-border px-4 py-3 text-center text-sm font-semibold text-primary">
                        Click to change image
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background px-5 text-center transition hover:border-primary">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                        +
                      </div>

                      <p className="mt-4 text-sm font-bold text-foreground">
                        Choose product image
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        JPG, PNG or WEBP
                      </p>

                      <p className="mt-2 text-[11px] text-muted">
                        Maximum 5MB
                      </p>
                    </div>
                  )}
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

              {/* Size & Stock */}
              <section className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground sm:text-lg">
                      Size & Stock
                    </h2>

                    <p className="mt-1 text-xs text-muted sm:text-sm">
                      Set available stock for each size.
                    </p>
                  </div>

                  <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                    Total: {totalStock}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {sizes.map((item) => (
                    <div
                      key={item.size}
                      className="rounded-xl border border-border bg-background p-3"
                    >
                      <label
                        htmlFor={`stock-${item.size}`}
                        className="text-sm font-bold text-foreground"
                      >
                        Size {item.size}
                      </label>

                      <input
                        id={`stock-${item.size}`}
                        type="number"
                        min="0"
                        value={item.stock}
                        onChange={(event) =>
                          handleStockChange(
                            item.size,
                            event.target.value,
                          )
                        }
                        className="mt-2 h-11 w-full rounded-lg border border-border bg-white px-3 text-center text-sm font-semibold outline-none transition focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Submit */}
              <div className="sticky bottom-3 z-10 rounded-2xl border border-border bg-white/95 p-3 shadow-xl backdrop-blur-md sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-12 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating Product..."
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}