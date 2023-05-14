import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const ProjectId: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<null | any>(null);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    api
      .get(`/project/${id}`)
      .then((res) => {
        console.log(res.data);
        setProject(res.data);
      })
      .catch((err) => {
        console.log("error");
      });
  }, []);

  return <div>{JSON.stringify(project)}</div>;
};

export default ProjectId;
