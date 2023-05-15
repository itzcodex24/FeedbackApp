import React from "react";
import { Link } from "react-router-dom";

interface Props {
  project: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    feedbacks: {
      id: string;
    }[];
  };
}

const Project: React.FC<Props> = ({ project }) => {
  return (
    <Link to={`/project/${project.id}`}>
      <div className="flex w-full flex-col bg-tertiary border rounded-md border-primary px-4 py-2">
        <h1 className="font-bold text-2xl uppercase tracking-tight text-gray-400 line-clamp-1">
          {project.name}
        </h1>
        <p className="line-clamp-3 min-h-[5.25rem] text-xl text-white opacity-80">
          {project.description}
        </p>
        <div className="flex justify-between items-center mt-4 w-full opacity-50 text-white text-xs font-light">
          <p>{new Date(project.createdAt).toLocaleDateString("en-US", {})}</p>
          <p>Feedbacks: {project.feedbacks?.length ?? "0"}</p>
        </div>
      </div>
    </Link>
  );
};

export default Project;
