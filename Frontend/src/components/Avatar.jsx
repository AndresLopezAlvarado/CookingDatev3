import { useSelector } from "react-redux";
import { selectOnlineUsers } from "../features/auth/authSlice";

const Avatar = ({ userId, name, imageUrl }) => {
  const onlineUsers = useSelector(selectOnlineUsers);
  const isOnline = !!onlineUsers?.includes(userId);

  return (
    <div className="relative">
      <img
        className="h-8 w-8 rounded-full overflow-hidden"
        src={imageUrl || "/noProfilePhoto.png"}
        alt={name}
      />
      {isOnline && (
        <div className="absolute top-0 right-0 z-10 h-2 w-2 bg-green-500 rounded-full" />
      )}
    </div>
  );
};

export default Avatar;
