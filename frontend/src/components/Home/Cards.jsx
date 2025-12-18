import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";

const Cards = ({ filterStatus = "All", showAddTask = false }) => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]); // array of selected task _id
  const [newTask, setNewTask] = useState({ title: "", desc: "", status: "Incomplete" });
  const [isEditing, setIsEditing] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // helper to toggle selection
  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const selectAll = () => setSelected(filteredData.map(t => t._id));
  const clearSelection = () => setSelected([]);

  // Load tasks from backend on component mount and when filterStatus changes
  const fetchTasks = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const userId = currentUser?.email;
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (filterStatus && filterStatus !== 'All') {
        // For Important view, query by important flag (backend supports ?important=true)
        if (filterStatus === 'Important') params.append('important', 'true');
        else params.append('status', filterStatus);
      }
      const res = await fetch(`${API_BASE}/api/tasks?${params.toString()}`);
      const tasks = await res.json();
      // adapt to frontend shape (desc instead of description)
      setData(tasks.map(t => ({ ...t, desc: t.description })));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
    window.addEventListener('tasks-updated', fetchTasks);
    return () => window.removeEventListener('tasks-updated', fetchTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  // Add a new task
  const handleAddTask = async () => {
    if (newTask.title && newTask.desc) {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const payload = {
          title: newTask.title,
          description: newTask.desc,
          desc: newTask.desc,
          userId: currentUser?.email,
          status: newTask.status
        };
        const res = await fetch(`${API_BASE}/api/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to create');
        const created = await res.json();
        setData(prev => [{ ...created, desc: created.description }, ...prev]);
        // trigger dashboard and other listeners to refresh
        window.dispatchEvent(new CustomEvent('tasks-updated'));
        setNewTask({ title: "", desc: "", status: "Incomplete" });
        toast.success("Task added successfully!");
      } catch (err) {
        console.error(err);
        toast.error('Failed to add task');
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  // Toggle task status (Complete/Incomplete) by id
  const toggleStatus = async (id, newStatus) => {
    try {
      // only allow Complete/Incomplete through this endpoint
      if (!['Complete', 'Incomplete'].includes(newStatus)) return toast.error('Invalid status');
      const res = await fetch(`${API_BASE}/api/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      // refresh tasks for correct filtering
      await fetchTasks();
      window.dispatchEvent(new CustomEvent('tasks-updated'));
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  // Toggle important flag (independent of status)
  const toggleImportant = async (id) => {
    try {
      const task = data.find(t => t._id === id);
      if (!task) return toast.error('Task not found');
      const newImportant = !task.important;
      const res = await fetch(`${API_BASE}/api/tasks/${id}/important`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ important: newImportant })
      });
      if (!res.ok) throw new Error('Failed to toggle important');
      const updated = await res.json();
      // update local data
      setData(prev => prev.map(t => t._id === id ? { ...updated, desc: updated.description } : t));
      window.dispatchEvent(new CustomEvent('tasks-updated'));
      toast.success(updated.important ? 'Marked important' : 'Unmarked important');
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle important. Try again.');
    }
  };



  // Handle task editing
  const handleEdit = (index) => {
    const taskToEdit = data[index];
    setNewTask({ ...taskToEdit, desc: taskToEdit.description || taskToEdit.desc });
    setIsEditing(index);
  };

  // Save the edited task
  const handleSaveEdit = async () => {
    if (isEditing !== null) {
      if (newTask.title && newTask.desc) {
        try {
          const task = data[isEditing];
          const payload = {
            title: newTask.title,
            description: newTask.desc,
            status: newTask.status
          };
          const res = await fetch(`${API_BASE}/api/tasks/${task._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error('Failed to update');
          const updated = await res.json();
          setData(data.map((item, index) => (index === isEditing ? { ...updated, desc: updated.description } : item)));
          window.dispatchEvent(new CustomEvent('tasks-updated'));
          setNewTask({ title: "", desc: "", status: "Incomplete" });
          setIsEditing(null);
          toast.success("Task updated successfully!");
        } catch (err) {
          console.error(err);
          toast.error('Failed to update task');
        }
      } else {
        toast.error("Please fill in all fields");
      }
    }
  };

  // Delete a task
  const handleDelete = async (index) => {
    try {
      if (!window.confirm('Are you sure you want to delete this task?')) return;
      const task = data[index];
      const res = await fetch(`${API_BASE}/api/tasks/${task._id}`, { method: 'DELETE' });
      if (res.status !== 204) throw new Error('Failed to delete');
      setData(data.filter((_, i) => i !== index));
      window.dispatchEvent(new CustomEvent('tasks-updated'));
      toast.success("Task deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete task');
    }
  };

  // Bulk action handler: action = 'complete' | 'important' | 'delete'
  const bulkAction = async (action) => {
    if (!selected.length) return;
    try {
      if (action === 'delete') {
        if (!window.confirm(`Delete ${selected.length} selected task(s)?`)) return;
        await Promise.all(selected.map(id => fetch(`${API_BASE}/api/tasks/${id}`, { method: 'DELETE' })));
        toast.success('Deleted selected tasks');

      } else if (action === 'important') {
        // set important flag to true for all selected
        await Promise.all(selected.map(id => fetch(`${API_BASE}/api/tasks/${id}/important`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ important: true })
        })));
        toast.success('Marked selected as important');
      } else if (action === 'complete') {
        await Promise.all(selected.map(id => fetch(`${API_BASE}/api/tasks/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Complete' }) })));
        toast.success('Marked selected as complete');
      }
      clearSelection();
      fetchTasks();
      window.dispatchEvent(new CustomEvent('tasks-updated'));
    } catch (err) {
      console.error(err);
      toast.error('Bulk action failed');
    }
  };

  // Filter tasks based on status (Important uses important flag or legacy status)
  const filteredData = (() => {
    if (filterStatus === "All") return data;
    if (filterStatus === "Important") return data.filter(task => task.important === true || task.status === 'Important');
    return data.filter(task => task.status === filterStatus);
  })();

  return (
    <div className="p-4">
      {/* Add New Task Section */}
      {showAddTask && (
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border border-gray-200 bg-white text-gray-800 rounded px-3 py-2 flex-1 placeholder-gray-400 break-words break-all"
          />
          <textarea
            placeholder="Task Description"
            value={newTask.desc}
            onChange={(e) => { setNewTask({ ...newTask, desc: e.target.value }); e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`; }}
            rows={3}
            className="border border-gray-200 bg-white text-gray-800 rounded px-3 py-2 flex-1 placeholder-gray-400 resize-y"
          />
          <div className="flex items-center gap-2">
            {isEditing !== null ? (
              <button onClick={handleSaveEdit} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition-all duration-200">
                Save
              </button>
            ) : (
              <button onClick={handleAddTask} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition-all duration-200">
                <AiOutlinePlus size={20} /> Add Task
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bulk action bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input type="checkbox" onChange={(e) => e.target.checked ? selectAll() : clearSelection()} checked={selected.length === filteredData.length && filteredData.length>0} className="w-4 h-4" />
          <span className="text-sm text-gray-700">{selected.length} selected</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => bulkAction('complete')} disabled={selected.length===0} className="px-3 py-2 rounded bg-green-100 text-green-700">Mark Complete</button>
          <button onClick={() => bulkAction('important')} disabled={selected.length===0} className="px-3 py-2 rounded bg-yellow-100 text-yellow-700">Mark Important</button>
          <button onClick={() => bulkAction('delete')} disabled={selected.length===0} className="px-3 py-2 rounded bg-red-100 text-red-700">Delete</button>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No tasks found for this category
          </div>
        ) : (
          filteredData.map((item, index) => (
            <div key={item._id || index} className="flex flex-col justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <div>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-start gap-3 w-full">
                    <input type="checkbox" checked={selected.includes(item._id)} onChange={() => toggleSelect(item._id)} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-bold mb-1 text-gray-800 break-words break-all whitespace-normal">{item.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{new Date(item.createdAt || item.updatedAt).toLocaleString()}</span>
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">{item.status}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-gray-700 whitespace-pre-wrap break-words">{item.desc}</p>
              </div>

              <div className="flex items-center justify-end mt-4 gap-2 flex-wrap">
                {/* Toggle between Complete and Incomplete */}
                <button
                  onClick={() => toggleStatus(item._id, item.status === "Incomplete" ? "Complete" : "Incomplete")}
                  className={`px-3 py-2 rounded-md text-white transition-colors duration-200 ${
                    item.status === "Incomplete" ? "bg-red-500" : "bg-green-500"
                  } w-full sm:w-auto`}
                >
                  {item.status === "Incomplete" ? "Complete" : "Incomplete"}
                </button>
                {/* Toggle Important flag (independent) */}
                <button
                  onClick={() => toggleImportant(item._id)}
                  className={`px-3 py-2 rounded-md text-white transition-colors duration-200 ${
                    item.important ? "bg-yellow-500" : "bg-blue-500"
                  } w-full sm:w-auto`}
                >
                  {item.important ? "Unmark Important" : "Mark Important"}
                </button>

                {/* Edit & Delete Buttons */}
                <button onClick={() => handleEdit(index)} className="p-2 rounded-full text-gray-600 hover:text-gray-800">
                  <FiEdit size={18} />
                </button>
                <button onClick={() => handleDelete(index)} className="p-2 rounded-full text-red-500 hover:text-red-700">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Prop types for component props validation
Cards.propTypes = {
  filterStatus: PropTypes.string,
  showAddTask: PropTypes.bool
};

export default Cards;
