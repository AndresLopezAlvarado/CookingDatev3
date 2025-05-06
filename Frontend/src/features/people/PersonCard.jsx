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
      className="relative h-52 sm:h-56 md:h-60 lg:h-64 xl:h-[310px] 2xl:h-[350px] ring-primary hover:ring-4 flex flex-col items-center justify-end bg-cover bg-center rounded-md cursor-pointer"
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

      <h1 className="bg-primary text-tertiary text-lg font-bold px-1 rounded-md">
        {firstName}
      </h1>
    </div>
  );
};

export default PersonCard;
