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
    <div className="h-full flex flex-col">
      {/* Barra */}
      <nav className="bg-primary p-2 fixed top-14 inset-x-1 z-10 flex gap-8 justify-center rounded-md">
        {[
          {
            icon: <TiMessages className="text-2xl" />,
            to: "/chats",
            key: "t1",
          },
          {
            icon: <MdEmojiEmotions className="text-2xl" />,
            to: "/reactions",
            key: "t2",
          },
          {
            icon: <FaStar className="text-2xl" />,
            to: "/favorites",
            key: "t3",
          },
          {
            icon: <GiPerspectiveDiceSixFacesRandom className="text-2xl" />,
            to: "/recipe",
            key: "t4",
          },
        ].map((item) => (
          <Link
            key={item.key}
            title={t(`bar.${item.key}`)}
            to={item.to}
            className="bg-secondary h-8 w-8 flex items-center justify-center hover:bg-tertiary focus:ring-2 focus:ring-tertiary focus:ring-inset rounded-md"
          >
            {item.icon}
          </Link>
        ))}
      </nav>

      {/* People */}
      <main className="mt-14 flex-1 flex">
        {isFetchingLocation || isLoading ? (
          <div className="flex-1 flex flex-col gap-4 justify-center items-center">
            <h1 className="font-bold text-xl">{t("title.t1")}</h1>

            <Spinner />
          </div>
        ) : people?.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center">
            <VscEmptyWindow className="w-48 h-48" />

            <h1>{t("title.t2")}</h1>
          </div>
        ) : (
          <PeopleGrid people={people} />
        )}
      </main>
    </div>
  );
};

export default People;
