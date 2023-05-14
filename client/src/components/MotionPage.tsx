import React from "react";
import { motion } from "framer-motion";

const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: "-100%",
    zIndex: 1,
  },
  enter: {
    opacity: 1,
    y: "0%",
    zIndex: 2,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    y: "100%",
    zIndex: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

type Props = {
  children: React.ReactNode;
  className?: string;
};

const MotionPage: React.FC<Props> = (props: Props) => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: "100%", opacity: 0 }}
      {...props}
      className={`${props.className && props.className}`}
    >
      {props.children}
    </motion.div>
  );
};

export default MotionPage;
