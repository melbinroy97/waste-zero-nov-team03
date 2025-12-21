import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { alertToast } from "@/components/ui/AlertToast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<"VOLUNTEER" | "NGO">("VOLUNTEER");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role,
        });
      } else {
        await login(form.email, form.password);
      }

      navigate("/dashboard");
    } catch (err: any) {
      alertToast.error({
        title: "Authentication Error",
        description: err.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-center">
          {isSignUp ? "Create Account" : "Login"}
        </h1>

        {isSignUp && (
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />

        {isSignUp && (
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded border p-2"
          />
        )}

        {isSignUp && (
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={role === "VOLUNTEER"}
                onChange={() => setRole("VOLUNTEER")}
              />
              Volunteer
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={role === "NGO"}
                onChange={() => setRole("NGO")}
              />
              NGO
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-primary p-2 text-white disabled:opacity-50"
        >
          {isLoading
            ? "Please wait..."
            : isSignUp
            ? "Register"
            : "Login"}
        </button>

        <p
          className="cursor-pointer text-center text-sm text-muted-foreground"
          onClick={() => setIsSignUp((prev) => !prev)}
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </p>
      </form>
    </div>
  );
}
