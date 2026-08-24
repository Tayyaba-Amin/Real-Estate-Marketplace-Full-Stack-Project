import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState(false);
  const navigate = useNavigate();

  const handleImage = async () => {
    if (files.length === 0) {
      setImageUploadError("Please select at least one image");
      return;
    }
    if (files.length + imageUrls.length > 6) {
      setImageUploadError("You can only upload 6 images per listing");
      return;
    }
    setUploading(true);
    setImageUploadError("");
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        );
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error?.message || "Image upload failed");
        }
        uploadedUrls.push(data.secure_url);
      }
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      setFiles([]);
    } catch (error) {
      setImageUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (imageUrls.length < 1) {
      setError("You must upload at least one image");
      return;
    }

    if (
      offer &&
      Number(formData.get("discountedPrice")) >=
        Number(formData.get("regularPrice"))
    ) {
      setError("Discounted price must be lower than regular price");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const listingData = {
        name: formData.get("name"),
        description: formData.get("description"),
        address: formData.get("address"),
        type: formData.get("type"),
        parking: formData.get("parking") === "on",
        furnished: formData.get("furnished") === "on",
        offer: formData.get("offer") === "on",
        bedrooms: Number(formData.get("bedrooms")),
        bathrooms: Number(formData.get("bathrooms")),
        regularPrice: Number(formData.get("regularPrice")),
        discountedPrice: offer ? Number(formData.get("discountedPrice")) : 0,
        imageUrls,
      };
      console.log("LISTING DATA BEING SENT:", listingData);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(listingData),
      });

      const data = await res.json();

      console.log(data);

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none rounded-lg "
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            name="description"
            type="text"
            placeholder="Description"
            className="border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none rounded-lg "
            id="description"
            required
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            className="border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none rounded-lg "
            id="address"
            required
          />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="radio"
                value="sale"
                name="type"
                id="sale"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                value="rent"
                name="type"
                id="rent"
                className="w-5"
                defaultChecked
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                name="parking"
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                name="furnished"
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                name="offer"
                type="checkbox"
                id="offer"
                className="w-5"
                checked={offer}
                onChange={(e) => setOffer(e.target.checked)}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                name="bedrooms"
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                name="bathrooms"
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                name="regularPrice"
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="50"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {offer && (
              <div className="flex items-center gap-2">
                <input
                  name="discountedPrice"
                  className="p-3 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountedPrice"
                  min="0"
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                if (e.target.files.length + imageUrls.length > 6) {
                  setImageUploadError(
                    "You can only upload 6 images per listing",
                  );
                  return;
                }
                setImageUploadError("");
                setFiles(e.target.files);
              }}
              className="w-full border border-gray-300 rounded-lg p-3 bg-slate-50 text-slate-700 cursor-pointer file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border file:border-gray-300 file:bg-white file:text-slate-700 file:cursor-pointer hover:file:bg-gray-50"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />

            <button
              type="button"
              disabled={uploading}
              onClick={handleImage}
              className="p-3 text-green-700 border border-green-700 rounded-lg uppercase font-semibold hover:bg-green-700 hover:text-white transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700 text-sm">{imageUploadError}</p>
          )}
          {imageUrls.length > 0 &&
            imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={url}
                    alt="listing"
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {index === 0 && (
                    <span className="text-green-700 font-semibold">
                      Cover Image
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading || imageUrls.length === 0}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
