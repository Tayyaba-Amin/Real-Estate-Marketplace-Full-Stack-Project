import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    imageUrls: [],
  });

  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // GET EXISTING LISTING
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${listingId}`);

        // Important: don't blindly do res.json()
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Failed to fetch listing (${res.status}): ${text.slice(0, 100)}`,
          );
        }

        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          return;
        }

        setFormData({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          type: data.type || "rent",
          parking: data.parking || false,
          furnished: data.furnished || false,
          offer: data.offer || false,
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          regularPrice: data.regularPrice || 50,
          discountedPrice: data.discountedPrice || 0,
          imageUrls: data.imageUrls || [],
        });
      } catch (error) {
        console.log("FETCH LISTING ERROR:", error);
        setError(error.message);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  // HANDLE TEXT / NUMBER / CHECKBOX / RADIO CHANGES
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  // UPLOAD IMAGES TO CLOUDINARY
  const handleImage = async () => {
    if (files.length === 0) {
      setImageUploadError("Please select at least one image");
      return;
    }

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError("You can only upload 6 images per listing");
      return;
    }

    setUploading(true);
    setImageUploadError("");

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const uploadData = new FormData();

        uploadData.append("file", file);
        uploadData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadData,
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error?.message || "Image upload failed");
        }

        uploadedUrls.push(data.secure_url);
      }

      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }));

      setFiles([]);
    } catch (error) {
      console.log("CLOUDINARY ERROR:", error);
      setImageUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  // REMOVE IMAGE
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // UPDATE LISTING
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image");
      return;
    }

    if (
      formData.offer &&
      Number(formData.regularPrice) < Number(formData.discountedPrice)
    ) {
      setError("Discounted price must be lower than regular price");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const listingData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        type: formData.type,
        parking: formData.parking,
        furnished: formData.furnished,
        offer: formData.offer,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        regularPrice: Number(formData.regularPrice),
        discountedPrice: formData.offer ? Number(formData.discountedPrice) : 0,
        imageUrls: formData.imageUrls,
      };

      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(listingData),
      });

      if (!res.ok) {
        const text = await res.text();

        throw new Error(`Update failed (${res.status}): ${text.slice(0, 100)}`);
      }

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.log("UPDATE ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Update a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none rounded-lg"
            id="description"
            required
            value={formData.description}
            onChange={handleChange}
          />

          <input
            name="address"
            type="text"
            placeholder="Address"
            className="border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none rounded-lg"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
          />

          {/* TYPE */}
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input
                type="radio"
                value="sale"
                name="type"
                id="type"
                className="w-5"
                checked={formData.type === "sale"}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    type: "sale",
                  }))
                }
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                value="rent"
                name="type"
                id="type"
                className="w-5"
                checked={formData.type === "rent"}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    type: "rent",
                  }))
                }
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                name="parking"
                type="checkbox"
                id="parking"
                className="w-5"
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking Spot</span>
            </div>

            <div className="flex gap-2">
              <input
                name="furnished"
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                name="offer"
                type="checkbox"
                id="offer"
                className="w-5"
                checked={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* NUMBERS */}
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
                value={formData.bedrooms}
                onChange={handleChange}
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
                value={formData.bathrooms}
                onChange={handleChange}
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
                value={formData.regularPrice}
                onChange={handleChange}
              />

              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  name="discountedPrice"
                  className="p-3 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountedPrice"
                  min="0"
                  required
                  value={formData.discountedPrice}
                  onChange={handleChange}
                />

                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          {/* IMAGE INPUT */}
          <div className="flex gap-4">
            <input
              onChange={(e) => {
                if (e.target.files.length + formData.imageUrls.length > 6) {
                  setImageUploadError(
                    "You can only upload 6 images per listing",
                  );
                  return;
                }

                setImageUploadError("");
                setFiles(e.target.files);
              }}
              className="w-full border border-gray-300 rounded-lg p-3 bg-slate-50 text-slate-700 cursor-pointer"
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

          {/* IMAGES */}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
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

          {/* UPDATE BUTTON */}
          <button
            disabled={loading || uploading || formData.imageUrls.length === 0}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
