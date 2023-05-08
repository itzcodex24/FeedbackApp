import React from "react";
import { FeedbackContainer, FeedbackForm } from "../components";
import { useParams } from "react-router-dom";

const FeedbackId = (props: any) => {
  const { id } = useParams();
  console.log(id);
  return (
    <div className="w-full h-screen flex justify-center items-center p-4 xl:p-0 bg-secondary">
      <div className="w-full xl:w-2/3 h-full xl:h-1/2 flex justify-center items-center gap-y-4 md:gap-x-4 md:flex-row flex-col">
        <div className="flex flex-grow border border-gray-400 bg-gray-300 w-full md:h-full rounded">
          <FeedbackForm />
        </div>
        <div className="flex flex-grow border border-gray-400 bg-gray-300  w-full md:h-full rounded">
          <FeedbackContainer />
        </div>
      </div>
    </div>
  );
};

export default FeedbackId;
