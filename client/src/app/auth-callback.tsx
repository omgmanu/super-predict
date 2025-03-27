import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

export function AuthCallback() {
  const navigate = useNavigate();
  const { fetchUser, loading } = useUserContext();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Fetch user information after successful auth
        await fetchUser();
        // Redirect to home page
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication callback error:', error);
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [fetchUser, navigate]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-heading mb-4">Authentication in progress...</h1>
        <p className="text-lg mb-8">Please wait while we complete your authentication.</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main mx-auto"></div>
      </div>
    </div>
  );
}

export default AuthCallback; 