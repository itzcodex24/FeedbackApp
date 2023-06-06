import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { Feedback } from "../components";
import { socket } from "../socket";

const ProjectId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<null | any>(null);
  const [error, setError] = useState<null | string>(null);

  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("joinProject", id);

    socket.on("feedbackAdded", (feedbacks: any) => {
      setProject((p: any) => ({ ...p, feedbacks }));
    });
  }, []);

  useEffect(() => {
    api
      .get(`/project/${id}`)
      .then((res) => {
        console.log(res.data);
        setProject(res.data);
      })
      .catch((err) => {
        console.log("error");
        navigate("/projects");
      });
  }, []);

  const handleSubmit = async () => {
    api.post("/project/addfeedback", {
      projectId: id,
      feedback: {
        content: "Test",
      },
    });
  };

  if (project)
    return (
      <div className="flex items-center justify-center bg-secondary w-full h-screen ">
        <div className="md:w-1/2 flex items-center justify-center flex-col md:flex-row h-full w-full">
          <div className="w-full flex flex-grow justify-center items-center flex-col gap-y-4">
            <h1 className="text-3xl text-primary font-bold leading-tight">
              {project.name}
            </h1>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-bold tracking-wide uppercase rounded bg-tertiary text-primary hover:bg-primary hover:text-white transition ease-in-out duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add feedback
            </button>
            <button
              className="px-4 py-2 text-sm font-bold tracking-wide uppercase rounded bg-tertiary text-primary hover:bg-primary hover:text-white transition ease-in-out duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              Copy URL
            </button>
          </div>
          <div
            className={`pt-2 gap-y-2 w-full flex-grow-[2] rounded-t-md bg-white flex items-center flex-col px-2 ${
              project.feedbacks ? "justify-start" : "justify-center"
            }`}
          >
            {project.feedbacks.length > 0 ? (
              project.feedbacks.map((f: any) => (
                <Feedback {...f} key={f.content + f.createdAt} />
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center text-3xl tracking-tight text-gray-600">
                No feedbacks
              </div>
            )}
          </div>
        </div>
      </div>
    );

  return <></>;
};

export default ProjectId;
