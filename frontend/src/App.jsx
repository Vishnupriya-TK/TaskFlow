import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cards from "./components/Home/Cards";
import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddTask, setShowAddTask] = useState(true);

  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem("auth"));
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedAuth && savedUser) {
      setAuth(true);
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setAuth(true);
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify(true));
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setAuth(false);
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("currentUser");
  };

  // Navigation items for the sidebar
  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/tasks", name: "Tasks", icon: "📝" }
  ];

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <ToastContainer />
        
        {/* Sidebar for authenticated users */}
        {auth && (
          <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-950 to-blue-900 shadow-lg z-10 border-r border-white/10">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Task Manager</h2>
              <p className="text-sm text-white/70 mt-1">Welcome, {user?.username}!</p>
            </div>
            
            <nav className="mt-6 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-4 py-3 text-white/80 hover:bg-blue-800/50 rounded-lg mb-2 transition-colors"
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-lg transition-colors mt-4"
              >
                <span className="mr-3">🚪</span>
                Logout
              </button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <div className={`${auth ? 'ml-64' : ''} min-h-screen transition-all duration-300 bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400`}>
          {!auth && (
            <header className="bg-white/10 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Task Management App</h1>
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className="inline-block px-4 py-2 text-white bg-blue-600/50 rounded-lg hover:bg-blue-700/50 transition-colors backdrop-blur-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-block px-4 py-2 text-white bg-green-600/50 rounded-lg hover:bg-green-700/50 transition-colors backdrop-blur-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </header>
          )}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route
                path="/"
                element={auth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
              />
              <Route
                path="/dashboard"
                element={auth ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/tasks"
                element={
                  auth ? (
                    <div className="space-y-6">
                      {/* Task Filters */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                          <div className="space-x-2">
                            {["All", "Incomplete", "Complete", "Important"].map((status) => (
                              <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg ${
                                  filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-colors`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setShowAddTask(!showAddTask)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            {showAddTask ? "Hide Add Task" : "Add New Task"}
                          </button>
                        </div>
                      </div>
                      <Cards filterStatus={filterStatus} showAddTask={showAddTask} />
                    </div>
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/login"
                element={!auth ? <Login setAuth={handleLogin} /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/signup"
                element={!auth ? <Signup setAuth={handleLogin} /> : <Navigate to="/dashboard" />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
