import { useState } from "react";
import type { MotionProps, Variants } from "framer-motion";
import { Menu, MenuItem } from "./DropdownMenu";
import api from "../../api";
import useAuth from "../../hooks/useAuth";

const menu = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.15,
    },
  },
  open: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.4,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
} satisfies Variants;

const item = {
  variants: {
    closed: { x: -16, opacity: 0 },
    open: { x: 0, opacity: 1 },
  },
  transition: { opacity: { duration: 0.2 } },
} satisfies MotionProps;

export default function Dropdown() {
  const [open, setOpen] = useState(false);

  const { refetch } = useAuth();

  const handleLogout = async () => {
    api
      .get("/auth/logout")
      .then((res) => {
        console.log(res.data);
        refetch();
      })
      .catch(console.error);
  };

  return (
    <Menu
      label={
        <div className="rounded-full p-5 border border-primary flex justfiy-center items-center relative overflow-hidden text-center ">
          <img
            src="/images/avatar.jpeg"
            className="absolute inset-0 h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary opacity-30" />
        </div>
      }
      open={open}
      className=""
      setOpen={setOpen}
      animate={open ? "open" : "closed"}
      initial="closed"
      exit="closed"
      variants={menu}
    >
      <MenuItem {...item} href="/">
        Home
      </MenuItem>
      <MenuItem {...item} href="/dashboard">
        Dashboard
      </MenuItem>
      <MenuItem {...item} href="/projects">
        Projects
      </MenuItem>
      <MenuItem {...item} href="/settings">
        Settings
      </MenuItem>
      <MenuItem
        {...item}
        onClick={handleLogout}
        className="border-2 border-primary rounded-md py-1 mt-2"
      >
        Logout
      </MenuItem>
    </Menu>
  );
}
