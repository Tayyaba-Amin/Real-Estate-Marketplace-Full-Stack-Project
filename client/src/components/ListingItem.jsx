import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow w-full sm:w-[330px] overflow-hidden">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
        />

        <div className="p-3">
          {/* Name */}
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>

          {/* Location */}
          <div className="flex items-center mt-2 gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />

            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {listing.description}
          </p>

          {/* Price */}
          <p className="text-slate-500 font-semibold mt-2">
            $
            {listing.offer
              ? Number(listing.discountedPrice || 0).toLocaleString("en-US")
              : Number(listing.regularPrice || 0).toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>

          {/* Beds & Baths */}
          <div className="text-slate-700 flex gap-4 mt-1">
            <div className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>

            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
