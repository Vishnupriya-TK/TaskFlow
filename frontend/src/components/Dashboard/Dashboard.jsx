import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    complete: 0,
    incomplete: 0,
    important: 0
  });

  useEffect(() => {
    // Get tasks from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const userTasks = tasks.filter(task => task.userId === currentUser?.email);

    // Calculate statistics
    const stats = {
      total: userTasks.length,
      complete: userTasks.filter(task => task.status === 'Complete').length,
      incomplete: userTasks.filter(task => task.status === 'Incomplete').length,
      important: userTasks.filter(task => task.status === 'Important').length
    };

    setTaskStats(stats);
  }, []);

  const barData = [
    { name: 'Total', tasks: taskStats.total },
    { name: 'Complete', tasks: taskStats.complete },
    { name: 'Incomplete', tasks: taskStats.incomplete },
    { name: 'Important', tasks: taskStats.important }
  ];

  const pieData = [
    { name: 'Complete', value: taskStats.complete },
    { name: 'Incomplete', value: taskStats.incomplete },
    { name: 'Important', value: taskStats.important }
  ];

  const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">{taskStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{taskStats.complete}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Incomplete</h3>
          <p className="text-3xl font-bold text-red-600">{taskStats.incomplete}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Important</h3>
          <p className="text-3xl font-bold text-yellow-600">{taskStats.important}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Task Distribution</h3>
          <div className="flex justify-center">
            <BarChart width={500} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Task Status Distribution</h3>
          <div className="flex justify-center">
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 