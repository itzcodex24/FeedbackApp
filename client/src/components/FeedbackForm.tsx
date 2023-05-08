import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./";
const FeedbackForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(3).max(20),
        author: z.string().min(3).max(20),
        content: z.string().min(3),
      })
    ),
  });
  const onSubmit = async (data: any) => {
    setLoading(true);
    const res = await fetch("http://localhost:4000/post", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: {
        // @ts-ignore
        author: data.author,
        content: data.content,
      },
    });
    const resdata = await res.json();
    if (resdata.success) {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`w-full h-full flex justify-center items-center flex-col px-16 ${
        !errors.name && !errors.content && !errors.author && "gap-y-4"
      }`}
    >
      <div className="w-full">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          {...register("name", { required: true })}
          className="border border-gray-400 rounded w-full py-1 pl-2"
        />
        {errors.name && (
          <span className="text-red-400 text-sm">
            {errors.name.message as string}
          </span>
        )}
      </div>
      <div className="w-full">
        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          {...register("author", { required: true })}
          className="border border-gray-400 rounded w-full py-1 pl-2"
        />
        {errors.author && (
          <span className="text-red-400 text-sm">
            {errors.author.message as string}
          </span>
        )}
      </div>
      <div className="w-full">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          {...register("content", { required: true })}
          rows={5}
          className="border border-gray-400 rounded w-full pl-2"
        />
        {errors.content && (
          <span className="text-red-400 text-sm">
            {errors.content.message as string}
          </span>
        )}
      </div>
      <div className="w-full">
        <Button
          type="submit"
          className="bg-gray-400 rounded w-full py-1"
          loading={loading}
        >
          Send
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
