import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectOnlineUsers } from "../auth/authSlice";

const PersonCard = ({ person }) => {
  const onlineUsers = useSelector(selectOnlineUsers);
  const isOnline = onlineUsers?.includes(person._id);
  const navigate = useNavigate();
  const firstName = person.username.split(" ")[0];

  return (
    <div
      className="m-1 h-64 ring-[#FF3B30] hover:ring-4 hover:text-opacity-70 flex flex-col items-center justify-end bg-cover bg-center rounded-md cursor-pointer relative"
      style={
        person.profilePicture.url
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
