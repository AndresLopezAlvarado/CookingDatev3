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

const Chats = () => {
  const user = useSelector(selectCurrentUser);
  const { socketConnection } = useSocket();
  const [allUser, setAllUser] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="h-[calc(100vh-64px)] w-full p-1 gap-y-1 flex flex-col">
      <header className="bg-[#FF3B30] font-bold p-2 rounded-md text-4xl flex space-x-8 justify-center items-center text-center">
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
          title="Reactions"
          to="/reactions"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <MdEmojiEmotions />
        </Link>

        <Link
          title="Favorites"
          to="/favorites"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <FaStar />
        </Link>

        <Link
          title="Random recipe"
          to="/recipe"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <GiPerspectiveDiceSixFacesRandom />
        </Link>
      </header>

      <section className="p-4">
        <h2 className="text-2xl font-bold">Messages</h2>

        <div className="h-full overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="flex flex-col text-lg text-[#FFCC00] justify-center items-center text-center">
              <FiArrowUpLeft size={50} />

              <p>Explore users to start a conversation with.</p>
            </div>
          )}

          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={`/chat/${conv?.userDetails?._id}`}
                key={conv?._id}
                className="flex hover:border-[#FF3B30] hover:bg-[#FFCC00] gap-2 py-3 px-2 border border-transparent rounded items-center cursor-pointer"
              >
                <Avatar
                  userId={conv?.userDetails?._id}
                  name={conv?.userDetails?.username}
                  imageUrl={conv?.userDetails?.profilePicture?.url}
                />

                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.username}
                  </h3>

                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}

                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>

                    <p className="truncate max-w-[150px]">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>

                {Boolean(conv?.unseenMsg) && (
                  <p className="text-sm w-6 h-6 flex justify-center items-center ml-auto p-1 bg-[#FFCC00] text-[#FF3B30] font-semibold rounded-full">
                    {conv?.unseenMsg}
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
