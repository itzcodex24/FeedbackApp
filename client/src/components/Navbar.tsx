import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown/Dropdown";
import useAuth from "../hooks/useAuth";
import Button from "./Button";

const links = [
  {
    name: "Home",
    requiresAuth: false,
    path: "/",
  },
  { name: "Dashboard", requiresAuth: true, path: "/dashboard" },
  {
    name: "Projects",
    requiresAuth: true,
    path: "/projects",
  },
];

const Navbar = () => {
  const [currentLink, setCurrentLink] = React.useState(links[0]);

  const navigate = useNavigate();

  const { session, status } = useAuth();

  const location = useLocation();
  useEffect(() => {
    const link = links.find((link) => link.path === location.pathname);
    if (link) setCurrentLink(link);
  }, [location]);

  if (status == "loading") return null;

  return (
    <>
      <AnimatePresence mode="wait">
        <div className="w-full flex bg-tertiary h-16 items-center text-primary font-lato justify-center">
          <div className="w-3/4 h-full flex justify-between items-center">
            <div className="flex items-center justify-start md:justify-center flex-1 flex-grow">
              <motion.img
                initial={{ opacity: 0 }}
                onClick={() => navigate("/")}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
                src="/images/logo.svg"
                className="hover:cursor-pointer w-10 md:mr-10"
              />
              <motion.div
                className="justify-center items-center hidden md:flex"
                variants={{
                  hidden: {
                    opacity: 0,
                  },
                  visible: {
                    opacity: 1,
                  },
                }}
              >
                {links.map((link, i) => {
                  return link.requiresAuth && !session ? null : (
                    <motion.div key={i}>
                      <Link
                        to={link.path}
                        className={`${
                          currentLink.name !== link.name && "opacity-50"
                        } relative px-2 py-1 cursor-pointer`}
                      >
                        {currentLink.name === link.name && (
                          <motion.div
                            className="absolute inset-0 rounded-md bg-secondary"
                            layoutId="activeTab"
                          />
                        )}
                        <span
                          className={`${
                            currentLink.name === link.name && ""
                          } relative z-[10]`}
                        >
                          {link.name}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
            {status == "loaded" && session ? (
              <motion.div className="flex md:justify-center items-center flex-1 flex-grow justify-end">
                <Dropdown />
              </motion.div>
            ) : (
              <motion.div className="flex justify-self-end items-center flex-1 flex-grow">
                <Button onClick={() => navigate("/login")} className="">
                  Login
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </AnimatePresence>
    </>
  );
};

export default Navbar;
