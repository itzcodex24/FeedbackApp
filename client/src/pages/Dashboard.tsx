import React, { useState } from "react";
import { usePageTitle } from "../hooks";
import { MotionPage } from "../components";

const Dashboard: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<null | any[]>(null);
  usePageTitle("Dashboard");

  return (
    <MotionPage className="w-full h-screen flex items-center bg-secondary flex-col justify-around">
      <h1>Dashboard</h1>
    </MotionPage>
  );
};

export default Dashboard;
