import React from "react";
import { motion } from "framer-motion";
interface Props {
  content: string;
  author: string;
  downvotes: number;
  upvotes: number;
  date: any;
  filter?: string;
}

const Feedback: React.FC<Props> = (props) => {
  const { content, author, upvotes, downvotes } = props;
  return (
    <>
      <motion.div
        className="w-full px-4 bg-red-400 h-16 flex flex-col"
        initial="hidden"
        variants={{
          hidden: {
            opacity: 0,
            y: 100,
          },
          visible: {
            opacity: 1,
            y: 0,
          },
        }}
      >
        <h1 className="text-xl xl:text-3xl font-bold">{author}</h1>
        <p>{content}</p>
      </motion.div>
    </>
  );
};

export default Feedback;
