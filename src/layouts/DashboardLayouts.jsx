import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { logout } from "../utils/auth";
import UserDropdown from "../components/UserDropdown";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-50 top-0 left-0 h-full w-64 bg-white border-r border-slate-200 
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
        `}
      >
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-indigo-600">TaskFlow</h1>

          {/* Close button (mobile only) */}
          <button
            className="lg:hidden text-slate-500"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {user.role === "ADMIN" && (
            <>
              <button
                onClick={() => {
                  navigate("/admin/dashboard");
                  setSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  navigate("/admin/tasks");
                  setSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Manage Tasks
              </button>
            </>
          )}

          {user.role === "MEMBER" && (
            <button
              onClick={() => {
                navigate("/member/tasks");
                setSidebarOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              My Tasks
            </button>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">

          {/* Hamburger (mobile only) */}
          <button
            className="lg:hidden text-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <div className="hidden lg:block text-sm text-slate-600">
            Welcome back,
            <span className="ml-1 font-medium text-slate-800">
              {user.name}
            </span>
          </div>

          <UserDropdown user={user} onLogout={handleLogout} />
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
