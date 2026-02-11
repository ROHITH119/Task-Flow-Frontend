import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import api from "../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState("");

  // live password match check
  useEffect(() => {
    if (!confirmPassword) {
      setPasswordError(false);
      return;
    }
    setPasswordError(password !== confirmPassword);
  }, [password, confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Join TaskFlow to manage your work"
    >
      <form className="space-y-6" onSubmit={handleRegister}>
        <TextInput
          label="Name"
          id="name"
          onChange={(e) => setName(e.target.value)}
        />

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

        <TextInput
          label="Confirm password"
          id="confirmPassword"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {passwordError && (
          <p className="text-sm text-red-600 text-center">
            Passwords do not match
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <Button variant="primary" fullWidth>
          Create account
        </Button>

        <p className="text-sm text-slate-600 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </AuthCard>
  );
};

export default Register;
