import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="group w-full sm:w-[300px] md:w-[320px] lg:w-[330px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100">
      <Link to={`/listing/${listing._id}`} className="block">
        {/* Image */}
        <div className="relative w-full h-[240px] sm:h-[210px] md:h-[220px] overflow-hidden">
          <img
            src={listing.imageUrls[0]}
            alt="listing cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Property Type */}
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </span>

          {/* Offer */}
          {listing.offer && (
            <span className="absolute top-3 right-3 bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Offer
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name */}
          <h2 className="truncate text-lg font-semibold text-slate-800 group-hover:text-slate-600 transition-colors">
            {listing.name}
          </h2>

          {/* Location */}
          <div className="flex items-center gap-1.5 mt-2">
            <MdLocationOn className="h-4 w-4 min-w-4 text-green-700" />

            <p className="text-sm text-slate-500 truncate">{listing.address}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-5 min-h-[40px]">
            {listing.description}
          </p>

          {/* Price */}
          <div className="mt-3">
            <p className="text-lg font-bold text-slate-800">
              $
              {listing.offer
                ? Number(listing.discountedPrice || 0).toLocaleString("en-US")
                : Number(listing.regularPrice || 0).toLocaleString("en-US")}
              {listing.type === "rent" && (
                <span className="text-sm font-normal text-slate-500">
                  {" "}
                  / month
                </span>
              )}
            </p>

            {/* Old Price */}
            {listing.offer && (
              <p className="text-sm text-slate-400 line-through mt-0.5">
                ${Number(listing.regularPrice || 0).toLocaleString("en-US")}
              </p>
            )}
          </div>

          {/* Beds & Baths */}
          <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-100 text-slate-600">
            <div className="text-sm font-semibold">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>

            <div className="text-sm font-semibold">
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
