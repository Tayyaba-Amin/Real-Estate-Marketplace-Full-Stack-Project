import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [sidebardata, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === true ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({
        ...sidebardata,
        sort,
        order,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    const typeFormUrl = urlParams.get("type");
    const parkingFormUrl = urlParams.get("parking");
    const furnishedFormUrl = urlParams.get("furnished");
    const offerFormUrl = urlParams.get("offer");
    const sortFormUrl = urlParams.get("sort");
    const orderFormUrl = urlParams.get("order");

    if (
      searchTermFormUrl ||
      typeFormUrl ||
      parkingFormUrl ||
      furnishedFormUrl ||
      offerFormUrl ||
      sortFormUrl ||
      orderFormUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFormUrl || "",
        type: typeFormUrl || "all",
        parking: parkingFormUrl === "true" ? true : false,
        furnished: furnishedFormUrl === "true" ? true : false,
        offer: offerFormUrl === "true" ? true : false,
        sort: sortFormUrl || "createdAt",
        order: orderFormUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListing();
  }, [location.search]);

  const onShowMoreClick = async () => {
    const numOfListings = listings.length;
    const startIndex = numOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              value={sidebardata.searchTerm}
              onChange={handleChange}
              placeholder="Search..."
              className="border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none  rounded-lg "
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={sidebardata.offer}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebardata.parking}
                id="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sidebardata.furnished}
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
              className="border border-slate-300 bg-slate-50 p-3 text-slate-800 outline-none  rounded-lg "
              id="sort_order"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Search
          </button>
        </form>
      </div>
      <div className=" flex-1">
        <h1 className="text-3xl p-3 border-slate-300 text-slate-700 border-b text-center font-semibold mt-5">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found</p>
          )}
          {loading && (
            <p className="text-xl text-center w-full text-slate-700">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
