import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Disclosure,
  Menu,
  MenuItem,
  MenuItems,
  MenuButton,
  Transition,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../features/auth/authSlice";
import { useLogOutMutation } from "../features/auth/authApiSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavBar = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [logOut, { isLoading }] = useLogOutMutation();

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
    { name: "Configuration", href: "/configuration", current: false },
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
      { name: "Configuration", href: "/configuration", current: false },
    ]);
  }, [user]);

  return (
    <Disclosure
      as="nav"
      className="bg-[#FF3B30] fixed left-0 top-0 z-10 w-full"
    >
      {({ open }) => (
        <>
          {isAuthenticated ? (
            <>
              <div className="container mx-auto px-4">
                <div className="flex h-16 items-center">
                  {/* Button to display the panel menu */}
                  {/* No funciona hover:bg-[#FFCC00]  */}
                  <DisclosureButton className="md:hidden h-8 w-8 bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:ring-2 focus:ring-inset focus:outline-none rounded-md">
                    {open ? <XMarkIcon /> : <Bars3Icon />}
                  </DisclosureButton>

                  <div className="flex flex-1 justify-center gap-x-8">
                    <div className="flex flex-shrink-0 items-center gap-x-2">
                      {/* Logo */}
                      <Link to="/people" onClick={changeCurrent}>
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

                  <div className="flex items-center gap-x-2">
                    {/* Notifications button */}
                    {/* No funciona hover:bg-[#FFCC00]  */}
                    <button className="h-8 w-8 bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:ring-2 focus:ring-inset focus:outline-none rounded-full">
                      <BellIcon />
                    </button>

                    {/* Profile dropdown */}
                    {user ? (
                      <Menu as="div">
                        <MenuButton className="focus:ring-white focus:ring-2 focus:ring-inset focus:outline-none rounded-full">
                          <img
                            className="h-10 w-10 rounded-full"
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
                            <MenuItem>
                              {({ isActive }) => (
                                <Link
                                  to={`/profile/${user._id}`}
                                  className={classNames(
                                    isActive ? "bg-[#FFCC00]" : "",
                                    "block font-bold p-2 rounded-md bg-[#FF9500]"
                                  )}
                                >
                                  Profile
                                </Link>
                              )}
                            </MenuItem>

                            <MenuItem>
                              {({ isActive }) => (
                                <Link
                                  to={`/settings`}
                                  className={classNames(
                                    isActive ? "bg-[#FFCC00]" : "",
                                    "block font-bold p-2 rounded-md bg-[#FF9500]"
                                  )}
                                >
                                  Settings
                                </Link>
                              )}
                            </MenuItem>

                            <MenuItem>
                              {({ isActive }) => (
                                <Link
                                  to={`/`}
                                  className={classNames(
                                    isActive ? "bg-[#FFCC00]" : "",
                                    "block font-bold p-2 rounded-md bg-[#FF9500]"
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleLogOut();
                                  }}
                                >
                                  Sign out
                                </Link>
                              )}
                            </MenuItem>
                          </MenuItems>
                        </Transition>
                      </Menu>
                    ) : null}
                  </div>
                </div>

                {/* Drop down panel */}
                <DisclosurePanel className="md:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2">
                    {navIsAuthenticated.map((item) => (
                      <DisclosureButton
                        as={Link}
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
                      </DisclosureButton>
                    ))}
                  </div>
                </DisclosurePanel>
              </div>
            </>
          ) : (
            <>
              <div className="container mx-auto px-4">
                <div className="flex h-16 items-center">
                  {/* Button to display the panel menu */}
                  {/* No funciona hover:bg-[#FFCC00]  */}
                  <DisclosureButton className="md:hidden h-8 w-8 bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:ring-2 focus:ring-inset focus:outline-none rounded-md">
                    {open ? <XMarkIcon /> : <Bars3Icon />}
                  </DisclosureButton>

                  <div className="flex flex-1 justify-center gap-x-8">
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

                {/* Drop down panel */}
                <DisclosurePanel className="md:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                      <DisclosureButton
                        as={Link}
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
                      </DisclosureButton>
                    ))}
                  </div>
                </DisclosurePanel>
              </div>
            </>
          )}
        </>
      )}
    </Disclosure>
  );
};

export default NavBar;
