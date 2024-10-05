import { useSelector } from "react-redux";
import { PiUserCircle } from "react-icons/pi";
import { selectIsOnlineUser } from "../features/auth/authSlice";

const Avatar = ({ userId, name, imageUrl }) => {
  let avatarName = "";
  const onlineUser = useSelector(selectIsOnlineUser);
  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200",
  ];
  const randomNumber = Math.floor(Math.random() * 9);
  const isOnline = onlineUser?.includes(userId);

  if (name) {
    const splitName = name?.split(" ");

    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  return (
    <div className={`text-slate-800 relative rounded-full font-bold`}>
      {imageUrl ? (
        <img
          className="h-12 overflow-hidden rounded-full"
          src={imageUrl}
          alt={name}
        />
      ) : name ? (
        <div
          className={`h-12 overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle />
      )}

      {isOnline && (
        <div className="bg-green-500 p-1 absolute bottom-2 -right-1 z-10 rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;