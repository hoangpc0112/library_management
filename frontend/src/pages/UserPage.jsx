import React from "react";
import { Link, useLoaderData } from "react-router-dom";

const UserPage = () => {
  const userData = useLoaderData();

  return (
    <div>
      {userData.map((user) => {
        return (
          <Link>
            <h3>{user.email}</h3>
            <h3>{user.id}</h3>
          </Link>
        );
      })}
    </div>
  );
};

export default UserPage;

export const UserLoader = async () => {
  const response = await fetch("http://127.0.0.1:8000/users");
  return response.json();
};
