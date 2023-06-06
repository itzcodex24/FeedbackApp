import React from "react";
import api from "../api";
import { useAuth } from "../hooks";

interface Props {
  content: string;
  name: string;
  author: string;
  downVotes: any[];
  upVotes: any[];
  date: any;
  filter?: string;
}

const Feedback: React.FC<Props> = (feedback) => {
  const { session } = useAuth();
  const handleDislike = async () => {
    if (feedback.downVotes.find((v) => v.author === session.id)) {
      feedback.downVotes.splice(
        feedback.downVotes.findIndex((v) => v.author === session.id),
        1
      );
    } else {
      feedback.downVotes.push({
        author: session.id,
      });
      api.post("");
    }
    console.log("dislike");
  };
  const handleLike = async () => {
    console.log("like");
  };

  return (
    <div className="bg-secondary text-primary w-full flex justify-start items-center rounded-md overflow-hidden shadow-2xl shadow-black">
      <div className="flex flex-grow-[2] flex-col justify-center items-start h-full pl-4 py-3">
        <h1 className="text-2xl tracking-tight ">{feedback.name}</h1>
        <p className="text-md opacity-60">{feedback.content}</p>
      </div>
      <div className="flex flex-grow flex-col items-center justify-center h-full">
        <div className="w-full h-full flex items-center justify-center text-3xl py-2">
          <button className="relative" onClick={handleLike}>
            <span className="opacity-10">👍</span>
            <div className="absolute inset-0 rounded-full flex justify-center items-center text-xs translate-y-1 font-bold">
              {feedback.upVotes.length ?? 0}
            </div>
          </button>
        </div>
        <div className="w-full h-full flex items-center justify-center text-3xl py-2">
          <button className="relative" onClick={handleDislike}>
            <span className="opacity-10">👎</span>
            <div className="absolute inset-0 translate-y-[-0.25rem] rounded-full flex justify-center items-center text-xs font-bold">
              {feedback.upVotes.length ?? 0}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
