import { AnimatePresence, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Feedback } from "./";
import { motion } from "framer-motion";

interface FeedbackProps {
  content: string;
  author: string;
  downvotes: number;
  upvotes: number;
  date: any;
}

const FeedbackContainer = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("message", (data) => {
      console.log(data);
      socket.emit("reply", `Hello ${JSON.stringify(data)}`);
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<null | FeedbackProps[]>(null);

  const animateFeedback = useAnimation();

  return (
    <AnimatePresence>
      <motion.div className="w-full h-full flex flex-col justify-center items-center">
        {feedbacks && feedbacks.length > 0 ? (
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
              },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
          >
            {feedbacks.map((feedback: FeedbackProps, i) => (
              <Feedback {...feedback} key={feedback.date + i} />
            ))}
          </motion.div>
        ) : (
          <>
            {isLoading ? (
              <motion.h1
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 100,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                  exit: {
                    opacity: 0,
                    y: -100,
                  },
                }}
                initial="hidden"
                exit="exit"
                animate="visible"
              >
                Loading...
              </motion.h1>
            ) : (
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                No feedbacks available
              </motion.h1>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackContainer;
