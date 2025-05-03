import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImSpoonKnife } from "react-icons/im";
import { PiKnifeFill } from "react-icons/pi";
import { IoFastFoodOutline } from "react-icons/io5";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import { IoChatboxOutline } from "react-icons/io5";
import { CgUnblock } from "react-icons/cg";
import { FaAngleLeft } from "react-icons/fa";
import { differenceInYears, parseISO } from "date-fns";
import { useSocket } from "../../contexts/SocketContext";
import PhotoCarousel from "../../components/PhotoCarousel";
import { selectCurrentUser } from "../auth/authSlice";
import { useGetPersonQuery } from "./peopleApiSlice";
import { useTranslation } from "react-i18next";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useTranslation(["person"]);

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
  const handleMarkAsFavorite = async () => {
    try {
      socketConnection?.emit("markAsFavorite", params.id);

      socketConnection?.emit("getIsFavorite", params.id);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleUnmarkAsFavorite = async () => {
    try {
      socketConnection?.emit("unmarkAsFavorite", params.id);

      socketConnection?.emit("getIsFavorite", params.id);
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
    const handleIsBlockedPerson = (isBlocked) => setIsBlocked(isBlocked);

    socketConnection?.emit("joinPerson");

    socketConnection?.on("usersInReactions", (usersInReactions) => {
      setUsersInReactions(usersInReactions);
    });

    socketConnection?.emit("getIsBlocker", params.id);

    socketConnection?.on("isBlocker", (isBlocker) => setIsBlocker(isBlocker));

    socketConnection?.emit("getIsFavorite", params.id);

    socketConnection?.on("isFavorite", (isFavorite) =>
      setIsFavorite(isFavorite)
    );

    socketConnection?.emit("getIsBlocked", params.id);

    socketConnection?.on("isBlocked", handleIsBlockedPerson);

    socketConnection?.emit("getReacted", params.id);

    socketConnection?.on("isReacted", ({ isCookAtHome, isEatOutside }) =>
      setIsReacted({ isCookAtHome, isEatOutside })
    );

    return () => {
      socketConnection?.emit("leavePerson");
      socketConnection?.off("usersInReactions");
      socketConnection?.off("isBlocker");
      socketConnection?.off("isFavorite");
      socketConnection?.off("isBlocked", handleIsBlockedPerson);
      socketConnection?.off("isReacted");
    };
  }, [socketConnection, params?.id, isReacted, location.pathname]);

  return (
    <div className="min-h-screen p-1 sm:p-2 md:p-3 flex flex-col gap-2 text-center items-center">
      {person && (
        <>
          {/* Photos */}
          <div className="h-96 w-full sm:w-5/6 lg:w-3/5 border border-primary p-1 rounded-md">
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
          <div className="w-full sm:w-5/6 lg:w-3/5 flex flex-col gap-4">
            {/* Info */}
            <div>
              <h1 className="text-2xl font-bold">
                {person.username}
                {age !== 0 && (
                  <span>
                    , {age} {t("title.t1")}
                  </span>
                )}
              </h1>

              {person.country && (
                <h3 className="text-xl">
                  <span className="font-bold">{t("title.t2")}:</span>{" "}
                  {person.country}
                </h3>
              )}

              {person.gender && (
                <h4 className="text-xl">
                  <span className="font-bold">{t("title.t3")}:</span>{" "}
                  {person.gender}
                </h4>
              )}

              {person.dietaryPreferences && (
                <h5 className="text-xl">
                  <span className="font-bold">{t("title.t4")}:</span>{" "}
                  {person.dietaryPreferences}
                </h5>
              )}
            </div>

            {/* Barra */}
            <div className="bg-primary p-2 text-xl md:text-2xl lg:text-3xl xl:text-4xl flex gap-3 sm:gap-4 md:gap-5 xl:gap-6 justify-center items-center text-center rounded-md">
              <button
                title={t("bar.t1")}
                onClick={() => navigate(-1)}
                className="bg-secondary hover:bg-tertiary p-2 focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset rounded-md"
              >
                <FaAngleLeft />
              </button>

              <button
                title={
                  isReacted.isCookAtHome
                    ? t("bar.t2.isReacted")
                    : t("bar.t2.isNotReacted")
                }
                onClick={handleCookAtHome}
                className={
                  isReacted.isCookAtHome
                    ? "bg-gray-200 p-2 rounded-md cursor-default"
                    : "bg-secondary hover:bg-tertiary p-2 focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset rounded-md"
                }
              >
                <ImSpoonKnife />
              </button>

              <button
                title={
                  isReacted.isEatOutside
                    ? t("bar.t3.isReacted")
                    : t("bar.t3.isNotReacted")
                }
                onClick={handleEatOutside}
                className={
                  isReacted.isEatOutside
                    ? "bg-gray-200 p-2 rounded-md cursor-default"
                    : "bg-secondary hover:bg-tertiary p-2 focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset rounded-md"
                }
              >
                <IoFastFoodOutline />
              </button>

              <Link
                title={`${t("bar.t4")} ${person.username}`}
                to={`/chat/${person._id}`}
                className="bg-secondary hover:bg-tertiary p-2 focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset rounded-md"
              >
                <IoChatboxOutline />
              </Link>

              <button
                title={
                  isFavorite
                    ? t("bar.t5.isFavorite")
                    : t("bar.t5.isNotFavorite")
                }
                onClick={(e) => {
                  e.preventDefault();

                  if (isFavorite) handleUnmarkAsFavorite();
                  else handleMarkAsFavorite();
                }}
                className="bg-secondary hover:bg-tertiary p-2 focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset rounded-md"
              >
                {isFavorite ? <FaStar /> : <FaRegStar />}
              </button>

              <button
                title={
                  isBlocked ? t("bar.t6.isBlocked") : t("bar.t6.isNotBlocked")
                }
                onClick={(e) => {
                  e.preventDefault();

                  if (isBlocked) handleUnblockPerson();
                  else handleBlockPerson();
                }}
                className="bg-secondary hover:bg-tertiary p-2 focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset rounded-md"
              >
                {isBlocked ? <CgUnblock /> : <PiKnifeFill />}
              </button>

              <Link
                to={`/reportPerson/${params.id}`}
                title={t("bar.t7")}
                className="bg-secondary hover:bg-tertiary p-2 focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset rounded-md"
              >
                <MdOutlineReportGmailerrorred />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Person;
