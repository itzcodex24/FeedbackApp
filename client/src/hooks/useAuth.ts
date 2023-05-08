import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
interface Response {
  status: "loading" | "loaded";
  session: any | null;
  refetch: () => Promise<any>;
}

const useAuth = () => {
  const {
    refetch,
    data: { status, session },
  } = useContext(AuthContext);

  return { refetch, status, session } as Response;
};

export default useAuth;
