import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ImSpoonKnife } from "react-icons/im";
import { IoFastFoodOutline } from "react-icons/io5";
import { VscEmptyWindow } from "react-icons/vsc";
import { FaAngleLeft } from "react-icons/fa";
import { useSocket } from "../../contexts/SocketContext";
import { useSelector } from "react-redux";
import { selectOnlineUsers } from "../auth/authSlice";
import { useTranslation } from "react-i18next";

const Reactions = () => {
  const onlineUsers = useSelector(selectOnlineUsers);
  const { socketConnection } = useSocket();
  const [cookAtHome, setCookAtHome] = useState([]);
  const [eatOutside, setEatOutside] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState("cookAtHome");
  const { t } = useTranslation(["reactions"]);

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
    <div className="h-full flex flex-col">
      {/* Barra */}
      <nav className="bg-primary p-2 fixed top-14 inset-x-1 z-10 flex gap-8 justify-center rounded-md">
        {[
          {
            icon: <FaAngleLeft className="text-2xl" />,
            action: () => navigate(-1),
            key: "t1",
          },
          {
            icon: <ImSpoonKnife className="text-2xl" />,
            action: () => setView("cookAtHome"),
            key: "t2",
          },
          {
            icon: <IoFastFoodOutline className="text-2xl" />,
            action: () => setView("eatOutside"),
            key: "t3",
          },
        ].map((item) => (
          <button
            key={item.key}
            title={t(`bar.${item.key}`)}
            onClick={item.action}
            className="bg-secondary h-8 w-8 flex items-center justify-center hover:bg-tertiary focus:ring-2 focus:ring-tertiary focus:ring-inset rounded-md"
          >
            {item.icon}
          </button>
        ))}
      </nav>

      {/* People */}
      <main className="mt-14 flex-1 flex items-center">
        {cookAtHome?.length === 0 && eatOutside?.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <VscEmptyWindow className="w-48 h-48" />
            <h1>{t("title.t1")}</h1>
          </div>
        ) : (
          <div className="p-1 flex-1 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9 gap-1">
            {(view === "cookAtHome" ? cookAtHome : eatOutside).map(
              (reaction) => {
                const isOnline = onlineUsers?.includes(reaction.sender._id);
                const Icon =
                  view === "cookAtHome" ? ImSpoonKnife : IoFastFoodOutline;

                return (
                  <div
                    key={reaction._id}
                    className="relative h-52 sm:h-56 md:h-60 lg:h-64 xl:h-[310px] 2xl:h-[350px] p-1 ring-primary hover:ring-4 flex flex-col items-center justify-end bg-cover bg-center rounded-md cursor-pointer"
                    style={{
                      backgroundImage: `url(${
                        reaction.sender.profilePicture?.url ||
                        "/noProfilePhoto.png"
                      })`,
                    }}
                    onClick={() => navigate(`/people/${reaction.sender._id}`)}
                  >
                    {isOnline && (
                      <div className="absolute top-2 right-2 bg-green-500 p-2 rounded-full" />
                    )}
                    <div className="bg-tertiary h-6 w-6 flex items-center justify-center rounded-full">
                      <Icon />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reactions;
