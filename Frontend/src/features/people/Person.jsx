import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImSpoonKnife } from "react-icons/im";
import { PiKnifeFill } from "react-icons/pi";
import { IoFastFoodOutline } from "react-icons/io5";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { IoChatboxOutline } from "react-icons/io5";
import { CgUnblock } from "react-icons/cg";
import { FaAngleLeft } from "react-icons/fa";
import { differenceInYears, parseISO } from "date-fns";
import { useSocket } from "../../contexts/SocketContext";
import PhotoCarousel from "../../components/PhotoCarousel";
import { selectCurrentUser } from "../auth/authSlice";
import { useGetPersonQuery } from "./peopleApiSlice";

const Person = () => {
  const location = useLocation();
  const { socketConnection } = useSocket();
  const user = useSelector(selectCurrentUser);
  const params = useParams();
  const navigate = useNavigate();
  const { data: person, isLoading } = useGetPersonQuery({ userId: params.id });
  const [age, setAge] = useState(null);
  const [usersInReactions, setUsersInReactions] = useState([]);
  const [isReacted, setIsReacted] = useState({});
  const [isBlocker, setIsBlocker] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleCookAtHome = async () => {
    if (isReacted.isCookAtHome) return;

    try {
      socketConnection?.emit("cookAtHome", params.id);

      socketConnection?.emit("getReacted", params.id);

      if (!usersInReactions.includes(params.id)) {
        socketConnection?.emit("newNotification", {
          sender: user?._id,
          receiver: params.id,
          content: "They invited you to cook at home!",
          type: "reaction",
        });
      }

      socketConnection?.emit("newReaction", {
        receiverId: params.id,
        content: "They invited you to cook at home!",
        type: "cookAtHome",
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleEatOutside = async (e) => {
    if (isReacted.isEatOutside) return;

    try {
      socketConnection?.emit("eatOutside", params.id);

      socketConnection?.emit("getReacted", params.id);

      if (!usersInReactions.includes(params.id)) {
        socketConnection?.emit("newNotification", {
          sender: user?._id,
          receiver: params.id,
          content: "They invited you to eat out!",
          type: "reaction",
        });
      }

      socketConnection?.emit("newReaction", {
        receiverId: params.id,
        content: "They invited you to eat out!",
        type: "eatOutside",
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleBlockPerson = async () => {
    try {
      socketConnection?.emit("blockPerson", params.id);

      socketConnection?.emit("getIsBlocked", params.id);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleUnblockPerson = async () => {
    try {
      socketConnection?.emit("unblockPerson", params.id);

      socketConnection?.emit("getIsBlocked", params.id);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleReportPerson = (e) => {
    e.preventDefault();
  };

  const loadAge = () => {
    if (person?.birthdate) {
      const agePerson = differenceInYears(
        new Date(),
        parseISO(person.birthdate)
      );

      setAge(agePerson);
    } else {
      setAge(0);
    }
  };

  useEffect(() => {
    loadAge();
  }, [person]);

  useEffect(() => {
    socketConnection?.emit("joinPerson");

    socketConnection?.on("usersInReactions", (usersInReactions) => {
      setUsersInReactions(usersInReactions);
    });

    socketConnection?.emit("getIsBlocker", params.id);

    socketConnection?.on("isBlocker", (isBlocker) => setIsBlocker(isBlocker));

    socketConnection?.emit("getIsBlocked", params.id);

    socketConnection?.on("isBlocked", (isBlocked) => setIsBlocked(isBlocked));

    socketConnection?.emit("getReacted", params.id);

    socketConnection?.on("isReacted", ({ isCookAtHome, isEatOutside }) =>
      setIsReacted({ isCookAtHome, isEatOutside })
    );

    return () => {
      socketConnection?.emit("leavePerson");
      socketConnection?.off("usersInReactions");
      socketConnection?.off("isBlocker");
      socketConnection?.off("isBlocked");
      socketConnection?.off("isReacted");
    };
  }, [socketConnection, params?.id, isReacted, location.pathname]);

  return (
    <div className="h-screen w-full p-1 gap-y-1 flex flex-col justify-center items-center text-center">
      {person && (
        <>
          {/* Photos */}
          <div className="h-[50vh] w-full border-[#FF3B30] border p-1 rounded-md">
            {person.photos ? (
              <PhotoCarousel photos={person.photos} />
            ) : (
              <div className="h-full flex">
                <img
                  className="rounded-full"
                  src={
                    person.profilePicture
                      ? person.profilePicture.url
                      : "/noProfilePhoto.png"
                  }
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="h-1/2 space-y-4">
            {/* Info */}
            <div>
              <h1 className="text-2xl font-bold">
                {person.username}
                {age ? <span>, {age} years</span> : null}
              </h1>

              {person.country ? (
                <h3 className="text-xl">
                  <span className="font-bold">From:</span> {person.country}
                </h3>
              ) : null}

              {person.gender ? (
                <h4 className="text-xl">
                  <span className="font-bold">Gender:</span> {person.gender}
                </h4>
              ) : null}

              {person.dietaryPreferences ? (
                <h5 className="text-xl">
                  <span className="font-bold">Dietary preferences:</span>{" "}
                  {person.dietaryPreferences}
                </h5>
              ) : null}
            </div>

            {/* Barra */}
            <div className="bg-[#FF3B30] font-bold p-2 rounded-md flex text-4xl space-x-8 justify-center items-center text-center">
              <button
                title="Go back!"
                onClick={() => navigate(-1)}
                className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
              >
                <FaAngleLeft />
              </button>

              <button
                title={
                  isReacted.isCookAtHome
                    ? "You already invited this person to cook at home!"
                    : "Let's cook at home!"
                }
                onClick={handleCookAtHome}
                className={
                  isReacted.isCookAtHome
                    ? "bg-gray-200 font-bold p-2 rounded-md cursor-default"
                    : "bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
                }
              >
                <ImSpoonKnife />
              </button>

              <button
                title={
                  isReacted.isEatOutside
                    ? "You already invited this person to eat outside!"
                    : "Let's eat outside!"
                }
                onClick={handleEatOutside}
                className={
                  isReacted.isEatOutside
                    ? "bg-gray-200 font-bold p-2 rounded-md cursor-default"
                    : "bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
                }
              >
                <IoFastFoodOutline />
              </button>

              <Link
                title={`Chat with ${person.username}`}
                to={`/chat/${person._id}`}
                className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
              >
                <IoChatboxOutline />
              </Link>

              <button
                title={isBlocked ? "Unblock user" : "Block user"}
                onClick={(e) => {
                  e.preventDefault();

                  if (isBlocked) handleUnblockPerson();
                  else handleBlockPerson();
                }}
                className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
              >
                {isBlocked ? <CgUnblock /> : <PiKnifeFill />}
              </button>

              <button
                title="Report user"
                onClick={handleReportPerson}
                className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
              >
                <MdOutlineReportGmailerrorred />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Person;
