import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const ProjectId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<null | any>(null);
  const [error, setError] = useState<null | string>(null);

  const navigate = useNavigate();

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

  const handleSubmit = () => {
    api.post("/feedback/create", {
      content: "Hello world",
      projectId: id,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-secondary w-full h-screen ">
      <h1>{JSON.stringify(project)}</h1>
      <button onClick={handleSubmit}>Submit feedback</button>
    </div>
  );
};

export default ProjectId;
