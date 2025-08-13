import { FormEvent, useState } from "react";
import { useLoginMutation } from "@/api/mutations/useAuthMutation";
import { URL_MANAGEMENT } from "@/constants";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    mutateAsync: login,
    isPending,
    error,
    isSuccess,
  } = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login({ email, password });
    onSuccess?.();
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded">
            {(error as Error).message}
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded">
            Login successful!
          </div>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div className="mt-2 text-right">
            <a
              href={URL_MANAGEMENT.FORGOT_PASSWORD}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging in..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
