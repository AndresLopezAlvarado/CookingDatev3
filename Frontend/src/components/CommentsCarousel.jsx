import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const CommentsCarousel = ({ comments }) => {
  return (
    <Swiper
      // breakpoints={{
      //   0: { slidesPerView: 1, spaceBetween: 10 },
      //   640: { slidesPerView: 2, spaceBetween: 15 },
      //   1280: { slidesPerView: 3, spaceBetween: 20 },
      // }}
      spaceBetween={10}
      slidesPerView={1}
      freeMode={true}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      modules={[FreeMode, Pagination, Autoplay]}
      className="m-1 p-4"
    >
      {comments &&
        comments.map((comment) => (
          <SwiperSlide
            key={comment.id}
            className="mb-5 p-2 flex flex-col gap-1 text-sm border-2 border-primary rounded-md"
          >
            <label className="font-bold">{comment.name}</label>

            <p className="text-justify">{comment.body}</p>

            <label className="text-right font-bold">{comment.email}</label>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default CommentsCarousel;
