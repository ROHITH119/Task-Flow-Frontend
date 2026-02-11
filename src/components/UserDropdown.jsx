import { useState, useRef, useEffect } from "react";

const UserDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold hover:opacity-90 transition"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg p-4">
          <div className="mb-3">
            <p className="text-sm font-medium text-slate-900">
              {user.name}
            </p>
            <p className="text-xs text-slate-500">
              {user.email}
            </p>
            <p className="text-xs text-indigo-600 mt-1 font-medium">
              {user.role}
            </p>
          </div>

          <div className="border-t pt-3">
            <button
              onClick={onLogout}
              className="w-full text-left text-sm text-red-600 hover:text-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
