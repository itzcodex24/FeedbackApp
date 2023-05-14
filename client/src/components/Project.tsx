import React from "react";
import { Link } from "react-router-dom";

interface Props {
  name: string;
  description: string;
  id: string;
}

const Project: React.FC<Props> = (props) => {
  return (
    <Link to={`/project/${props.id}`}>
      <div className="flex w-full flex-col bg-tertiary border rounded-md border-primary px-4 py-2">
        <h1 className="font-bold text-2xl uppercase tracking-tight text-gray-400">
          {props.name}
        </h1>
        <p className="line-clamp-2 min-h-[3.5rem] text-xl text-white opacity-80">
          {props.description}
        </p>
      </div>
    </Link>
  );
};

export default Project;
