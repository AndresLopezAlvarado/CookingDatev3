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
    <div className="h-screen w-full flex flex-col justify-center items-center text-center">
      <h1 className="font-bold">
        {t("titles.t1")}
        <Link className="text-[#FFCC00]" to="/signIn">
          {t("titles.t2")}
        </Link>
      </h1>

      <img className="w-5/6" src="/panOnStove.gif" alt="logoHome" />

      {comments.length > 0 && (
        <div className="w-5/6 flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{t("titles.t3")}</h1>

          <CommentsCarousel comments={comments} />
        </div>
      )}
    </div>
  );
};

export default Home;
