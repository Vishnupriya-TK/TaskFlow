import React from "react";
import { CgNotes } from "react-icons/cg";
import { MdLabelImportant } from "react-icons/md";  
import { FaCheckDouble } from "react-icons/fa";  
import { TbNotebookOff } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ setAuth }) => {
    const navigate = useNavigate();

    const data = [
        { title: "All Tasks", icon: <CgNotes />, path: "/alltasks" },
        { title: "Important Tasks", icon: <MdLabelImportant />, path: "/importanttasks" },
        { title: "Completed Tasks", icon: <FaCheckDouble />, path: "/completedtasks" },
        { title: "Incomplete Tasks", icon: <TbNotebookOff />, path: "/incompletedtasks" },
    ];

    // Logout handler
    const handleLogout = () => {
        setAuth(false);  // Update authentication status
        navigate("/login");  // Redirect to login page
    };

    return (
        <div className="text-white p-4 bg-gray-900 h-full">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
                <hr className="my-4 border border-gray-700" />
            </div>

            {/* Sidebar Links Section */}
            <div className="flex-1">
                {data.map((item, index) => (
                    <Link to={item.path} key={index}>
                        <div
                            className="flex items-center py-2 px-4 my-2 rounded cursor-pointer hover:bg-gray-100 transition duration-200"
                        >
                            <span className="mr-3 text-2xl">{item.icon}</span>
                            <span className="text-sm">{item.title}</span>
                        </div>
                    </Link>
                ))}
                
                {/* Logout Button */}
                <div
                    onClick={handleLogout}
                    className="flex items-center py-2 px-4 mt-6 rounded cursor-pointer hover:bg-red-50 transition duration-200 text-red-600"
                >
                    <FiLogOut size={20} className="mr-3" />
                    <span className="text-sm">Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
