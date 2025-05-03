import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const PhotoCarousel = ({ photos }) => {
  const photoArray = photos ? Object.values(photos) : [];

  if (photoArray.length === 0)
    return <p className="text-center py-4">No hay imágenes para mostrar</p>;

  return (
    <Swiper
      breakpoints={{
        340: { slidesPerView: 1 },
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
      {photoArray.map((item) => (
        <SwiperSlide key={item.name}>
          <div
            className="h-full bg-no-repeat bg-center bg-contain"
            style={{ backgroundImage: `url(${item.url})` }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PhotoCarousel;
