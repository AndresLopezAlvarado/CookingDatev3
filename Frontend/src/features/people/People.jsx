import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { VscEmptyWindow } from "react-icons/vsc";
import { TiMessages } from "react-icons/ti";
import PeopleGrid from "./PeopleGrid";
import { useGetPeopleQuery } from "./peopleApiSlice";
import { setOnlineUser } from "../auth/authSlice";
import { useSocket } from "../../contexts/SocketContext";

const People = () => {
  const dispatch = useDispatch();
  const socketConnection = useSocket();

  const {
    data: people,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPeopleQuery();

  const [showType, setShowType] = useState();

  useEffect(() => {
    if (socketConnection)
      socketConnection.on("onlineUser", (data) =>
        dispatch(setOnlineUser(data))
      );

    return () => socketConnection?.off("onlineUser");
  }, [socketConnection, dispatch]);

  return (
    <div className="h-screen w-full p-1 gap-y-1 flex flex-col">
      {/* Barra */}
      <div className="bg-[#FF3B30] p-2 w-full rounded-md flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <h1 className="font-bold">View:</h1>

          <button
            className="bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md"
            onClick={() => setShowType("card")}
          >
            Card
          </button>

          <button
            className="bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md"
            onClick={() => setShowType("table")}
          >
            Table
          </button>
        </div>

        <Link to="/chats">
          <TiMessages className="text-3xl" />
        </Link>
      </div>

      {/* People */}
      <div className="flex flex-col flex-1 overflow-y-auto items-center text-center">
        {people ? (
          people.length === 0 ? (
            <div className="flex flex-col flex-1 justify-center items-center">
              <VscEmptyWindow className="w-48 h-48" />

              <h1>There are no people!</h1>
            </div>
          ) : showType === "table" ? (
            <></>
          ) : (
            <PeopleGrid people={people} />
          )
        ) : null}
      </div>
    </div>
  );
};

export default People;
