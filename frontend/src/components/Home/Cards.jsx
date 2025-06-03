import React, { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";

const Cards = ({ filterStatus = "All", showAddTask = false }) => {
  const [data, setData] = useState([
    { title: "Learning Data Structures", desc: "Studying arrays, stacks, queues, and linked lists, highlighting how they enable the design of efficient algorithms.", status: "Incomplete", favorite: false },
    { title: "Fundamentals of Web Development", desc: "Introduction to back-end technologies.", status: "Incomplete", favorite: false },
    { title: "Mini Project Research", desc: "Research innovative project ideas.", status: "Important", favorite: false },
    { title: "Fundamentals of Digital Logic Design: From Gates to Circuits", desc: "To learn to the basics of digital logic design,combinational circuits, and simple sequential circuits. ", status: "Complete", favorite: false },

  ]);

  const [newTask, setNewTask] = useState({ title: "", desc: "", status: "Incomplete", favorite: false });
  const [isEditing, setIsEditing] = useState(null);

  // Add a new task
  const handleAddTask = () => {
    if (newTask.title && newTask.desc) {
      setData([...data, newTask]);
      setNewTask({ title: "", desc: "", status: "Incomplete", favorite: false });
    }
  };

  // Toggle task status (Complete/Incomplete)
  const toggleStatus = (index, newStatus) => {
    setData(data.map((item, i) => (i === index ? { ...item, status: newStatus } : item)));
  };

  // Toggle favorite status
  const toggleFavorite = (index) => {
    setData(data.map((item, i) => (i === index ? { ...item, favorite: !item.favorite } : item)));
  };

  // Handle task editing
  const handleEdit = (index) => {
    const taskToEdit = data[index];
    setNewTask(taskToEdit);
    setIsEditing(index);
  };

  // Save the edited task
  const handleSaveEdit = () => {
    if (isEditing !== null) {
      setData(data.map((item, index) => (index === isEditing ? newTask : item)));
      setNewTask({ title: "", desc: "", status: "Incomplete", favorite: false });
      setIsEditing(null);
    }
  };

  // Delete a task
  const handleDelete = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  // Filter tasks based on status
  const filteredData = filterStatus === "All" ? data : data.filter((task) => task.status === filterStatus);

  return (
    <div className="p-4">
      {/* Add New Task Section */}
      {showAddTask && (
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 mr-2"
          />
          <input
            type="text"
            placeholder="Task Description"
            value={newTask.desc}
            onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 mr-2"
          />
          {isEditing !== null ? (
            <button onClick={handleSaveEdit} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all duration-200">
              Save
            </button>
          ) : (
            <button onClick={handleAddTask} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition-all duration-200">
              <AiOutlinePlus size={20} /> Add Task
            </button>
          )}
        </div>
      )}

      {/* Task List */}
      <div className="grid grid-cols-3 gap-4">
        {filteredData.map((item, index) => (
          <div key={index} className="flex flex-col justify-between border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <h3 className="font-bold text-center mb-2 text-lg">{item.title}</h3>
            <p className="p-2 my-3 text-gray-700">{item.desc}</p>
            <p className="text-center font-semibold text-sm text-gray-600">Status: {item.status}</p>
            <div className="flex items-center justify-around mt-4 gap-2">
              {/* Toggle between Complete and Incomplete */}
              <button
                onClick={() => toggleStatus(index, item.status === "Incomplete" ? "Complete" : "Incomplete")}
                className={`px-3 py-2 rounded-md text-white transition-colors duration-200 ${item.status === "Incomplete" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
              >
                {item.status === "Incomplete" ? "Complete" : "Incomplete"}
              </button>
              {/* Toggle between Important and Incomplete */}
              <button
                onClick={() => toggleStatus(index, item.status === "Important" ? "Incomplete" : "Important")}
                className={`px-3 py-2 rounded-md text-white transition-colors duration-200 ${item.status === "Important" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {item.status === "Important" ? "Unmark Important" : "Mark Important"}
              </button>
              {/* Favorite Button */}
              <button onClick={() => toggleFavorite(index)} className={`p-2 rounded-full ${item.favorite ? "text-red-500" : "text-gray-500"} hover:text-red-600 transition-colors duration-200`}>
                <CiHeart size={25} color={item.favorite ? "red" : "gray"} />
              </button>
              {/* Edit Button */}
              <button onClick={() => handleEdit(index)} className="p-2 rounded-full text-blue-500 hover:text-blue-600 transition-colors duration-200">
                <FiEdit size={20} />
              </button>
              {/* Delete Button */}
              <button onClick={() => handleDelete(index)} className="p-2 rounded-full text-gray-500 hover:text-gray-600 transition-colors duration-200">
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
