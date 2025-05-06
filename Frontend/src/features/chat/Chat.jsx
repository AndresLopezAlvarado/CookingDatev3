import { useEffect, useRef, useState, Fragment } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaAngleLeft } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { CgUnblock } from "react-icons/cg";
import { PiKnifeFill } from "react-icons/pi";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import {
  Menu,
  MenuItem,
  MenuItems,
  MenuButton,
  Transition,
} from "@headlessui/react";
import moment from "moment";
import { useSocket } from "../../contexts/SocketContext";
import Avatar from "../../components/Avatar";
import Spinner from "../../components/Spinner";
import backgroundImage from "../../assets/wallpaper.jpeg";
import { selectCurrentUser } from "../auth/authSlice";
import uploadFile from "../../helpers/uploadFiles";
import { useTranslation } from "react-i18next";

const Chat = () => {
  const location = useLocation();
  const { socketConnection } = useSocket();
  const user = useSelector(selectCurrentUser);
  const params = useParams();
  const navigate = useNavigate();
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
  const [isBlocked, setIsBlocked] = useState(false);
  const [usersInChat, setUsersInChat] = useState([]);
  const { t } = useTranslation(["chat"]);

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

        if (!usersInChat.includes(params.id))
          socketConnection.emit("newNotification", {
            sender: user?._id,
            receiver: params.id,
            content: message.text,
            type: "message",
          });

        setMessage({ text: "", imageUrl: "", videoUrl: "" });
      }
  };

  const handleBlockPerson = async () => {
    try {
      socketConnection?.emit("blockPerson", params.id);

      socketConnection?.emit("getIsBlocked", params.id);
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleUnblockPerson = async () => {
    try {
      socketConnection?.emit("unblockPerson", params.id);

      socketConnection?.emit("getIsBlocked", params.id);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const handleIsBlockedChat = (isBlocked) => setIsBlocked(isBlocked);

    socketConnection?.emit("joinChat");

    socketConnection?.on("usersInChat", (usersInChat) =>
      setUsersInChat(usersInChat)
    );

    socketConnection?.emit("getIsBlocked", params.id);

    socketConnection?.on("isBlocked", handleIsBlockedChat);

    socketConnection?.emit("getConversation", params.id);

    socketConnection?.on("receiverUser", (receiverUser) =>
      setReceiverUser(receiverUser)
    );

    socketConnection?.on("messages", (messages) => {
      socketConnection.emit("seenMessages", params.id);

      setAllMessages(messages);
    });

    return () => {
      socketConnection?.emit("leaveChat");
      socketConnection?.off("usersInChat");
      socketConnection?.off("isBlocked", handleIsBlockedChat);
      socketConnection?.off("receiverUser");
      socketConnection?.off("messages");
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
      className="min-h-screen p-1 flex flex-col gap-1 no-bg-repeat bg-cover"
    >
      <nav className="bg-primary p-2 fixed top-14 inset-x-1 z-10 flex gap-8 justify-between items-center rounded-md">
        <button
          title={t("bar.t1")}
          onClick={() => navigate(-1)}
          className="bg-secondary hover:bg-tertiary focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset h-8 w-8 flex items-center justify-center rounded-md"
        >
          <FaAngleLeft className="text-2xl" />
        </button>

        <Link
          to={`/people/${receiverUser?._id}`}
          className="flex flex-grow gap-3 justify-center items-center"
        >
          <Avatar
            userId={receiverUser?._id}
            name={receiverUser?.name}
            imageUrl={receiverUser?.profile_pic}
          />

          <div className="flex flex-col">
            <h3 className="text-ellipsis text-base font-semibold line-clamp-1">
              {receiverUser?.name}
            </h3>

            <p className="-my-1 text-sm">
              {receiverUser?.online ? (
                <span className="text-tertiary">{t("bar.t2.online")}</span>
              ) : (
                <span className="text-slate-400">{t("bar.t2.offline")}</span>
              )}
            </p>
          </div>
        </Link>

        <Menu as={"div"} className={"relative flex items-center"}>
          {({ open }) => (
            <>
              <MenuButton className="bg-secondary hover:bg-tertiary rounded-md">
                {open ? (
                  <HiDotsVertical className="h-8 w-8 ring-tertiary ring-2 rounded-md" />
                ) : (
                  <HiDotsVertical className="h-8 w-8" />
                )}
              </MenuButton>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <MenuItems className="absolute bg-secondary right-0 top-11 z-10 w-fit space-y-1 p-2 rounded-md">
                  <MenuItem className="w-full">
                    <button
                      className="bg-primary hover:bg-tertiary block font-bold p-1 rounded-md"
                      onClick={(e) => {
                        e.preventDefault();

                        if (isBlocked) handleUnblockPerson();
                        else handleBlockPerson();
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {isBlocked ? (
                          <>
                            <CgUnblock size={25} />
                            <p className="whitespace-nowrap">
                              {t("bar.t3.isBlocked")}
                            </p>
                          </>
                        ) : (
                          <>
                            <PiKnifeFill size={25} />
                            <p className="whitespace-nowrap">
                              {t("bar.t3.isNotBlocked")}
                            </p>
                          </>
                        )}
                      </div>
                    </button>
                  </MenuItem>

                  <MenuItem>
                    <Link
                      className="bg-primary hover:bg-tertiary block font-bold p-1 rounded-md"
                      to={`/reportPerson/${receiverUser._id}`}
                    >
                      <div className="flex items-center gap-1">
                        <MdOutlineReportGmailerrorred size={25} />

                        <p className="whitespace-nowrap">{t("bar.t4")}</p>
                      </div>
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Transition>
            </>
          )}
        </Menu>
      </nav>

      <section className="relative h-[calc(100vh-108px)] overflow-x-hidden overflow-y-scroll">
        <div className="flex flex-col gap-1" ref={currentMessage}>
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
                  className={`max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl p-2 break-words rounded-md ${
                    user._id === msg?.msgByUserId
                      ? "bg-primary ml-auto"
                      : "bg-secondary mr-auto"
                  }`}
                >
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      className="w-full object-scale-down rounded-md"
                    />
                  )}

                  {msg?.videoUrl && (
                    <video
                      src={msg?.videoUrl}
                      className="w-full object-scale-down rounded-md"
                      controls
                    />
                  )}

                  <p>{msg.text}</p>

                  <p className="text-xs text-right">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {message.imageUrl && (
          <div className="sticky bottom-0 w-full p-4 bg-primary bg-opacity-45 flex justify-center items-center rounded-md">
            <div
              onClick={handleClearUploadImage}
              className="absolute top-4 right-4 bg-tertiary h-6 w-6 flex items-center justify-center cursor-pointer rounded-full"
            >
              <IoClose size={20} />
            </div>

            <img
              src={message.imageUrl}
              alt="Upload image"
              className="bg-white w-full max-w-sm object-scale-down rounded-md"
            />
          </div>
        )}

        {message.videoUrl && (
          <div className="sticky bottom-0 w-full p-4 bg-primary bg-opacity-45 flex justify-center items-center rounded-md">
            <div
              onClick={handleClearUploadVideo}
              className="absolute top-4 right-4 bg-tertiary h-6 w-6 flex items-center justify-center cursor-pointer rounded-full"
            >
              <IoClose size={20} />
            </div>

            <video
              src={message.videoUrl}
              alt="uploadVideo"
              className="bg-white w-full max-w-sm object-scale-down rounded-md"
              controls
              muted
              autoPlay
            />
          </div>
        )}

        {loading && (
          <div className="sticky bottom-0 w-full p-4 bg-primary bg-opacity-45 flex justify-center items-center rounded-md">
            <Spinner />
          </div>
        )}
      </section>

      <section className="bg-primary h-12 p-2 flex gap-1 items-center rounded-md">
        <div className="relative">
          <button
            onClick={handleUploadImageVideoOpen}
            className="bg-secondary hover:bg-tertiary h-8 w-8 flex items-center justify-center rounded-md"
          >
            <FaPlus />
          </button>

          {openImageVideoUpload && (
            <div className="absolute bottom-10 bg-secondary p-2 font-bold rounded-md">
              <form className="flex flex-col gap-1">
                <label
                  htmlFor="uploadImage"
                  className="bg-primary hover:bg-tertiary p-1 flex gap-1 items-center rounded-md cursor-pointer"
                >
                  <FaImage />

                  <p>{t("title.t1")}</p>
                </label>

                <label
                  htmlFor="uploadVideo"
                  className="bg-primary hover:bg-tertiary p-1 flex items-center gap-1 rounded-md cursor-pointer"
                >
                  <FaVideo />

                  <p>{t("title.t2")}</p>
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
          className="flex-1 flex gap-1"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type here..."
            className="bg-tertiary w-full p-1 placeholder:text-orange-400 rounded-md"
            value={message.text}
            onChange={handleOnChange}
          />

          <button className="bg-secondary hover:bg-tertiary h-8 w-8 flex items-center justify-center rounded-md">
            <IoMdSend />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
