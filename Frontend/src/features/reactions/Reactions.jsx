import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ImSpoonKnife } from "react-icons/im";
import { IoFastFoodOutline } from "react-icons/io5";
import { VscEmptyWindow } from "react-icons/vsc";
import { FaAngleLeft } from "react-icons/fa";
import { useSocket } from "../../contexts/SocketContext";
import { useSelector } from "react-redux";
import { selectOnlineUsers } from "../auth/authSlice";

const Reactions = () => {
  const onlineUsers = useSelector(selectOnlineUsers);
  const { socketConnection } = useSocket();
  const [cookAtHome, setCookAtHome] = useState([]);
  const [eatOutside, setEatOutside] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState("cookAtHome");

  useEffect(() => {
    socketConnection?.emit("joinReactions");

    socketConnection?.emit("getReactions");

    socketConnection?.on("reactions", (reactions) => {
      socketConnection.emit("seenNotifications");

      const cookAtHomeReactions = reactions
        .filter((reaction) => reaction.type === "cookAtHome")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const eatOutsideReactions = reactions
        .filter((reaction) => reaction.type === "eatOutside")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setCookAtHome(cookAtHomeReactions);
      setEatOutside(eatOutsideReactions);
    });

    return () => {
      socketConnection?.emit("leaveReactions");
      socketConnection?.off("reactions");
    };
  }, [socketConnection, location.pathname]);

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

        <button
          title="Let's cook at home!"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
          onClick={() => setView("cookAtHome")}
        >
          <ImSpoonKnife />
        </button>

        <button
          title="Let's eat outside!"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
          onClick={() => setView("eatOutside")}
        >
          <IoFastFoodOutline />
        </button>
      </div>

      {/* People */}
      <div className="flex flex-col flex-1 overflow-y-auto items-center text-center">
        {cookAtHome?.length === 0 && eatOutside?.length === 0 ? (
          <div className="flex flex-col flex-1 justify-center items-center">
            <VscEmptyWindow className="w-48 h-48" />

            <h1>There are no reactions!</h1>
          </div>
        ) : (
          <div className="w-full rounded-md grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
            {view === "cookAtHome"
              ? cookAtHome.map((reaction) => {
                  const isOnline = onlineUsers?.includes(reaction.sender._id);

                  return (
                    <div
                      key={reaction._id}
                      className="h-64 ring-[#FF3B30] hover:ring-4 hover:text-opacity-70 flex flex-col items-center justify-end bg-cover bg-center rounded-md cursor-pointer relative"
                      style={
                        reaction.sender.profilePicture
                          ? {
                              backgroundImage: `url(${reaction.sender.profilePicture.url})`,
                            }
                          : { backgroundImage: `url("/noProfilePhoto.png")` }
                      }
                      onClick={() => {
                        navigate(`/people/${reaction.sender._id}`);
                      }}
                    >
                      {isOnline && (
                        <div className="absolute top-2 right-2 bg-green-500 p-2 rounded-full" />
                      )}

                      {reaction.type === "cookAtHome" ? (
                        <ImSpoonKnife className="absolute top-2 right-7" />
                      ) : (
                        <IoFastFoodOutline className="absolute top-2 right-7" />
                      )}
                    </div>
                  );
                })
              : eatOutside.map((reaction) => {
                  const isOnline = onlineUsers?.includes(reaction.sender._id);

                  return (
                    <div
                      key={reaction._id}
                      className="h-64 ring-[#FF3B30] hover:ring-4 hover:text-opacity-70 flex flex-col items-center justify-end bg-cover bg-center rounded-md cursor-pointer relative"
                      style={
                        reaction.sender.profilePicture
                          ? {
                              backgroundImage: `url(${reaction.sender.profilePicture.url})`,
                            }
                          : { backgroundImage: `url("/noProfilePhoto.png")` }
                      }
                      onClick={() => {
                        navigate(`/people/${reaction.sender._id}`);
                      }}
                    >
                      {isOnline && (
                        <div className="absolute top-2 right-2 bg-green-500 p-2 rounded-full" />
                      )}

                      {reaction.type === "cookAtHome" ? (
                        <ImSpoonKnife className="absolute top-2 right-7" />
                      ) : (
                        <IoFastFoodOutline className="absolute top-2 right-7" />
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

export default Reactions;
