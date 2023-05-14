import React, { useEffect, useState } from "react";
import api from "../../api";
import { socket } from "../../socket";
const Users: React.FC = () => {
  const [users, setUsers] = useState<null | any[]>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      api
        .get("/auth/users", {
          withCredentials: true,
        })
        .then((users) => {
          setUsers(users.data);
        })
        .catch((e) => console.log(e));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.emit("listeningForRegister");
    socket.on("newRegister", (data: any) => {
      console.log(data.user);
      setUsers((users) => {
        if (users === null) return [data.user];

        return [...users, data.user];
      });
    });
  }, []);
  return (
    <div>
      {users
        ? users.length > 0
          ? users.map((user, i) => <h1 key={user.id + i}>{user.email}</h1>)
          : "No users"
        : "Loading..."}
    </div>
  );
};

export default Users;
