import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchData from "../../constants/comments.js";
import CommentsCarousel from "../../components/CommentsCarousel.jsx";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [comments, setComments] = useState([]);
  const { t } = useTranslation(["home"]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchComments = await fetchData();

        setComments(fetchComments.slice(0, 10));
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    loadComments();
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <h1 className="font-bold">{t("titles.t1")}</h1>

      <Link className="text-tertiary font-bold" to="/signIn">
        {t("titles.t2")}
      </Link>

      <img
        className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/4 2xl:w-1/4"
        src="/logo.png"
        alt="Home logo"
      />

      {comments.length > 0 && (
        <div className="w-full sm:w-4/5 md:w-4/6 lg:w-1/2 flex flex-col gap-1">
          <h1 className="text-2xl text-center font-bold">{t("titles.t3")}</h1>

          <CommentsCarousel comments={comments} />
        </div>
      )}
    </div>
  );
};

export default Home;
