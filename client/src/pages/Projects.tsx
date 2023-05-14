import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import { usePageTitle } from "../hooks";
import { Link } from "react-router-dom";
import { MotionPage, Project } from "../components";
import api from "../api";

const MyFeedbacks: React.FC = () => {
  const { status, session } = useAuth();
  const [feedbacks, setFeedbacks] = useState<null | any[]>(null);

  usePageTitle("Projects");

  useEffect(() => {
    api
      .get("/project/")
      .then((res) => {
        console.log(res.data);
        setFeedbacks(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <MotionPage className="w-full h-screen flex bg-secondary flex-col ">
      <div className="w-full px-4 flex items-center flex-col h-full">
        <div className="w-full flex items-center justify-center mt-2 mb-10">
          <Link
            to="/projects/create"
            className="w-full border-2 border-primary rounded-md py-2 text-primary font-bold text-center"
          >
            Create
          </Link>
        </div>
        <div
          className={`flex flex-col w-full justify-start ${
            (feedbacks?.length && feedbacks?.length == 0) || "h-full "
          }`}
        >
          {feedbacks == null ? (
            <h1 className="text-2xl text-primary font-bold">Loading</h1>
          ) : feedbacks && feedbacks?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
              {feedbacks?.map((f) => (
                <Project
                  name={f.name}
                  description={f.description}
                  id={f.id}
                  key={f.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center ">
              <h1 className="text-4xl text-white font-bold tracking-wide">
                Hmmm.
              </h1>
              <p className="text-white font-semibold opacity-60">
                It seems you have no projects.
              </p>
            </div>
          )}
        </div>
      </div>
    </MotionPage>
  );
};

export default MyFeedbacks;
