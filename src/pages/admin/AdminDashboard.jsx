import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../utils/auth";
import TasksByStatusChart from "../../components/charts/TasksByStatusChart";
import TasksOverTimeChart from "../../components/charts/TasksOverTimeChart";
import TasksByMemberChart from "../../components/charts/TasksByMemberChart";
import api from "../../api/axios";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";
import "../../../public/vite.svg"

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [statusData, setStatusData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [creating, setCreating] = useState(false);
  const [kpis, setKpis] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    members: 0,
  });

//   const testData = [
//   { date: "2026-01-01", count: 5 },
//   { date: "2026-01-02", count: 8 },
//   { date: "2026-01-03", count: 12 },
//   { date: "2026-01-04", count: 6 },
//   { date: "2026-01-05", count: 14 },
//   { date: "2026-01-06", count: 10 },
//   { date: "2026-01-07", count: 18 },
//   { date: "2026-01-08", count: 9 },
//   { date: "2026-01-09", count: 22 },
//   { date: "2026-01-10", count: 17 },
//   { date: "2026-01-11", count: 13 },
//   { date: "2026-01-12", count: 25 },
//   { date: "2026-01-13", count: 19 },
//   { date: "2026-01-14", count: 30 },
//   { date: "2026-01-15", count: 21 },
//   { date: "2026-01-16", count: 28 },
//   { date: "2026-01-17", count: 35 },
//   { date: "2026-01-18", count: 26 },
//   { date: "2026-01-19", count: 40 },
//   { date: "2026-01-20", count: 32 },
//   { date: "2026-01-21", count: 45 },
//   { date: "2026-01-22", count: 37 },
//   { date: "2026-01-23", count: 50 },
//   { date: "2026-01-24", count: 41 },
//   { date: "2026-01-25", count: 55 },
//   { date: "2026-01-26", count: 48 },
//   { date: "2026-01-27", count: 60 },
//   { date: "2026-01-28", count: 52 },
//   { date: "2026-01-29", count: 68 },
//   { date: "2026-01-30", count: 57 },
//   { date: "2026-01-31", count: 70 },
//   { date: "2026-02-01", count: 65 },
//   { date: "2026-02-02", count: 72 },
//   { date: "2026-02-03", count: 64 },
//   { date: "2026-02-04", count: 80 },
//   { date: "2026-02-05", count: 75 },
//   { date: "2026-02-06", count: 88 },
//   { date: "2026-02-07", count: 82 },
//   { date: "2026-02-08", count: 95 },
//   { date: "2026-02-09", count: 90 },
//   { date: "2026-02-10", count: 100 },
//   { date: "2026-02-11", count: 92 },
//   { date: "2026-02-12", count: 105 },
//   { date: "2026-02-13", count: 98 },
//   { date: "2026-02-14", count: 110 },
//   { date: "2026-02-15", count: 102 },
//   { date: "2026-02-16", count: 120 },
//   { date: "2026-02-17", count: 115 },
//   { date: "2026-02-18", count: 130 },
//   { date: "2026-02-19", count: 2 },
//   { date: "2026-02-20", count: 140 },
//   { date: "2026-02-21", count: 135 },
//   { date: "2026-02-22", count: 20 },
//   { date: "2026-02-23", count: 142 },
//   { date: "2026-02-24", count: 160 },
//   { date: "2026-02-25", count: 155 },
//   { date: "2026-02-26", count: 170 },
//   { date: "2026-02-27", count: 162 },
//   { date: "2026-02-28", count: 10 }
// ];


  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const statusRes = await api.get("/analytics/tasks-by-status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const timeRes = await api.get("/analytics/tasks-over-time", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const memberRes = await api.get("/analytics/tasks-by-member", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const memberList = await api.get("/users/members");

      const totalTasks = statusRes.data.result.reduce(
        (acc, item) => acc + item.count,
        0,
      );

      const completed =
        statusRes.data.result.find((s) => s.status === "DONE")?.count || 0;

      const inProgress =
        statusRes.data.result.find((s) => s.status === "IN_PROGRESS")?.count ||
        0;

      setKpis({
        total: totalTasks,
        completed,
        inProgress,
        members: memberList.data.data.length,
      });

      setMembers(memberList.data.data);
      setStatusData(statusRes.data.result);
      setTimeData(timeRes.data.result);
      setMemberData(memberRes.data.result);
    } catch (err) {
      console.error("Failed to load analytics");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title || !assignedTo) {
      toast.error("Title and user assignment required");
      return;
    }

    try {
      setCreating(true);

      await api.post("/tasks", {
        title,
        description,
        assignedTo,
      });

      setTitle("");
      setAssignedTo("");
      setDescription("");
      setShowForm(false);

      await fetchAnalytics();

      toast.success("Task created");
    } catch (err) {
      console.error("Failed to create task");
      toast.error("Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? "Cancel" : "Create Task"}
        </button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <h2 className="text-lg font-semibold">Create Task</h2>

          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Task title"
            type="text"
            className="input"
          />

          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Task Description"
            className="input"
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
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <p className="text-2xl font-semibold mt-1">{kpis.total}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {kpis.completed}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">
            {kpis.inProgress}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Members</p>
          <p className="text-2xl font-semibold text-indigo-600 mt-1">
            {kpis.members}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TasksByStatusChart data={statusData} />
        <TasksOverTimeChart data={timeData} />
        <TasksByMemberChart data={memberData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
