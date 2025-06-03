import React, { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";

const Cards = ({ filterStatus = "All", showAddTask = false }) => {
  const [data, setData] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", desc: "", status: "Incomplete", favorite: false });
  const [isEditing, setIsEditing] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const userTasks = savedTasks.filter(task => task.userId === currentUser?.email);
    setData(userTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const otherUsersTasks = allTasks.filter(task => task.userId !== currentUser?.email);
    const updatedTasks = [...otherUsersTasks, ...data.map(task => ({ ...task, userId: currentUser?.email }))];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }, [data]);

  // Add a new task
  const handleAddTask = () => {
    if (newTask.title && newTask.desc) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const newTaskWithUser = {
        ...newTask,
        userId: currentUser?.email,
        createdAt: new Date().toISOString()
      };
      setData([...data, newTaskWithUser]);
      setNewTask({ title: "", desc: "", status: "Incomplete", favorite: false });
      toast.success("Task added successfully!");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  // Toggle task status (Complete/Incomplete/Important)
  const toggleStatus = (index, newStatus) => {
    setData(data.map((item, i) => {
      if (i === index) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
    toast.success(`Task marked as ${newStatus}`);
  };

  // Toggle favorite status
  const toggleFavorite = (index) => {
    setData(data.map((item, i) => {
      if (i === index) {
        return { ...item, favorite: !item.favorite };
      }
      return item;
    }));
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
      if (newTask.title && newTask.desc) {
        setData(data.map((item, index) => (index === isEditing ? newTask : item)));
        setNewTask({ title: "", desc: "", status: "Incomplete", favorite: false });
        setIsEditing(null);
        toast.success("Task updated successfully!");
      } else {
        toast.error("Please fill in all fields");
      }
    }
  };

  // Delete a task
  const handleDelete = (index) => {
    setData(data.filter((_, i) => i !== index));
    toast.success("Task deleted successfully!");
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
            className="border border-white/20 bg-white/10 text-white rounded px-3 py-2 mr-2 placeholder-white/50 backdrop-blur-sm"
          />
          <input
            type="text"
            placeholder="Task Description"
            value={newTask.desc}
            onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
            className="border border-white/20 bg-white/10 text-white rounded px-3 py-2 mr-2 placeholder-white/50 backdrop-blur-sm"
          />
          {isEditing !== null ? (
            <button onClick={handleSaveEdit} className="flex items-center gap-2 bg-blue-500/50 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600/50 transition-all duration-200 backdrop-blur-sm">
              Save
            </button>
          ) : (
            <button onClick={handleAddTask} className="flex items-center gap-2 bg-green-500/50 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600/50 transition-all duration-200 backdrop-blur-sm">
              <AiOutlinePlus size={20} /> Add Task
            </button>
          )}
        </div>
      )}

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-8 text-white/70">
            No tasks found for this category
          </div>
        ) : (
          filteredData.map((item, index) => (
            <div key={index} className="flex flex-col justify-between border border-white/20 rounded-lg p-4 bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200">
              <div>
                <h3 className="font-bold text-center mb-2 text-lg text-white">{item.title}</h3>
                <p className="p-2 my-3 text-white/80">{item.desc}</p>
                <p className="text-center font-semibold text-sm text-white/70">Status: {item.status}</p>
              </div>
              <div className="flex items-center justify-around mt-4 gap-2">
                {/* Toggle between Complete and Incomplete */}
                <button
                  onClick={() => toggleStatus(index, item.status === "Incomplete" ? "Complete" : "Incomplete")}
                  className={`px-3 py-2 rounded-md text-white transition-colors duration-200 ${
                    item.status === "Incomplete" ? "bg-red-500/50 hover:bg-red-600/50" : "bg-green-500/50 hover:bg-green-600/50"
                  } backdrop-blur-sm`}
                >
                  {item.status === "Incomplete" ? "Complete" : "Incomplete"}
                </button>
                {/* Toggle between Important and current status */}
                <button
                  onClick={() => toggleStatus(index, item.status === "Important" ? "Incomplete" : "Important")}
                  className={`px-3 py-2 rounded-md text-white transition-colors duration-200 ${
                    item.status === "Important" ? "bg-purple-500/50 hover:bg-purple-600/50" : "bg-blue-500/50 hover:bg-blue-600/50"
                  } backdrop-blur-sm`}
                >
                  {item.status === "Important" ? "Unmark Important" : "Mark Important"}
                </button>
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(index)}
                  className={`p-2 rounded-full ${item.favorite ? "text-red-300" : "text-white/70"} hover:text-red-300 transition-colors duration-200`}
                >
                  <CiHeart size={25} color={item.favorite ? "#fca5a5" : "rgba(255,255,255,0.7)"} />
                </button>
                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(index)}
                  className="p-2 rounded-full text-white/70 hover:text-white transition-colors duration-200"
                >
                  <FiEdit size={20} />
                </button>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 rounded-full text-white/70 hover:text-white transition-colors duration-200"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cards;
