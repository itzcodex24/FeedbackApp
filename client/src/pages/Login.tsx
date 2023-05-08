import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import api from "../api";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(32),
      })
    ),
  });

  const { refetch } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLogin = async (data: any) => {
    console.log(data);
    api
      .post("/auth/login", data, {
        withCredentials: true,
      })
      .then((data) => {
        refetch();
        navigate(searchParams.get("fallbackUrl") ?? "/");
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col">
        <input
          placeholder="email"
          type="email"
          {...register("email")}
          className="border border-black rounded-md pl-4"
        />
        {errors && errors.email && <p>{errors.email.message as string}</p>}
        <input
          placeholder="password"
          {...register("password")}
          type="password"
          className="border border-black rounded-md pl-4"
        />
        {errors && errors.password && (
          <p>{errors.password.message as string}</p>
        )}
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
