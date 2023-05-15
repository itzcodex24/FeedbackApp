import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../hooks";
import api from "../api";
import { useNavigate } from "react-router-dom";

const CreateFeedback: React.FC = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        content: z
          .string()
          .min(5, "This field must contain at least 5 characters"),
      })
    ),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post("/project/create", {
        name: data.name,
        content: data.content,
      });
      console.log(res.data);

      navigate(`/projects/`);
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 429) {
        setError("Woah, slow down! You're trying to create too many projects!");
      } else {
        setError(error.response.data.message);
      }
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: "100%" }}
      className="w-full h-screen flex bg-secondary flex-col items-center justify-center"
    >
      <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 text-white h-full md:h-auto">
        <div className="flex flex-col justify-between">
          <div className="space-y-2">
            {error && typeof error == "string" && (
              <p className="uppercase text-sm font-bold text-red-600">
                {error}
              </p>
            )}
            <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-primary">
              Create your own project!
            </h2>
            <div className="dark:text-gray-400 tracking-tighter">
              Create your very own project and share it with your friends and
              others to get an insight as to what people think!
            </div>
          </div>
          <img src="/bulb-idea.svg" alt="" className="p-6 h-52 md:h-64" />
        </div>
        <form
          className="space-y-6 ng-untouched ng-pristine ng-valid"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="name" className="text-sm">
              Username
            </label>
            <input
              id="name"
              disabled={true}
              value={session?.username ?? "Hello"}
              type="text"
              className="w-full p-3 rounded border-primary bg-secondary border focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="name" className="text-sm">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name", {
                required: true,
              })}
              className="w-full p-3 rounded border-primary bg-secondary border focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="feedback" className="text-sm">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="feedback"
              {...register("content", {
                required: true,
              })}
              placeholder="What's your project about?"
              rows={3}
              className="w-full p-3 rounded border-primary bg-secondary border focus:outline-none"
            ></textarea>
          </div>
          <button
            className="w-full p-3 text-sm font-bold tracking-wide uppercase rounded bg-tertiary text-primary hover:bg-primary hover:text-white transition ease-in-out duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={loading || typeof error == "string"}
          >
            {loading ? "Loading..." : "Create"}
          </button>
        </form>
      </div>
    </motion.div>
  );
};
export default CreateFeedback;
