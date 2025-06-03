// src/pages/AllTasks.jsx
import React from "react";
import Cards from "../components/Home/Cards";

const AllTasks = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Tasks</h2>
      <Cards filterStatus="All" />
    </div>
  );
};

export default AllTasks;
