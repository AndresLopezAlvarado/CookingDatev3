import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoChatboxOutline } from "react-icons/io5";
import { MdEmojiEmotions } from "react-icons/md";
import {
  Menu,
  MenuItem,
  MenuItems,
  MenuButton,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSocket } from "../contexts/SocketContext";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../features/auth/authSlice";
import { useLogOutMutation } from "../features/auth/authApiSlice";
import { useTranslation } from "react-i18next";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const { socketConnection } = useSocket();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [logOut, { isLoading }] = useLogOutMutation();
  const [notifications, setNotifications] = useState(null);
  const { t, i18n } = useTranslation(["navbar"]);
  const navigate = useNavigate();

  const buildNavigation = () => [
    { name: t("navigation.language"), href: "/language", current: false },
    { name: t("navigation.signIn"), href: "/signIn", current: false },
  ];

  const buildNavIsAuthenticated = () => [
    { name: t("navigation.people"), href: "/people", current: false },
    { name: t("navigation.language"), href: "/language", current: false },
    { name: t("navigation.settings"), href: "/settings", current: false },
  ];

  const buildUserSetting = () => [
    {
      name: t("navigation.profile"),
      href: user ? `/profile/${user._id}` : "#",
      current: false,
    },
    { name: t("navigation.signOut"), href: "/", current: false },
  ];

  const [navigation, setNavigation] = useState(buildNavigation);

  const [navIsAuthenticated, setNavIsAuthenticated] = useState(
    buildNavIsAuthenticated
  );

  const [userSetting, setUserSetting] = useState([
    { name: "Profile", href: "#", current: false },
    { name: "Sign out", href: "/", current: false },
  ]);

  const changeCurrent = (itemName) => {
    const updatedNavigation = navigation.map((item) => {
      if (item.name === itemName) return { ...item, current: true };
      else return { ...item, current: false };
    });

    const updatedNavIsAuthenticated = navIsAuthenticated.map((item) => {
      if (item.name === itemName) return { ...item, current: true };
      else return { ...item, current: false };
    });

    setNavigation(updatedNavigation);
    setNavIsAuthenticated(updatedNavIsAuthenticated);
  };

  const handleLogOut = async () => {
    try {
      await logOut();

      navigate("/");
    } catch (error) {
      console.log({ "error en handleLogOut": error });
    }
  };

  useEffect(() => {
    setNavigation(buildNavigation());
    setNavIsAuthenticated(buildNavIsAuthenticated());
    setUserSetting(buildUserSetting());
  }, [i18n.language, user]);

  useEffect(() => {
    const handleUnseenNotifications = (unseenNotifications) =>
      setNotifications(unseenNotifications);

    const handlePersonBlockedNotifications = () =>
      socketConnection?.emit("getNotifications");

    socketConnection?.emit("getNotifications");
    socketConnection?.on("unseenNotifications", handleUnseenNotifications);
    socketConnection?.on("personBlocked", handlePersonBlockedNotifications);

    return () => {
      socketConnection?.off("unseenNotifications", handleUnseenNotifications);
      socketConnection?.off("personBlocked", handlePersonBlockedNotifications);
    };
  }, [socketConnection]);

  return (
    <header className="bg-primary p-2 flex items-center h-12 w-full fixed left-0 top-0 z-20">
      {isAuthenticated ? (
        <nav className="w-full flex">
          {/* Button to display the left panel menu */}
          <Menu as={"div"} className={"flex items-center"}>
            {({ open }) => (
              <>
                <MenuButton className="md:hidden bg-secondary hover:bg-tertiary rounded-md">
                  {open ? (
                    <XMarkIcon className="h-8 ring-tertiary ring-2 rounded-md" />
                  ) : (
                    <Bars3Icon className="h-8" />
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
                  <MenuItems className="absolute bg-secondary top-12 z-10 w-fit space-y-1 p-2 rounded-md">
                    {navIsAuthenticated.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-tertiary hover:bg-primary"
                              : "bg-primary hover:bg-tertiary",
                            "block font-bold p-1 rounded-md"
                          )}
                          aria-current={item.current ? "page" : undefined}
                          onClick={(t) => changeCurrent(item.name)}
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Transition>
              </>
            )}
          </Menu>

          {/* Logo - Title - Links */}
          <div className="flex-1 flex justify-center items-center gap-2">
            {/* Logo - Title */}
            <div className="flex justify-center items-center gap-2">
              {/* Logo */}
              <Link to="/people" onClick={changeCurrent}>
                <img
                  className="h-8"
                  src="/potHearts.png"
                  alt="Cooking Date logo"
                />
              </Link>

              {/* Title */}
              <h1 className="hidden sm:block md:hidden text-tertiary text-3xl font-bold">
                Cooking Date
              </h1>
            </div>

            {/* Links */}
            <div className="hidden md:block">
              <div className="flex space-x-1">
                {navIsAuthenticated.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-tertiary hover:bg-secondary"
                        : "bg-secondary hover:bg-tertiary",
                      "font-bold p-1 rounded-md"
                    )}
                    aria-current={item.current ? "page" : undefined}
                    onClick={(t) => changeCurrent(item.name)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications - User´s settings */}
          <div className="flex justify-center items-center gap-1">
            {/* Notifications button */}
            <Menu as={"div"} className={"flex items-center"}>
              {({ open }) => (
                <>
                  <div className="relative flex items-center">
                    <MenuButton
                      className={
                        open
                          ? "bg-secondary hover:bg-tertiary h-8 w-8 p-1 ring-tertiary ring-2 rounded-full"
                          : "bg-secondary hover:bg-tertiary h-8 w-8 p-1 rounded-full"
                      }
                    >
                      <BellIcon />
                    </MenuButton>

                    {!open && notifications?.length > 0 && (
                      <div className="absolute bg-tertiary font-bold text-xs h-5 w-5 z-10 -top-1 -left-1 flex items-center justify-center rounded-full">
                        {notifications.length}
                      </div>
                    )}
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute bg-secondary top-12 right-2 z-10 w-fit space-y-1 p-2 rounded-md">
                      {notifications?.length === 0 ? (
                        <MenuItem>
                          <p className="bg-primary hover:bg-tertiary block font-bold p-1 rounded-md">
                            {t("navigation.noNotifications")}
                          </p>
                        </MenuItem>
                      ) : (
                        notifications?.map((notification) => (
                          <MenuItem key={notification._id}>
                            <Link
                              to={
                                notification.type === "message"
                                  ? `/chat/${notification.sender._id}`
                                  : `/reactions`
                              }
                              onClick={() =>
                                socketConnection?.emit(
                                  "seenNotification",
                                  notification._id
                                )
                              }
                              className="bg-primary hover:bg-tertiary block p-1 rounded-md"
                            >
                              {notification.type === "message" ? (
                                <label className="flex items-center gap-1">
                                  <span className="font-bold flex items-center gap-1">
                                    <IoChatboxOutline />
                                    {notification.sender.username}:
                                  </span>
                                  {notification.content}
                                </label>
                              ) : (
                                <label className="flex items-center gap-1">
                                  <span className="font-bold flex items-center gap-1">
                                    <MdEmojiEmotions />
                                    {notification.sender.username}:
                                  </span>
                                  {t(
                                    {
                                      "They invited you to cook at home!":
                                        "navigation.cookAtHome",
                                      "They invited you to eat out!":
                                        "navigation.eatOutside",
                                    }[notification.content]
                                  )}
                                </label>
                              )}
                            </Link>
                          </MenuItem>
                        ))
                      )}
                    </MenuItems>
                  </Transition>
                </>
              )}
            </Menu>

            {/* User´s settings button */}
            <Menu as={"div"} className={"flex items-center"}>
              {({ open }) => (
                <>
                  <MenuButton>
                    <img
                      className={
                        open
                          ? "h-8 w-8 ring-tertiary ring-2 rounded-full"
                          : "h-8 w-8 rounded-full"
                      }
                      src={
                        user?.profilePicture
                          ? user.profilePicture.url
                          : "/noProfilePhoto.png"
                      }
                      alt="profilePicture"
                    />
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
                    <MenuItems className="absolute bg-secondary right-2 top-12 z-10 w-fit space-y-1 p-2 rounded-md">
                      {userSetting.map((item) => (
                        <MenuItem key={item.name}>
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-tertiary hover:bg-primary"
                                : "bg-primary hover:bg-tertiary",
                              "block font-bold p-1 rounded-md"
                            )}
                            aria-current={item.current ? "page" : undefined}
                            onClick={(e) => {
                              changeCurrent(item.name);

                              if (
                                ["Sign out", "Cerrar sesión"].includes(
                                  e.target.text
                                )
                              ) {
                                e.preventDefault();

                                handleLogOut();
                              }
                            }}
                          >
                            {item.name}
                          </Link>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </nav>
      ) : (
        <nav className="w-full flex">
          {/* Button to display the left panel menu */}
          <Menu as={"div"} className={"flex items-center"}>
            {({ open }) => (
              <>
                <MenuButton className="md:hidden bg-secondary hover:bg-tertiary rounded-md">
                  {open ? (
                    <XMarkIcon className="h-8 ring-tertiary ring-2 rounded-md" />
                  ) : (
                    <Bars3Icon className="h-8" />
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
                  <MenuItems className="absolute bg-secondary top-12 z-10 w-fit space-y-1 p-2 rounded-md">
                    {navigation.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-tertiary hover:bg-primary"
                              : "bg-primary hover:bg-tertiary",
                            "block font-bold p-1 rounded-md"
                          )}
                          aria-current={item.current ? "page" : undefined}
                          onClick={(t) => changeCurrent(item.name)}
                        >
                          {item.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Transition>
              </>
            )}
          </Menu>

          {/* Logo - Title - Links */}
          <div className="flex-1 flex justify-center items-center gap-2">
            {/* Logo - Title */}
            <div className="flex justify-center items-center gap-2">
              {/* Logo */}
              <Link to="/" onClick={changeCurrent}>
                <img
                  className="h-8"
                  src="/potHearts.png"
                  alt="Cooking Date logo"
                />
              </Link>

              {/* Title */}
              <h1 className="hidden sm:block md:hidden text-tertiary text-3xl font-bold">
                Cooking Date
              </h1>
            </div>

            {/* Links */}
            <div className="hidden md:block">
              <div className="flex space-x-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-tertiary hover:bg-secondary"
                        : "bg-secondary hover:bg-tertiary",
                      "font-bold p-1 rounded-md"
                    )}
                    aria-current={item.current ? "page" : undefined}
                    onClick={(t) => changeCurrent(item.name)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
