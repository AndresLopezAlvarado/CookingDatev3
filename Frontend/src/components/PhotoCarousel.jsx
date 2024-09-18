import React from "react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const PhotoCarousel = ({ photos }) => {
  const [arrPhotos, setArrPhotos] = useState();

  useEffect(() => {
    if (photos) {
      setArrPhotos(Object.values(photos));
    }
  }, [photos]);

  return (
    <Swiper
      breakpoints={{
        340: { slidesPerView: 1 },
        // 700: { slidesPerView: 3, spaceBetween: 15 },
      }}
      freeMode={true}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      modules={[FreeMode, Pagination, Autoplay]}
      className="h-full"
    >
      {arrPhotos ? (
        arrPhotos.map((item) => (
          <SwiperSlide key={item.name}>
            <div
              className="h-full bg-no-repeat bg-center bg-contain"
              style={{ backgroundImage: `url(${item.url})` }}
            />
          </SwiperSlide>
        ))
      ) : (
        <p>No hay imagenes para mostrar</p>
      )}
    </Swiper>
  );
};

export default PhotoCarousel;
