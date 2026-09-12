"use client";

interface SizeGuideModalProps {
  onClose: () => void;
}

const sizeGuide = [
  { height: `5'4" - 5'6"`, size: "M" },
  { height: `5'7" - 5'9"`, size: "L" },
  { height: `5'10" - 6'0"`, size: "XL" },
  { height: `6'1" - 6'3"`, size: "XXL" },
];

export default function SizeGuideModal({
  onClose,
}: SizeGuideModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Size Guide
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Choose your size based on your height.
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border">
          <div className="grid grid-cols-2 bg-gray-100 px-4 py-3 font-semibold">
            <span>Height</span>
            <span>Recommended Size</span>
          </div>

          {sizeGuide.map((item) => (
            <div
              key={item.height}
              className="grid grid-cols-2 border-t px-4 py-3"
            >
              <span>{item.height}</span>

              <span className="font-semibold">
                {item.size}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Size may vary depending on body type and preferred fit.
        </p>
      </div>
    </div>
  );
}