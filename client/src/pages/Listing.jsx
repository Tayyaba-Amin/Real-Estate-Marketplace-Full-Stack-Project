import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function Listing() {
  const params = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        console.log("API DATA:", data);

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
      } catch (error) {
        console.log("FETCH ERROR:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <div>
      <main>
        {loading && <p className="text-center text-2xl my-7">Loading...</p>}

        {error && (
          <p className="text-center text-2xl my-7">Something went wrong!</p>
        )}

        {listing && !loading && !error && (
          <Swiper navigation={true} modules={[Navigation]}>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </main>
    </div>
  );
}
