import * as React from "react";
import * as Ariakit from "@ariakit/react";
import type { HTMLMotionProps, MotionProps } from "framer-motion";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../Button";

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  label: React.ReactNode;
  disabled?: boolean;
  animate?: MotionProps["animate"];
  transition?: MotionProps["transition"];
  variants?: MotionProps["variants"];
  initial?: MotionProps["initial"];
  exit?: MotionProps["exit"];
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      open,
      setOpen,
      label,
      children,
      animate,
      transition,
      variants,
      initial,
      exit,
      ...props
    },
    ref
  ) => {
    const menu = Ariakit.useMenuStore({ open, setOpen });
    const currentPlacement = menu.useState("currentPlacement");
    const mounted = menu.useState("mounted");
    return (
      <MotionConfig reducedMotion="user">
        <Ariakit.MenuButton
          store={menu}
          ref={ref}
          className="button"
          {...props}
        >
          {label}
        </Ariakit.MenuButton>
        <AnimatePresence>
          {mounted && (
            <Ariakit.Menu
              store={menu}
              // Make sure the menu is always visible during animation
              hidden={false}
              // We'll use this data attribute to style the transform-origin
              // property based on the menu's placement. See style.css.
              data-placement={currentPlacement}
              className="menu"
              as={motion.div}
              initial={initial}
              exit={exit}
              animate={animate}
              variants={variants}
              transition={transition}
            >
              <Ariakit.MenuArrow className="menu-arrow" />
              {children}
            </Ariakit.Menu>
          )}
        </AnimatePresence>
      </MotionConfig>
    );
  }
);

export interface MenuItemProps extends HTMLMotionProps<"div"> {
  label?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
}

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  ({ href, label, variants, onClick, animate, ...props }, ref) => {
    return onClick ? (
      <Button onClick={onClick}>
        <Ariakit.MenuItem
          as={motion.div}
          ref={ref}
          className="menu-item"
          children={label}
          animate={animate}
          variants={variants}
          {...props}
        />
      </Button>
    ) : (
      <Link to={href ?? ""}>
        <Ariakit.MenuItem
          as={motion.div}
          ref={ref}
          className="menu-item"
          children={label}
          animate={animate}
          variants={variants}
          {...props}
        />{" "}
      </Link>
    );
  }
);
