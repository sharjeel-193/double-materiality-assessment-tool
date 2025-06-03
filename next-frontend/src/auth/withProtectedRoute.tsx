// utils/withProtectedRoute.tsx
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { useAuthContext } from '@/providers';
import { Loader } from '@/components';

/**
 * Simple HOC for protecting routes - uses auth context directly
 */
export default function withProtectedRoute<T extends object>(
    Component: ComponentType<T>
) {
    const ComponentWithAuth = (props: T) => {
        const router = useRouter();
        const { isAuthenticated, loading } = useAuthContext();

        useEffect(() => {
        // Redirect to login if not authenticated and not loading
        if (!loading && !isAuthenticated) {
            router.replace('/login');
        }
        }, [isAuthenticated, loading, router]);

        // Show loading while checking authentication
        if (loading) {
            return (
                <Loader variant='overlay' message='Verifying Authntication ...' />
            );
        }

        // Don't render anything if not authenticated (will redirect)
        if (!isAuthenticated) {
            return null
        }

        // Render the component with original props (no auth props injection)
        return <Component {...props} />;
  };

  return ComponentWithAuth;
}
