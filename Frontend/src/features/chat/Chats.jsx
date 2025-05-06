import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdEmojiEmotions } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { FaImage } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { FiArrowUpLeft } from "react-icons/fi";
import { FaVideo } from "react-icons/fa";
import { selectCurrentUser } from "../auth/authSlice";
import Avatar from "../../components/Avatar";
import { useSocket } from "../../contexts/SocketContext";
import { useTranslation } from "react-i18next";

const Chats = () => {
  const user = useSelector(selectCurrentUser);
  const { socketConnection } = useSocket();
  const [allUser, setAllUser] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(["chats"]);

  useEffect(() => {
    const handleConversations = (conversations) => {
      const conversationsData = conversations.map((conv) => {
        if (conv?.sender?._id === conv?.receiver?._id)
          return { ...conv, userDetails: conv.sender };
        else if (conv?.receiver?._id !== user?._id)
          return { ...conv, userDetails: conv.receiver };
        else return { ...conv, userDetails: conv.sender };
      });

      setAllUser(conversationsData);
    };

    const handlePersonBlockedChats = () =>
      socketConnection?.emit("getConversations");

    socketConnection?.emit("joinChats");
    socketConnection?.emit("getConversations");
    socketConnection?.on("conversations", handleConversations);
    socketConnection?.on("personBlocked", handlePersonBlockedChats);

    return () => {
      socketConnection?.emit("leaveChats");
      socketConnection?.off("conversations", handleConversations);
      socketConnection?.off("personBlocked", handlePersonBlockedChats);
    };
  }, [socketConnection, user, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <nav className="bg-primary p-2 fixed top-14 inset-x-1 z-10 flex gap-8 justify-center rounded-md">
        {[
          {
            icon: <FaAngleLeft className="text-2xl" />,
            onClick: () => navigate(-1),
            key: "t1",
            isButton: true,
          },
          {
            icon: <IoIosPeople className="text-2xl" />,
            to: "/people",
            key: "t2",
          },
          {
            icon: <MdEmojiEmotions className="text-2xl" />,
            to: "/reactions",
            key: "t3",
          },
          {
            icon: <FaStar className="text-2xl" />,
            to: "/favorites",
            key: "t4",
          },
          {
            icon: <GiPerspectiveDiceSixFacesRandom className="text-2xl" />,
            to: "/recipe",
            key: "t5",
          },
        ].map(({ key, icon, to, onClick, isButton }) =>
          isButton ? (
            <button
              key={key}
              title={t(`bar.${key}`)}
              onClick={onClick}
              className="bg-secondary hover:bg-tertiary focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset h-8 w-8 flex items-center justify-center rounded-md"
            >
              {icon}
            </button>
          ) : (
            <Link
              key={key}
              title={t(`bar.${key}`)}
              to={to}
              className="bg-secondary hover:bg-tertiary focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset h-8 w-8 flex items-center justify-center rounded-md"
            >
              {icon}
            </Link>
          )
        )}
      </nav>

      <section className="w-full sm:w-5/6 md:w-3/5 lg:w-3/6 2xl:w-2/5 mt-14 p-1 flex-1 flex flex-col gap-4">
        <h2 className="mt-4 text-2xl text-center font-bold">{t("title.t1")}</h2>

        <div className="flex flex-col gap-2">
          {allUser.length === 0 && (
            <div className="flex flex-col gap-2 text-lg text-tertiary justify-center items-center text-center">
              <FiArrowUpLeft size={50} />
              <p>{t("title.t2")}</p>
            </div>
          )}

          {allUser.map(({ _id, userDetails, lastMsg, unseenMsg }) => {
            const { _id: uid, username, profilePicture } = userDetails;
            
            return (
              <NavLink
                to={`/chat/${uid}`}
                key={_id}
                className="hover:bg-tertiary p-2 flex gap-2 items-center border border-transparent hover:border-primary rounded-md cursor-pointer"
              >
                <Avatar
                  userId={uid}
                  name={username}
                  imageUrl={profilePicture?.url}
                />

                <div className="flex flex-col overflow-hidden">
                  <h3 className="text-ellipsis text-base font-semibold line-clamp-1">
                    {username}
                  </h3>

                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    {lastMsg?.imageUrl && (
                      <div className="flex gap-1 items-center">
                        <FaImage />
                        {!lastMsg.text && <span>{t("title.t3")}</span>}
                      </div>
                    )}
                    {lastMsg?.videoUrl && (
                      <div className="flex gap-1 items-center">
                        <FaVideo />
                        {!lastMsg.text && <span>{t("title.t4")}</span>}
                      </div>
                    )}
                    {lastMsg?.text && (
                      <p className="truncate max-w-[150px]">{lastMsg.text}</p>
                    )}
                  </div>
                </div>

                {unseenMsg > 0 && (
                  <p className="bg-tertiary h-5 w-5 ml-auto text-primary text-xs font-bold flex justify-center items-center rounded-full">
                    {unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Chats;
