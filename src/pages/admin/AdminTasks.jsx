import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [saving, setSaving] = useState(false);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterMember, setFilterMember] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Tasks
  const fetchTasks = async (nextCursor = null) => {
    try {
      setLoading(true);

      const res = await api.get("/tasks", {
        params: {
          limit: 10,
          cursor: nextCursor,
          status: filterStatus || undefined,
          assignedTo: filterMember || undefined,
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
    } catch {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Members
  const fetchMembers = async () => {
    try {
      const res = await api.get("/users/members");
      setMembers(res.data.data);
    } catch {
      toast.error("Failed to fetch members");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, []);

  // Delete
  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      setDeletingId(taskId);
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success("Task deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setAssignedTo(task.assignedTo?._id || "");
    setShowModal(true);
  };

  // Save Edit
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title || !assignedTo) {
      toast.error("Title and assignment required");
      return;
    }

    try {
      setSaving(true);

      const res = await api.patch(`/tasks/${editingTask._id}`, {
        title,
        description,
        assignedTo,
      });

      const updatedTask = res.data.data;

      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
      );

      toast.success("Task updated");
      setShowModal(false);
      setEditingTask(null);
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setCursor(null);
    // setTasks([])
    fetchTasks();
  }, [filterStatus, filterMember, debouncedSearch]);

  return (
    // <div className="min-h-screen bg-slate-50 p-6 ">
    <>
      <h1 className="text-2xl font-semibold mb-6">All Tasks</h1>
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shadow-sm">
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

        <div className="flex flex-col">
          <label className="text-sm text-slate-600 mb-1">Member</label>
          <select
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            className="input w-48"
          >
            <option value="">All</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <button onClick={() => fetchTasks()} className="btn btn-primary">
          Apply Filters
        </button>

        <button
          onClick={() => {
            setFilterStatus("");
            setFilterMember("");
            setSearch("");
            setDebouncedSearch("");
            // fetchTasks();
          }}
          className="btn btn-secondary"
        >
          Reset
        </button>
      </div>

      <div className="space-y-5">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="font-semibold text-slate-900">{task.title}</h2>

                <p className="text-sm text-slate-600 mt-1">
                  {task.description || "No description provided."}
                </p>

                <div className="mt-3 text-sm text-slate-500 space-y-1">
                  <p>
                    Assigned To:{" "}
                    <span className="text-slate-700 font-medium">
                      {task.assignedTo?.name}
                    </span>
                  </p>
                  <p>
                    Created By:{" "}
                    <span className="text-slate-700 font-medium">
                      {task.createdBy?.name}
                    </span>
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ml-4 ${
                  task.status === "DONE"
                    ? "bg-green-100 text-green-700"
                    : task.status === "IN_PROGRESS"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                {task.status}
              </span>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => openEditModal(task)}
                className="text-sm px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(task._id)}
                disabled={deletingId === task._id}
                className="text-sm px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 font-medium"
              >
                {deletingId === task._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {cursor && (
        <div className="text-center">
          <button
            onClick={() => fetchTasks(cursor)}
            className="btn btn-primary mt-8"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleUpdate} className="space-y-4">
          <h2 className="text-lg font-semibold">Edit Task</h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="Task title"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            placeholder="Task description"
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="input"
          >
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Update Task"}
            </button>
          </div>
        </form>
      </Modal>
    </>
    // </div>
  );
};

export default AdminTasks;
