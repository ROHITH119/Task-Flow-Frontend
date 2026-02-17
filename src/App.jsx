import "./index.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MemberTasks from "./pages/member/MemberTasks";
import { Toaster } from "react-hot-toast";
import AdminTasks from "./pages/admin/AdminTasks";
import DashboardLayout from "./layouts/DashboardLayouts";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayouts>
                <AdminDashboard />
              </MainLayouts>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tasks"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <MainLayouts>
                <AdminTasks />
              </MainLayouts>
            </ProtectedRoute>
          }
        /> */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
        </Route>

        {/* <Route
          path="/member/tasks"
          element={
            <ProtectedRoute allowedRoles={["MEMBER"]}>
              <MainLayouts>
                <MemberTasks />
              </MainLayouts>
            </ProtectedRoute>
          }
        /> */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["MEMBER"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/member/tasks" element={<MemberTasks />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
