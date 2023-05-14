import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import React, { useState } from "react";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z
        .object({
          email: z
            .string({
              required_error: "Please provide an email adress",
            })
            .email("Please provide a valid email adress"),
          password: z.string({
            required_error: "Please provide a password",
          }),
          confirmPassword: z.string({
            required_error: "Please provide a password",
          }),
        })
        .superRefine((val, ctx) => {
          if (val.password !== val.confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Passwords do not match",
              fatal: true,
              path: ["confirmPassword"],
            });
          }
        })
    ),
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    api
      .post("/auth/register", {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        console.log(res);
        if (searchParams.get("fallbackUrl")) {
          navigate(searchParams.get("fallbackUrl")!);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log("Error");
        console.log(err);
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  return (
    <>
      <div className="relative min-h-screen flex ">
        <div className="flex flex-col sm:flex-col xl:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
          <div className="md:flex md:items-center md:justify-center md:h-full xl:w-2/5 p-8 w-full sm:w-full /5 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-secondary h-full items-center flex">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <h2 className="mt-6 text-4xl font-bold text-primary">
                  Sign Up!
                </h2>
                <p className="mt-2 text-lg text-primary">
                  Sign up for a free account today!
                </p>
              </div>

              <form
                className="mt-8 space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="relative">
                  <label className="ml-3 text-lg font-bold tracking-wide text-primary">
                    Email
                  </label>
                  <input
                    {...register("email", { required: true })}
                    className=" w-full text-base px-4 py-2 rounded-2xl bg-secondary border border-primary text-primary focus:outline-none"
                    type="text"
                    placeholder="mail@gmail.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-red-400">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-8 content-center">
                  <label className="ml-3 text-lg font-bold tracking-wide text-primary">
                    Password
                  </label>
                  <div className="w-full relative flex ">
                    <input
                      {...register("password", { required: true })}
                      className="w-full content-center text-base px-4 py-2 rounded-2xl bg-secondary border-primary border focus:outline-none text-primary"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                    />
                    <button
                      type="button"
                      className="absolute w-10 h-10 right-3 flex justify-center items-center text-primary top-[50%] translate-y-[-50%] "
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                    >
                      {showPassword ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-red-400">
                      {errors.password.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-8 content-center">
                  <label className="ml-3 text-lg font-bold tracking-wide text-primary">
                    Confirm Password
                  </label>
                  <div className="w-full relative flex ">
                    <input
                      {...register("confirmPassword", { required: true })}
                      className="w-full content-center text-base px-4 py-2 rounded-2xl bg-secondary border-primary border focus:outline-none text-primary"
                      type={showPassword2 ? "text" : "password"}
                      placeholder="********"
                    />
                    <button
                      type="button"
                      className="absolute w-10 h-10 right-3 flex justify-center items-center text-primary top-[50%] translate-y-[-50%] "
                      onClick={() => {
                        setShowPassword2((prev) => !prev);
                      }}
                    >
                      {showPassword2 ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-red-400">
                      {errors.confirmPassword.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full flex justify-center px-4 py-2 rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500 border-2 border-primary text-primary"
                  >
                    {loading ? "Loading..." : "Sign Up"}
                  </button>
                  {error && (
                    <p className="text-center text-md text-red-400 mt-4">
                      {error}
                    </p>
                  )}
                </div>
                <p className="flex items-center justify-center mt-10 text-center text-lg gap-x-2">
                  <span className="text-gray-300">
                    Already have an account?
                  </span>
                  <Link
                    to="/login"
                    className="no-underline hover:underline cursor-pointer text-gray-400"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <div
            className="w-1/2 sm:w-full xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden text-white bg-no-repeat bg-cover relative bg-center"
            style={{
              backgroundImage: "url(images/backgroundLogic.jpg)",
            }}
          >
            <div className="absolute inset-0 bg-tertiary opacity-90" />
            <div className="w-full  max-w-lg z-10">
              <div className="flex items-center gap-x-5 mb-4">
                <img
                  src="images/AndreiAvatar.jpeg"
                  className="aspect-square rounded-full object-fill w-12"
                />
                <div className="flex flex-col">
                  <h1 className="font-bold text-primary">Andrei Cherciu</h1>
                  <span className="text-sm opacity-70 text-primary">
                    Feedback Creator
                  </span>
                </div>
              </div>
              <h1 className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-4 text-primary">
                Feedback App
              </h1>
              <div className="sm:text-sm xl:text-md text-primary font-normal format">
                <p className="lead text-primary text-2xl mb-2">
                  Some words from the CEO
                </p>
                <div className="w-full flex flex-col gap-y-2">
                  <p>
                    We have created this app to let people give feedback on the
                    things they like and don't like to help buisness owners
                    improve their services.
                  </p>
                  <b>
                    <p>For us, it&apos;s about giving something back.</p>
                  </b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
