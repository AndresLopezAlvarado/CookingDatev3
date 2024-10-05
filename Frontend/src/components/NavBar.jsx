import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  MenuItem,
  MenuItems,
  MenuButton,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../features/auth/authSlice";
import { useLogOutMutation } from "../features/auth/authApiSlice";
import { useSocket } from "../contexts/SocketContext";
import { setOnlineUser } from "../features/auth/authSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavBar = () => {
  const dispatch = useDispatch();
  const socketConnection = useSocket();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [logOut, { isLoading }] = useLogOutMutation();
  const [notifications, setNotifications] = useState([]);

  const [navigation, setNavigation] = useState([
    { name: "Products", href: "/products", current: false },
    { name: "Information", href: "/information", current: false },
    { name: "Security", href: "/security", current: false },
    { name: "Help", href: "/help", current: false },
    { name: "Download", href: "/download", current: false },
    { name: "Language", href: "/language", current: false },
    { name: "Sign in", href: "/signIn", current: false },
  ]);

  const [navIsAuthenticated, setNavIsAuthenticated] = useState([
    { name: "People", href: "/people", current: false },
    { name: "Profile", href: "#", current: false },
    { name: "Settings", href: "/settings", current: false },
  ]);

  const [userSetting, setUserSetting] = useState([
    { name: "Profile", href: "#", current: false },
    { name: "Settings", href: "/settings", current: false },
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
      await logOut().unwrap();
    } catch (error) {
      console.log({ "error en handleLogOut": error });
    }
  };

  useEffect(() => {
    setNavIsAuthenticated([
      { name: "People", href: "/people", current: false },
      {
        name: "Profile",
        href: user ? `/profile/${user._id}` : "#",
        current: false,
      },
      { name: "Settings", href: "/settings", current: false },
    ]);

    setUserSetting([
      {
        name: "Profile",
        href: user ? `/profile/${user._id}` : "#",
        current: false,
      },
      ,
      { name: "Settings", href: "/settings", current: false },
      { name: "Sign out", href: "/", current: false },
    ]);
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && socketConnection) {
      socketConnection.on("onlineUsers", (onlineUsers) =>
        dispatch(setOnlineUser(onlineUsers))
      );

      socketConnection.emit("joinNotifications");

      socketConnection.emit("getNotifications");

      socketConnection.on("unseenNotifications", (unseenNotifications) =>
        setNotifications(unseenNotifications)
      );
    }

    return () => {
      socketConnection?.off("onlineUsers");
      socketConnection?.off("unseenNotifications");
    };
  }, [socketConnection, isAuthenticated, dispatch]);

  return (
    <nav className="bg-[#FF3B30] fixed px-4 mx-auto left-0 top-0 z-10 w-full">
      {isAuthenticated ? (
        <div className="flex h-16 items-center">
          {/* Button to display the left panel menu */}
          <Menu as="div">
            {({ open }) => (
              <>
                <MenuButton className="md:hidden bg-[#FF9500] hover:bg-[#FFCC00] rounded-md">
                  {open ? (
                    <XMarkIcon className="h-8 ring-white ring-2 rounded-md" />
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
                  <MenuItems className="absolute bg-[#FF3B30] left-0 z-10 w-48 space-y-2 p-2 mt-4 rounded-md">
                    {navIsAuthenticated.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-[#FFCC00] hover:bg-[#FF9500]"
                              : "bg-[#FF9500] hover:bg-[#FFCC00]",
                            "block font-bold p-2 rounded-md"
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
          <div className="flex flex-1 justify-center gap-x-8">
            {/* Logo - Title */}
            <div className="flex flex-shrink-0 items-center gap-x-2">
              {/* Logo */}
              <Link to="/people" onClick={changeCurrent}>
                <img className="h-8" src="/potHearts.png" alt="logoApp" />
              </Link>

              {/* Title */}
              <h1 className="hidden sm:block md:hidden text-[#FFCC00] text-3xl font-bold">
                Cooking Date
              </h1>
            </div>

            {/* Links */}
            <div className="hidden md:block">
              <div className="flex space-x-2">
                {navIsAuthenticated.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-[#FFCC00] hover:bg-[#FF9500]"
                        : "bg-[#FF9500] hover:bg-[#FFCC00]",
                      "font-bold p-2 rounded-md"
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
          <div className="flex items-center gap-x-3">
            {/* Notifications button */}
            <Menu as="div">
              {({ open }) => (
                <>
                  <div>
                    <MenuButton
                      className={
                        open
                          ? "bg-[#FF9500] hover:bg-[#FFCC00] h-10 w-10 p-1 ring-white ring-2 rounded-full"
                          : "bg-[#FF9500] hover:bg-[#FFCC00] h-10 w-10 p-1 rounded-full"
                      }
                    >
                      <BellIcon />
                    </MenuButton>

                    <div className="absolute bg-[#FFCC00] font-bold px-2 z-10 top-0 rounded-full">
                      {notifications?.length === 0
                        ? null
                        : notifications?.length}
                    </div>
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
                    <MenuItems className="absolute bg-[#FF3B30] right-0 z-10 w-48 space-y-2 p-2 mt-4 rounded-md">
                      {notifications?.length === 0 ? (
                        <MenuItem>
                          <p className="bg-[#FF9500] hover:bg-[#FFCC00] block font-bold p-2 rounded-md">
                            No notifications
                          </p>
                        </MenuItem>
                      ) : (
                        notifications?.map((notification) => (
                          <MenuItem key={notification._id}>
                            <Link
                              to={
                                notification.type === "message"
                                  ? `/chat/${notification.sender}`
                                  : `/people/${notification.sender}`
                              }
                              onClick={() =>
                                socketConnection.emit(
                                  "seenNotification",
                                  notification._id
                                )
                              }
                              className="bg-[#FF9500] hover:bg-[#FFCC00] block font-bold p-2 rounded-md"
                            >
                              {notification.type}: {notification.content}
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
            <Menu as="div">
              {({ open }) => (
                <>
                  <MenuButton className="rounded-full">
                    <img
                      className={
                        open
                          ? "h-10 w-10 ring-white ring-2 rounded-full"
                          : "h-10 w-10 rounded-full"
                      }
                      src={
                        user.profilePicture
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
                    <MenuItems className="absolute bg-[#FF3B30] right-0 z-10 w-48 space-y-2 p-2 mt-4 rounded-md">
                      {userSetting.map((item) => (
                        <MenuItem key={item.name}>
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-[#FFCC00] hover:bg-[#FF9500]"
                                : "bg-[#FF9500] hover:bg-[#FFCC00]",
                              "block font-bold p-2 rounded-md"
                            )}
                            aria-current={item.current ? "page" : undefined}
                            onClick={(e) => {
                              changeCurrent(item.name);

                              if (e.target.text === "Sign out") {
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
        </div>
      ) : (
        <div className="flex h-16 items-center">
          {/* Button to display the left panel menu */}
          {/* No funciona hover:bg-[#FFCC00]  */}
          <Menu as="div">
            {({ open }) => (
              <>
                <MenuButton className="md:hidden bg-[#FF9500] hover:bg-[#FFCC00] rounded-md">
                  {open ? (
                    <XMarkIcon className="h-8 ring-white ring-2 rounded-md" />
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
                  <MenuItems className="absolute bg-[#FF3B30] left-0 z-10 w-48 space-y-2 p-2 mt-4 rounded-md">
                    {navigation.map((item) => (
                      <MenuItem key={item.name}>
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-[#FFCC00] hover:bg-[#FF9500]"
                              : "bg-[#FF9500] hover:bg-[#FFCC00]",
                            "block font-bold p-2 rounded-md"
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
          <div className="flex flex-1 justify-center gap-x-8">
            {/* Logo - Title */}
            <div className="flex flex-shrink-0 items-center gap-x-2">
              {/* Logo */}
              <Link to="/" onClick={changeCurrent}>
                <img
                  className="h-8 w-auto"
                  src="/potHearts.png"
                  alt="logoApp"
                />
              </Link>

              {/* Title */}
              <h1 className="hidden sm:block md:hidden text-[#FFCC00] text-3xl font-bold">
                Cooking Date
              </h1>
            </div>

            {/* Links */}
            <div className="hidden md:block">
              <div className="flex space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-[#FFCC00] hover:bg-[#FF9500]"
                        : "bg-[#FF9500] hover:bg-[#FFCC00]",
                      "font-bold p-2 rounded-md"
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
        </div>
      )}
    </nav>
  );
};

export default NavBar;
