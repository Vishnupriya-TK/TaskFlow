import { useEffect, useState } from 'react';
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

  const API_BASE = import.meta.env.VITE_API_URL || 'https://taskflow-5tsv.onrender.com';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userId = currentUser?.email;
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const res = await fetch(`${API_BASE}/api/tasks?${params.toString()}`);
        const tasks = await res.json();
        const stats = {
          total: tasks.length,
          complete: tasks.filter(task => task.status === 'Complete').length,
          incomplete: tasks.filter(task => task.status === 'Incomplete').length,
          important: tasks.filter(task => ((task.important === true) || task.status === 'Important')).length
        };
        setTaskStats(stats);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    window.addEventListener('tasks-updated', fetchStats);
    return () => window.removeEventListener('tasks-updated', fetchStats);
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
    <div className="p-6 bg-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-600">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-800">{taskStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-600">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{taskStats.complete}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-600">Incomplete</h3>
          <p className="text-3xl font-bold text-red-600">{taskStats.incomplete}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-600">Important</h3>
          <p className="text-3xl font-bold text-yellow-500">{taskStats.important}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Task Distribution</h3>
          <div className="flex justify-center">
            <BarChart width={500} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderColor: '#e6e6e6',
                  color: '#333'
                }} 
              />
              <Legend />
              <Bar dataKey="tasks" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Task Status Distribution</h3>
          <div className="flex justify-center">
            <PieChart width={400} height={300}>
              <Pie
                data={pieData}
                cx={200}
                cy={150}
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={{ position: 'outside', fill: '#333', fontSize: 12 }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderColor: '#e6e6e6',
                  color: '#333'
                }} 
              />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard; 