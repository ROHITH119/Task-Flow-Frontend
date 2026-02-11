import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { logout } from "../utils/auth";
import UserDropdown from "../components/UserDropdown";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-200">
          <h1 className="text-lg font-semibold text-indigo-600">TaskFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {user.role === "ADMIN" && (
            <>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/admin/tasks")}
                className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                Manage Tasks
              </button>
            </>
          )}

          {user.role === "MEMBER" && (
            <button
              onClick={() => navigate("/member/tasks")}
              className="w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              My Tasks
            </button>
          )}
        </nav>

        {/* <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div> */}
      </aside>

      {/* top area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 relative">
          <div className="text-sm text-slate-600">
            Welcome back,
            <span className="ml-1 font-medium text-slate-800">{user.name}</span>
          </div>

          <UserDropdown user={user} onLogout={handleLogout} />
        </header>

        {/* pages */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
