import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TasksByStatusChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h2 className="text-sm font-semibold mb-4">
        Tasks by Status
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksByStatusChart;
