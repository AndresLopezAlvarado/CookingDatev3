import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ImSpoonKnife } from "react-icons/im";
import { selectOnlineUsers } from "../auth/authSlice";

const PersonCard = ({ person }) => {
  const onlineUsers = useSelector(selectOnlineUsers);
  const isOnline = onlineUsers?.includes(person._id);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(null);

  const splitUsername = () => {
    const usernameParts = person.username.split(" ");
    const firstPart = usernameParts[0];

    setFirstName(firstPart);
  };

  useEffect(() => {
    splitUsername();
  }, []);

  return (
    <div
      className="h-64 ring-[#FF3B30] hover:ring-4 hover:text-opacity-70 flex flex-col items-center justify-end bg-cover bg-center rounded-md cursor-pointer relative"
      style={
        person.profilePicture
          ? { backgroundImage: `url(${person.profilePicture.url})` }
          : { backgroundImage: `url("/noProfilePhoto.png")` }
      }
      onClick={() => {
        navigate(`/people/${person._id}`);
      }}
    >
      {isOnline && (
        <div className="absolute top-2 right-2 bg-green-500 p-2 rounded-full" />
      )}

      <h1 className="bg-[#FF3B30] text-xl font-bold px-2 m-1 rounded-md">
        {firstName}
      </h1>
    </div>
  );
};

export default PersonCard;
