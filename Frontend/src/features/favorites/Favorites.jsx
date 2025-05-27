import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TiMessages } from "react-icons/ti";
import { MdEmojiEmotions } from "react-icons/md";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { FaStar } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectOnlineUsers } from "../auth/authSlice";
import { useGetFavoritesQuery } from "../people/peopleApiSlice";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const user = useSelector(selectCurrentUser);
  const {
    data: favorites,
    isLoading,
    refetch,
  } = useGetFavoritesQuery({
    userId: user._id,
  });
  const onlineUsers = useSelector(selectOnlineUsers);
  const navigate = useNavigate();
  const { t } = useTranslation(["favorites"]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="h-full flex flex-col">
      {/* Barra */}
      <nav className="bg-primary p-2 fixed top-14 inset-x-1 z-10 flex gap-8 justify-center rounded-md">
        {[
          {
            icon: <FaAngleLeft className="text-2xl" />,
            key: "t1",
            type: "button",
            action: () => navigate(-1),
          },
          {
            icon: <IoIosPeople className="text-2xl" />,
            key: "t2",
            type: "link",
            to: "/people",
          },
          {
            icon: <TiMessages className="text-2xl" />,
            key: "t3",
            type: "link",
            to: "/chats",
          },
          {
            icon: <MdEmojiEmotions className="text-2xl" />,
            key: "t4",
            type: "link",
            to: "/reactions",
          },
          {
            icon: <GiPerspectiveDiceSixFacesRandom className="text-2xl" />,
            key: "t5",
            type: "link",
            to: "/recipe",
          },
        ].map((item) =>
          item.type === "button" ? (
            <button
              key={item.key}
              title={t(`bar.${item.key}`)}
              onClick={item.action}
              className="bg-secondary h-8 w-8 flex items-center justify-center hover:bg-tertiary focus:ring-2 focus:ring-tertiary focus:ring-inset rounded-md"
            >
              {item.icon}
            </button>
          ) : (
            <Link
              key={item.key}
              title={t(`bar.${item.key}`)}
              to={item.to}
              className="bg-secondary h-8 w-8 flex items-center justify-center hover:bg-tertiary focus:ring-2 focus:ring-tertiary focus:ring-inset rounded-md"
            >
              {item.icon}
            </Link>
          )
        )}
      </nav>

      {/* Favorites */}
      <main className="mt-14 flex-1 flex items-start">
        {favorites?.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <FaStar className="w-48 h-48" />

            <h1>{t("title.t1")}</h1>
          </div>
        ) : (
          <div className="p-1 flex-1 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9 gap-1">
            {favorites?.map((favorite) => {
              const isOnline = onlineUsers?.includes(favorite._id);

              return (
                <div
                  key={favorite._id}
                  className="relative h-52 sm:h-56 md:h-60 lg:h-64 xl:h-[310px] 2xl:h-[350px] p-1 ring-primary hover:ring-4 flex flex-col items-center justify-end bg-cover bg-center rounded-md cursor-pointer"
                  style={{
                    backgroundImage: `url(${
                      favorite.profilePicture?.url || "/noProfilePhoto.png"
                    })`,
                  }}
                  onClick={() => navigate(`/people/${favorite._id}`)}
                >
                  {isOnline && (
                    <div className="absolute top-2 right-2 bg-green-500 p-2 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
