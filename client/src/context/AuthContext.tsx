import api from "../api";
import { createContext, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const AuthContext = createContext<any>({});

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [data, setData] = useState({
    status: "loading",
    session: null,
  });
  function refetch(): Promise<any> {
    return new Promise((resolve, reject) => {
      api
        .get("/auth/user")
        .then((res) => {
          setData({
            status: "loaded",
            session: res.data,
          });
          resolve(res.data);
        })
        .catch((err) => {
          setData({
            status: "loaded",
            session: null,
          });
          reject(err);
        });
    });
  }
  useEffect(() => {
    refetch();
  }, []);

  return (
    <AuthContext.Provider value={{ data, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
