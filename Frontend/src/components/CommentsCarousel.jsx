import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const CommentsCarousel = ({ comments }) => {
  return (
    <Swiper
      breakpoints={{
        0: { slidesPerView: 1, spaceBetween: 10 },
        640: { slidesPerView: 2, spaceBetween: 15 },
        1280: { slidesPerView: 3, spaceBetween: 20 }, // Aumenté a 20
      }}
      freeMode={true}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      modules={[FreeMode, Pagination, Autoplay]}
      className="w-full p-4"
    >
      {comments &&
        comments.map((comment) => (
          <SwiperSlide
            key={comment.id}
            className="border-primary text-sm border-4 mb-4 p-4 flex flex-col justify-center gap-1 rounded-md"
          >
            <h1 className="font-bold">{comment.name}</h1>
            <p>{comment.body}</p>
            <h1 className="font-bold">{comment.email}</h1>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default CommentsCarousel;
