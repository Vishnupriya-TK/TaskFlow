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
import { CiHeart } from "react-icons/ci";

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    complete: 0,
    incomplete: 0,
    important: 0,
    favorite: 0
  });

  useEffect(() => {
    // Get tasks from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const userTasks = tasks.filter(task => task.userId === currentUser?.email);

    // Calculate statistics
    const stats = {
      total: userTasks.length,
      complete: userTasks.filter(task => task.status === 'Complete').length,
      incomplete: userTasks.filter(task => task.status === 'Incomplete').length,
      important: userTasks.filter(task => task.status === 'Important').length,
      favorite: userTasks.filter(task => task.favorite).length
    };

    setTaskStats(stats);
  }, []);

  const barData = [
    { name: 'Total', tasks: taskStats.total },
    { name: 'Complete', tasks: taskStats.complete },
    { name: 'Incomplete', tasks: taskStats.incomplete },
    { name: 'Important', tasks: taskStats.important },
    { name: 'Favorite', tasks: taskStats.favorite }
  ];

  const pieData = [
    { name: 'Complete', value: taskStats.complete },
    { name: 'Incomplete', value: taskStats.incomplete },
    { name: 'Important', value: taskStats.important }
  ];

  const favoriteDistribution = [
    { name: 'Favorite', value: taskStats.favorite },
    { name: 'Regular', value: taskStats.total - taskStats.favorite }
  ];

  const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];
  const FAVORITE_COLORS = ['#FF6B6B', '#4A90E2'];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/20">
          <h3 className="text-lg font-semibold text-white/80">Total Tasks</h3>
          <p className="text-3xl font-bold text-white">{taskStats.total}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/20">
          <h3 className="text-lg font-semibold text-white/80">Completed</h3>
          <p className="text-3xl font-bold text-green-400">{taskStats.complete}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/20">
          <h3 className="text-lg font-semibold text-white/80">Incomplete</h3>
          <p className="text-3xl font-bold text-red-400">{taskStats.incomplete}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/20">
          <h3 className="text-lg font-semibold text-white/80">Important</h3>
          <p className="text-3xl font-bold text-yellow-400">{taskStats.important}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/20">
          <div className="flex items-center gap-2">
            <CiHeart size={24} color="#FF6B6B" />
            <h3 className="text-lg font-semibold text-white/80">Favorites</h3>
          </div>
          <p className="text-3xl font-bold text-red-400">{taskStats.favorite}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-white/80">Task Distribution</h3>
          <div className="flex justify-center">
            <BarChart width={500} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }} 
              />
              <Legend />
              <Bar dataKey="tasks" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-white/80">Task Status Distribution</h3>
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
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }} 
              />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>

      {/* Favorite Distribution Chart */}
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md border border-white/20">
        <h3 className="text-lg font-semibold mb-4 text-white/80">Favorite vs Regular Tasks</h3>
        <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={favoriteDistribution}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {favoriteDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={FAVORITE_COLORS[index % FAVORITE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'white'
              }} 
            />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 