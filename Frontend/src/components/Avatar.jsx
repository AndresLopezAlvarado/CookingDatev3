import { useSelector } from "react-redux";
import { selectOnlineUsers } from "../features/auth/authSlice";

const Avatar = ({ userId, name, imageUrl }) => {
  const onlineUsers = useSelector(selectOnlineUsers);
  const isOnline = onlineUsers?.includes(userId);

  return (
    <div className={`text-slate-800 relative rounded-full font-bold`}>
      <img
        className="h-12 w-12 overflow-hidden rounded-full"
        src={imageUrl ? imageUrl : "/noProfilePhoto.png"}
        alt={name}
      />

      {isOnline && (
        <div className="bg-green-500 p-1 absolute bottom-2 -right-1 z-10 rounded-full" />
      )}
    </div>
  );
};

export default Avatar;
