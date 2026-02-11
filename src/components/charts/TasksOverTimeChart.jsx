import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TasksOverTimeChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <h2 className="text-sm font-semibold mb-4">
        Tasks Over Time
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#f59e0b"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksOverTimeChart;
