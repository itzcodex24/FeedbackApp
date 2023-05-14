import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { socket } from "../socket";
import useAuth from "../hooks/useAuth";
import { usePageTitle } from "../hooks";
import { MotionPage } from "../components";

const Home: React.FC = () => {
  const [connected, setConnected] = useState(1);
  usePageTitle("Home");

  useEffect(() => {
    socket.on("getconnected", (data) => {
      console.log(data);
      setConnected(data.connected);
    });
  }, []);

  const startWave = useAnimation();

  return (
    <>
      <MotionPage className="w-full h-screen flex items-center bg-secondary flex-col justify-around">
        <motion.div
          className="flex items-center justify-center gap-x-2"
          animate={startWave}
          initial="hidden"
        >
          <motion.h1
            className="text-white text-3xl"
            animate="visible"
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
            animate="visible"
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
        <motion.h1
          className="text-white opacity-50 text-md"
          animate={{ opacity: 0.5 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 1 }}
        >
          There are <b>{connected}</b> people connected the website
        </motion.h1>
      </MotionPage>
    </>
  );
};

export default Home;
