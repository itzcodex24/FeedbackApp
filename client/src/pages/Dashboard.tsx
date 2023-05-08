import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";

const Dashboard: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<null | any[]>(null);

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: "100%", opacity: 0 }}
      className="w-full h-screen flex items-center bg-secondary flex-col justify-around"
    ></motion.div>
  );
};

export default Dashboard;
