import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
// import { socket } from "../socket";

const Home: React.FC = () => {
  const [connected, setConnected] = useState(1);

  useEffect(() => {
    // socket.on("getconnected", (data) => {
    //   setConnected(data.connected);
    // });
  }, []);

  const startWave = useAnimation();
  const emojyAnimation = useAnimation();

  const animationComplete = () => {
    console.log("calling");
    setTimeout(() => {
      emojyAnimation.start("rotateAndScale");
    }, 1000);
  };

  return (
    <>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        exit={{ x: "100%", opacity: 0 }}
        className="w-full h-screen flex items-center bg-secondary flex-col justify-around"
        onAnimationComplete={() => startWave.start("visible")}
      >
        <motion.div
          className="flex items-center justify-center gap-x-2"
          animate={startWave}
          initial="hidden"
        >
          <motion.h1
            className="text-white text-3xl"
            variants={{
              hidden: {
                opacity: 0,
                scale: 0,
                y: 10,
              },
              visible: {
                opacity: 1,
                scale: 1,
                y: 0,
              },
            }}
          >
            Hello World{" "}
          </motion.h1>
          <motion.h1
            className="text-3xl"
            variants={{
              hidden: {
                opacity: 0,
                scale: 0,
                y: 10,
              },
              visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  delay: 0.4,
                },
              },
            }}
          >
            👋
          </motion.h1>
        </motion.div>
        <motion.h1 className="text-white opacity-50 text-md">
          There are <b>{connected}</b> people connected the website
        </motion.h1>
      </motion.div>
    </>
  );
};

export default Home;
