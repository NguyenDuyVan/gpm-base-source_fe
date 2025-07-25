import AuthGuard from '@/components/auth/AuthGuard';
import MainLayout from '@/components/layouts/MainLayout';
import { useLogout } from '@/hooks/useAuth';
import { useCounterStore } from '@/store/counterStore';
import { useAuthStore } from '@/store/authStore';

export default function Dashboard() {
  const { mutate: logout, isPending } = useLogout();
  const { count, increment, decrement, reset } = useCounterStore();
  const user = useAuthStore((state) => state.user);

  return (
    <AuthGuard>
      <MainLayout>
        <div className="py-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="bg-white shadow rounded-lg mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">Email: {user?.email}</p>

            <button
              onClick={() => logout()}
              disabled={isPending}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Counter Demo (Zustand)</h2>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={decrement}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
              >
                -
              </button>
              <div className="text-2xl font-bold">{count}</div>
              <button
                onClick={increment}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
              >
                +
              </button>
            </div>

            <button
              onClick={reset}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Reset Counter
            </button>
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
