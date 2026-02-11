import AuthCard from "../components/AuthCard";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import React from "react";
import { loginUser } from "../api/auth.api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/member/tasks");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      const {user, token} = res.data.data

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log(res.data.success)

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/member/tasks");
      }
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("RESPONSE:", err.response);
      console.log("DATA:", err.response?.data);
      setError(err.response?.data?.message || "Invalid user credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Login" subtitle="Welcome back to TaskFlow">
      <form className="space-y-6" onSubmit={handleLogin}>
        <TextInput
          label="Email"
          id="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button variant="primary" fullWidth disabled={loading}>
          {loading ? "Logging in.." : "Login"}
        </Button>

        <p className="text-sm text-slate-600 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </AuthCard>
  );
};

export default Login;
