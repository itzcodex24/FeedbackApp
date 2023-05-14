import React from "react";
import { useAuth } from "../../hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const Profile: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(z.object({})) });
  const { session } = useAuth();
  return (
    <div className="w-full bg-red-400">
      <h1>Hello world</h1>
    </div>
  );
};

export default Profile;
