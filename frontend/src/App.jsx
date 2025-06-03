import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cards from "./components/Home/Cards";

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

  return (
    <Router>
      <div className="App flex bg-blue-300 min-h-screen">
        <ToastContainer />
        <div className="flex-1">
          <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">Task Management App</h1>
            <div>
              {auth ? (
                <>
                  <span className="mr-4">Welcome, {user?.username}!</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 rounded-md text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div>
                  <button
                    className="px-4 py-2 bg-green-500 rounded-md text-white hover:bg-green-600 mr-2"
                  >
                    <a href="/login">Login</a>
                  </button>
                  <button
                    className="px-4 py-2 bg-yellow-500 rounded-md text-white hover:bg-yellow-600"
                  >
                    <a href="/signup">Signup</a>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Filter and Add Task Section */}
          {auth && (
            <div className="flex justify-between p-4">
              <div>
                {["All", "Incomplete", "Complete", "Important"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className="px-4 py-2 mr-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {showAddTask ? "Hide Add Task" : "Show Add Task"}
              </button>
            </div>
          )}

          <Routes>
            <Route
              path="/"
              element={auth ? <Cards filterStatus={filterStatus} showAddTask={showAddTask} /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={!auth ? <Login setAuth={handleLogin} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!auth ? <Signup setAuth={handleLogin} /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
