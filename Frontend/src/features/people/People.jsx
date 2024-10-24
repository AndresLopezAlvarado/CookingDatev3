import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { VscEmptyWindow } from "react-icons/vsc";
import { TiMessages } from "react-icons/ti";
import { BiBookmarkHeart } from "react-icons/bi";
import { MdEmojiEmotions } from "react-icons/md";
import PeopleGrid from "./PeopleGrid";
import { useGetPeopleQuery } from "./peopleApiSlice";
import { selectCurrentUser } from "../auth/authSlice";
import { useSocket } from "../../contexts/SocketContext";
import { useEffect } from "react";

const People = () => {
  const user = useSelector(selectCurrentUser);
  const {
    data: people,
    isLoading,
    refetch,
  } = useGetPeopleQuery({ userId: user._id });
  const { socketConnection } = useSocket();
  const location = useLocation();

  useEffect(() => {
    const handlePersonBlockedPeople = () => refetch();

    socketConnection?.emit("joinPeople");
    socketConnection?.on("personBlocked", handlePersonBlockedPeople);

    return () => {
      socketConnection?.emit("leavePeople");
      socketConnection?.off("personBlocked", handlePersonBlockedPeople);
    };
  }, [socketConnection, refetch, location.pathname]);

  return (
    <div className="h-screen w-full p-1 gap-y-1 flex flex-col">
      {/* Barra */}
      <div className="bg-[#FF3B30] font-bold p-2 rounded-md text-4xl flex space-x-8 justify-center items-center text-center">
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
          title="Favorites"
          to="/favorites"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <BiBookmarkHeart />
        </Link>
      </div>

      {/* People */}
      <div className="flex flex-col flex-1 overflow-y-auto items-center text-center">
        {people &&
          (people?.length === 0 ? (
            <div className="flex flex-col flex-1 justify-center items-center">
              <VscEmptyWindow className="w-48 h-48" />

              <h1>There are no people!</h1>
            </div>
          ) : (
            <PeopleGrid people={people} />
          ))}
      </div>
    </div>
  );
};

export default People;
