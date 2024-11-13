import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const CommentsCarousel = ({ comments }) => {
  return (
    <Swiper
      breakpoints={{
        640: { slidesPerView: 2, spaceBetween: 15 },
        1280: { slidesPerView: 3, spaceBetween: 15 },
      }}
      freeMode={true}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      modules={[FreeMode, Pagination, Autoplay]}
      className="w-full pb-10"
    >
      {comments &&
        comments.map((comment) => (
          <SwiperSlide
            key={comment.id}
            className="border-[#FF3B30] border-2 p-2 flex flex-col justify-center space-y-2 rounded-md"
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
