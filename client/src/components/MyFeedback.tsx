import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
interface Props {
  content: string;
  author: string;
  downvotes: number;
  upvotes: number;
  date: any;
  filter?: string;
}

const MyFeedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<null | Props[]>(null);
  const id = "123";
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const res = await axios.get(
        `http://localhost:4000/getUserFeedbacks/${id}`
      );
      setFeedbacks(res.data);
    };
    fetchFeedbacks();
  }, []);
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: "100%", opacity: 0 }}
      className="w-full h-screen flex items-center bg-secondary flex-col justify-around"
    >
      <h1>Feedbacks</h1>
    </motion.div>
  );
};

export default MyFeedbacks;
