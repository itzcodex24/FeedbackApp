import React from "react";
import { useAuth } from "../../hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import api from "../../api";

const Account: React.FC = () => {
  const { session } = useAuth();

  const [loadingReset, setLoadingReset] = React.useState(false);
  const [resetError, setResetError] = React.useState<null | string>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z
        .object({
          email: z.string().email("Please provide a valid email"),
          currentPwd: z.string(),
          newPwd: z.string().min(8, "Password must be at least 8 characters"),
          confirmPwd: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        })
        .superRefine((val, ctx) => {
          if (val.newPwd !== val.confirmPwd) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Passwords do not match",
              fatal: true,
              path: ["confirmPwd"],
            });
          }
        })
    ),
    defaultValues: {
      email: session?.email,
      currentPwd: "",
      newPwd: "",
      confirmPwd: "",
    },
  });

  const onSubmit = async (data: any) => {
    if (data.confirmPwd && data.newPwd && data.currentPwd) {
      setLoadingReset(true);
      api
        .post("/auth/reset", {
          id: session?.id,
          currentPassword: data.currentPwd,
          newPassword: data.newPwd,
          confirmNewPassword: data.confirmPwd,
        })
        .then((res) => {
          console.log(res);
          setLoadingReset(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="w-full flex justify-center items-center ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full py-4 px-2 bg-tertiary flex flex-col gap-y-4"
      >
        <div className="w-full text-primary flex flex-col gap-y-2">
          <label htmlFor="email" className="pl-2">
            Email
          </label>
          <input
            {...register("email")}
            placeholder="Email"
            id="email"
            className="w-full bg-tertiary border border-primary pl-2 rounded focus:outline-none py-2"
          />
          {errors.email && <Error error={errors.email.message as string} />}
        </div>
        <div className="w-full text-primary flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          <label htmlFor="currentpwd" className="pl-2">
            Current Password
          </label>
          <input
            {...register("currentPwd")}
            id="currentpwd"
            type="password"
            className="w-full bg-tertiary border border-primary pl-2 rounded focus:outline-none py-2"
          />
          {errors && errors.currentPwd && (
            <Error error={errors.currentPwd.message as string} />
          )}
          <label htmlFor="newpwd" className="pl-2">
            New Password
          </label>
          <input
            {...register("newPwd")}
            id="newpwd"
            type="password"
            className="w-full bg-tertiary border border-primary pl-2 rounded focus:outline-none py-2"
          />
          {errors && errors.newPwd && (
            <Error error={errors.newPwd.message as string} />
          )}
          <label htmlFor="confirmpwd" className="pl-2">
            Confirm New Password
          </label>
          <input
            {...register("confirmPwd")}
            id="confirmpwd"
            type="password"
            className="w-full bg-tertiary border border-primary pl-2 rounded focus:outline-none py-2"
          />
          {errors && errors.confirmPwd && (
            <Error error={errors.confirmPwd.message as string} />
          )}
          <button
            className="bg-primary text-white hover:bg-secondary border border-primary py-2 transition ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              !!errors.confirmPwd ||
              !!errors.newPwd ||
              !!errors.currentPwd ||
              loadingReset
            }
          >
            {loadingReset ? "Loading..." : "Reset Password"}
          </button>
          {resetError && <Error error={resetError} />}
        </div>
      </form>
    </div>
  );
};

interface ErrorProps {
  error: string;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <p className="text-red-400 py-2 font-semibold text-sm pl-1">{error}</p>
  );
};

export default Account;
