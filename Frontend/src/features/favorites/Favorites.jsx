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

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="h-screen w-full p-1 gap-y-1 flex flex-col">
      {/* Barra */}
      <div className="bg-[#FF3B30] font-bold p-2 rounded-md text-4xl flex space-x-8 justify-center items-center text-center">
        <button
          title="Go back!"
          onClick={() => navigate(-1)}
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <FaAngleLeft />
        </button>

        <Link
          title="People"
          to="/people"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <IoIosPeople />
        </Link>

        <Link
          title="Chats"
          to="/chats"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <TiMessages />
        </Link>

        <Link
          title="Reactions"
          to="/reactions"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <MdEmojiEmotions />
        </Link>

        <Link
          title="Random recipe"
          to="/recipe"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <GiPerspectiveDiceSixFacesRandom />
        </Link>
      </div>

      {/* Favorites */}
      <div className="flex flex-col flex-1 overflow-y-auto items-center text-center">
        {favorites?.length === 0 ? (
          <div className="flex flex-col flex-1 justify-center items-center">
            <FaStar className="w-48 h-48" />

            <h1>There are no favorites!</h1>
          </div>
        ) : (
          <div className="w-full rounded-md grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {favorites?.map((favorite) => {
              const isOnline = onlineUsers?.includes(favorite._id);

              return (
                <div
                  key={favorite._id}
                  className="h-64 m-1 ring-[#FF3B30] hover:ring-4 hover:text-opacity-70 flex flex-col items-center justify-end bg-cover bg-center rounded-md cursor-pointer relative"
                  style={
                    favorite.profilePicture
                      ? {
                          backgroundImage: `url(${favorite.profilePicture.url})`,
                        }
                      : { backgroundImage: `url("/noProfilePhoto.png")` }
                  }
                  onClick={() => {
                    navigate(`/people/${favorite._id}`);
                  }}
                >
                  {isOnline && (
                    <div className="absolute top-2 right-2 bg-green-500 p-2 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
