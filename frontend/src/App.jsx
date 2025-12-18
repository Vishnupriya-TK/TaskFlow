import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cards from "./components/Home/Cards";
import Dashboard from "./components/Dashboard/Dashboard";
import { FiLogOut } from 'react-icons/fi';

const App = () => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddTask, setShowAddTask] = useState(true);
  // Sidebar state for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // API base and connection state
  const API_BASE = import.meta.env.VITE_API_URL || 'https://taskflow-5tsv.onrender.com';
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;
    const check = async (timeout = 3000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const res = await fetch(`${API_BASE}/api/ping`, { signal: controller.signal, cache: 'no-store' });
        clearTimeout(id);
        if (res.ok && mounted) {
          setIsOnline(true);
          return true;
        }
      } catch (err) {
        console.warn('Connection check failed', err);
      }
      if (mounted) setIsOnline(false);
      return false;
    };

    // initial check + periodic checks
    check();
    const iv = setInterval(() => check(), 10000);
    const onConnectionLost = () => setIsOnline(false);
    const onRetry = () => check();
    window.addEventListener('connection-lost', onConnectionLost);
    window.addEventListener('retry-connection', onRetry);
    return () => {
      mounted = false;
      clearInterval(iv);
      window.removeEventListener('connection-lost', onConnectionLost);
      window.removeEventListener('retry-connection', onRetry);
    };
  }, [API_BASE]);


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
      <div className="App min-h-screen bg-blue-50">
        <ToastContainer />
        
        {/* Sidebar for authenticated users (responsive & light theme) */}
        {auth && (
          <>
            {/* Desktop sidebar (dark) */}
            <aside className="hidden md:fixed md:left-0 md:top-0 md:h-full md:w-64 bg-gray-900 text-white shadow z-10 md:block border-r border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">TaskFlow</h2>
                <p className="text-sm text-gray-300 mt-1">Welcome, {user?.username}!</p>
              </div>
              <nav className="mt-6 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center px-4 py-3 text-gray-200 hover:bg-gray-800 rounded-lg mb-2 transition-colors"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors mt-4"
                >
                  <FiLogOut className="mr-3" />
                  Logout
                </button>
              </nav>
            </aside>

            {/* Mobile sidebar (drawer) */}
            <div className={`fixed inset-0 z-30 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`} aria-hidden={!sidebarOpen}>
              <div className={`absolute inset-0 bg-black/30 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
              <aside className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">TaskFlow</h2>
                    <p className="text-xs text-gray-500">Welcome, {user?.username}!</p>
                  </div>
                  <button className="text-gray-500" onClick={() => setSidebarOpen(false)}>Close</button>
                </div>
                <nav className="mt-6 px-4">
                  {navItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                      <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2 transition-colors">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  ))}
                  <button onClick={() => { setSidebarOpen(false); handleLogout(); }} className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4">
                    <FiLogOut className="mr-3" />
                    Logout
                  </button>
                </nav>
              </aside>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className={`${auth ? 'md:ml-64' : ''} min-h-screen transition-all duration-300 bg-blue-50` }>
          {/* Offline banner */}
          {!isOnline && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-center flex items-center justify-between gap-3">
                <span>Connection lost — some actions may fail.</span>
                <button onClick={() => window.dispatchEvent(new Event('retry-connection'))} className="text-sm text-red-700 underline">Retry</button>
              </div>
            </div>
          )}

          {/* Top header for mobile when authenticated */}
          {auth && (
            <header className="md:hidden bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </button>
                  <h1 className="text-lg font-semibold text-gray-800">TaskFlow</h1>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{user?.username}</span>
                </div>
              </div>
            </header>
          )}

          {!auth && (
            <header className="bg-white/0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
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
                            { ["All", "Incomplete", "Complete", "Important"].map((status) => (
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
                            )) }
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
