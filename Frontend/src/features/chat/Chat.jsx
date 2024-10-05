import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaAngleLeft } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import moment from "moment";
import Avatar from "../../components/Avatar";
import Spinner from "../../components/Spinner";
import backgroundImage from "../../assets/wallpaper.jpeg";
import { useSocket } from "../../contexts/SocketContext";
import { selectCurrentUser } from "../auth/authSlice";
import uploadFile from "../../helpers/uploadFiles";
import { useLocation } from "react-router-dom";

const Chat = () => {
  const location = useLocation();
  const socketConnection = useSocket();
  const user = useSelector(selectCurrentUser);
  const params = useParams();
  const currentMessage = useRef(null);
  const [receiverUser, setReceiverUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);

  const [usersInChat, setUsersInChat] = useState([]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);

    setOpenImageVideoUpload(false);

    setMessage((prev) => ({ ...prev, imageUrl: uploadPhoto?.url }));
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);

    setOpenImageVideoUpload(false);

    setMessage((prev) => ({ ...prev, videoUrl: uploadPhoto?.url }));
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => ({ ...prev, videoUrl: "" }));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((prev) => ({ ...prev, text: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl)
      if (socketConnection) {
        socketConnection.emit("newMessage", {
          sender: user?._id,
          receiver: params.id,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });

        if (!usersInChat.includes(params.id)) {
          socketConnection.emit("newNotification", {
            sender: user?._id,
            receiver: params.id,
            content: message.text,
            type: "message",
          });
        }

        setMessage({ text: "", imageUrl: "", videoUrl: "" });
      }
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("joinChat");

      socketConnection.emit("getConversation", params.id);

      socketConnection.on("receiverUser", (receiverUser) =>
        setReceiverUser(receiverUser)
      );

      socketConnection.on("messages", (messages) => {
        setAllMessages(messages);

        socketConnection.emit("seenMessages", params.id);
      });

      socketConnection.on("usersInChat", (usersInChat) => {
        setUsersInChat(usersInChat);
      });
    }

    return () => {
      socketConnection?.off("receiverUser");
      socketConnection?.off("messages");
      socketConnection?.off("isReceiverInChat");
      socketConnection?.emit("leaveChat");
    };
  }, [socketConnection, params?.id, location.pathname]);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessages]);

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="h-[calc(100vh-64px)] flex flex-col no-bg-repeat bg-cover"
    >
      <header className="h-16 px-4 bg-white flex justify-between items-center">
        <div className="flex justify-center items-center gap-4">
          <Link
            to={`/people/${receiverUser._id}`}
            className="lg:hidden bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md"
          >
            <FaAngleLeft size={17} />
          </Link>

          <Avatar
            userId={receiverUser?._id}
            name={receiverUser?.name}
            imageUrl={receiverUser?.profile_pic}
          />

          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {receiverUser?.name}
            </h3>

            <p className="-my-1 text-sm">
              {receiverUser?.online ? (
                <span className="text-[#FFCC00]">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>

        <button className="bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md cursor-pointer">
          <HiDotsVertical size={17} />
        </button>
      </header>

      <section className="relative h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar">
        <div className="flex flex-col gap-1 p-4" ref={currentMessage}>
          {allMessages.map((msg, index) => {
            return (
              <div
                key={index}
                className={`flex ${
                  user._id === msg?.msgByUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg w-auto max-w-[280px] md:max-w-sm lg:max-w-md break-words shadow-md ${
                    user._id === msg?.msgByUserId
                      ? "bg-[#FF3B30] ml-auto"
                      : "bg-[#FF9500] mr-auto"
                  }`}
                >
                  <div className="relative">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="w-full h-full object-scale-down rounded"
                      />
                    )}

                    {msg?.videoUrl && (
                      <video
                        src={msg?.videoUrl}
                        className="w-full h-full object-scale-down rounded"
                        controls
                      />
                    )}
                  </div>

                  <p className="px-2 break-words">{msg.text}</p>

                  <p className="px-2 text-xs flex justify-end">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {message.imageUrl && (
          <div className="w-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden p-4">
            <div
              onClick={handleClearUploadImage}
              className="absolute top-0 right-0 p-2 cursor-pointer hover:text-red-600"
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3 rounded">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm object-scale-down"
              />
            </div>
          </div>
        )}

        {message.videoUrl && (
          <div className="w-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden p-4">
            <div
              onClick={handleClearUploadVideo}
              className="absolute top-0 right-0 p-2 cursor-pointer hover:text-red-600"
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3 rounded">
              <video
                src={message.videoUrl}
                alt="uploadVideo"
                className="aspect-square w-full h-full max-w-sm object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full sticky bottom-0 flex justify-center items-center p-4">
            <Spinner />
          </div>
        )}
      </section>

      <section className="bg-white h-16 flex items-center px-4">
        <div className="relative">
          <button
            onClick={handleUploadImageVideoOpen}
            className="bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md cursor-pointer"
          >
            <FaPlus size={17} />
          </button>

          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-[#FF3B30]">
                    <FaImage size={18} />
                  </div>

                  <p>Image</p>
                </label>

                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-[#FF9500]">
                    <FaVideo size={18} />
                  </div>

                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        <form
          className="h-full w-full flex justify-center items-center gap-2"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type here..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />

          <button className="h-10 bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md cursor-pointer">
            <IoMdSend size={17} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
