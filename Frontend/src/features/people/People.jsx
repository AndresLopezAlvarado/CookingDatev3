import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { VscEmptyWindow } from "react-icons/vsc";
import { TiMessages } from "react-icons/ti";
import { FaStar } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { useGetPeopleQuery } from "./peopleApiSlice";
import { selectCurrentUser } from "../auth/authSlice";
import { useSocket } from "../../contexts/SocketContext";
import Spinner from "../../components/Spinner";
import PeopleGrid from "./PeopleGrid";
import { useTranslation } from "react-i18next";

const People = () => {
  const location = useLocation();
  const { socketConnection } = useSocket();
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(true);
  const user = useSelector(selectCurrentUser);
  const {
    data: people,
    isLoading,
    refetch,
  } = useGetPeopleQuery({ userId: user._id }, { skip: !gpsLocation });
  const { t } = useTranslation(["people"]);

  useEffect(() => {
    const handlePersonBlockedPeople = () => refetch();

    socketConnection?.emit("joinPeople");

    if (navigator.geolocation) {
      setIsFetchingLocation(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          socketConnection?.emit("updateLocation", {
            userId: user._id,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setIsFetchingLocation(false);
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          setIsFetchingLocation(false);
        }
      );
    }

    socketConnection?.on("locationUpdated", () => refetch());
    socketConnection?.on("personBlocked", handlePersonBlockedPeople);

    return () => {
      socketConnection?.emit("leavePeople");
      socketConnection?.off("locationUpdated", () => refetch());
      socketConnection?.off("personBlocked", handlePersonBlockedPeople);
    };
  }, [socketConnection, refetch, location.pathname]);

  return (
    <div className="h-screen w-full p-1 gap-y-1 flex flex-col">
      {/* Barra */}
      <div className="bg-[#FF3B30] font-bold p-2 rounded-md text-4xl flex space-x-8 justify-center items-center text-center">
        <Link
          title={t("bar.t1")}
          to="/chats"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <TiMessages />
        </Link>

        <Link
          title={t("bar.t2")}
          to="/reactions"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <MdEmojiEmotions />
        </Link>

        <Link
          title={t("bar.t3")}
          to="/favorites"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <FaStar />
        </Link>

        <Link
          title={t("bar.t4")}
          to="/recipe"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <GiPerspectiveDiceSixFacesRandom />
        </Link>
      </div>

      {/* People */}
      {isFetchingLocation ? (
        <h1 className="font-bold text-xl text-center">{t("title.t1")}</h1>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col flex-1 overflow-y-auto items-center text-center">
          {people &&
            (people?.length === 0 ? (
              <div className="flex flex-col flex-1 justify-center items-center">
                <VscEmptyWindow className="w-48 h-48" />

                <h1>{t("title.t2")}</h1>
              </div>
            ) : (
              <PeopleGrid people={people} />
            ))}
        </div>
      )}
    </div>
  );
};

export default People;
