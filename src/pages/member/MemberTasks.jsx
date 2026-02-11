import React, { useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const MemberTasks = () => {
  const [tasks, setTasks] = React.useState([]);
  const [cursor, setCursor] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [updatingTaskId, setUpdatingTaskId] = React.useState(null);

  const [filterStatus, setFilterStatus] = React.useState("");

   const [search, setSearch] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");

  useEffect(()=> {
    const handler = setTimeout(()=> {
      setDebouncedSearch(search)
    }, 500)

    return ()=> clearTimeout(handler)
  },[search])

  const fetchTasks = async (nextCursor = null) => {
    try {
      setLoading(true);

      const res = await api.get("/tasks/my", {
        params: {
          limit: 5,
          cursor: nextCursor,
          status: filterStatus || undefined,
          search: debouncedSearch || undefined,
        },
      });

      const result = res.data.data;

      if (nextCursor) {
        setTasks((prev) => [...prev, ...result.tasks]);
      } else {
        setTasks(result.tasks);
      }

      setCursor(result.nextCursor);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setCursor(null)
    // setTasks([])
    fetchTasks();
  }, [filterStatus, debouncedSearch]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId);

      await api.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
      });

      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task,
        ),
      );

      toast.success("Task status updated");
    } catch (err) {
      console.error("Failed to update status");
      toast.error("Failed to update status");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">My Tasks</h1>
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-end shadow-sm">
          <div className="flex flex-col">
          <label className="text-sm text-slate-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-60"
          ></input>
        </div>
          <div className="flex flex-col">
            <label className="text-sm text-slate-600 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input w-40"
            >
              <option value="">All</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

          <button
            onClick={() => {
              setFilterStatus("");
              setSearch("")
              setDebouncedSearch("")
            }}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>

        {/* Empty State */}
        {tasks.length === 0 && !loading && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
            No tasks assigned yet.
          </div>
        )}

        {/* Task List */}
        <div className="space-y-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-slate-900 mb-1">
                  {task.title}
                </h2>
                <p className="text-sm mt-2">
                  Created By:
                  <span className="text-slate-600 font-medium ml-1">
                    {task.createdBy?.name}
                  </span>
                </p>
              </div>

              <p className="text-sm text-slate-600 mb-1">
                {task.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    task.status === "DONE"
                      ? "bg-green-100 text-green-700"
                      : task.status === "IN_PROGRESS"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {task.status}
                </span>

                <select
                  disabled={updatingTaskId === task._id}
                  value={task.status}
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                  className="text-xs border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <p className="text-xs text-slate-400 mt-3">
                Updated: {new Date(task.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Load More */}
        {cursor && (
          <div className="mt-8 text-center">
            <button
              onClick={() => fetchTasks(cursor)}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberTasks;
