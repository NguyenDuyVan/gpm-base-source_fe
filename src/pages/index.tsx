import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  
  // Check if user is coming from a redirect
  useEffect(() => {
    const { redirected } = router.query;
    if (redirected === 'true') {
      router.replace('/');
    }
  }, [router]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
            Welcome to Next.js with React Query & Zustand
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            A powerful starter template with data fetching, state management, and authentication already set up for your next project.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200">
                  Login
                </Link>
              </>
            )}
            <Link href="/examples"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200">
              View Examples
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          <FeatureCard 
            title="React Query"
            description="Powerful data fetching, caching, and state management for your API data."
            icon="🔄" 
          />
          <FeatureCard 
            title="Zustand"
            description="Simple, fast, and scalable state management without the boilerplate."
            icon="🐻" 
          />
          <FeatureCard 
            title="TypeScript"
            description="Full type safety throughout the application for a better developer experience."
            icon="📘" 
          />
          <FeatureCard 
            title="Authentication"
            description="Complete authentication flow with protected routes and persistence."
            icon="🔒" 
          />
          <FeatureCard 
            title="Tailwind CSS"
            description="Utility-first CSS framework for rapid UI development."
            icon="🎨" 
          />
          <FeatureCard 
            title="Next.js"
            description="React framework with hybrid static & server rendering, route pre-fetching, and more."
            icon="⚡" 
          />
        </div>
      </div>
    </MainLayout>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
