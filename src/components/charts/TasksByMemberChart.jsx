import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TasksByMemberChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <h2 className="text-sm font-semibold mb-4">
        Tasks by Member
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="memberName" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="taskCount"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TasksByMemberChart;
