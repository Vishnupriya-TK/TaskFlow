import React from "react";
import Cards from "../components/Home/Cards";

const CompletedTasks = () => (
  <div>
    <Cards filterStatus="Complete" />
  </div>
);

export default CompletedTasks;
