import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <h1>UserLayout</h1>
      <Outlet />
    </div>
  );
};

export default UserLayout;
