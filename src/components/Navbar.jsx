import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      
      {/* Left */}
      <div
        onClick={() =>
          user.role === "ADMIN"
            ? navigate("/admin/dashboard")
            : navigate("/member/tasks")
        }
        className="text-lg font-semibold text-indigo-600 cursor-pointer"
      >
        TaskFlow
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          {user.name}
        </span>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
            user.role === "ADMIN"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-sky-100 text-sky-700"
          }`}
        >
          {user.role}
        </span>

        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
