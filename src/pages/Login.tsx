
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleCredentialResponse {
  credential: string;
}

interface DecodedCredential {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = (response: GoogleCredentialResponse) => {
    try {
      const decoded = jwtDecode<DecodedCredential>(response.credential);
      
      login({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });
    } catch (error) {
      console.error('Failed to decode Google credential:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-gradient-to-br from-relationship-primary to-relationship-secondary flex items-center justify-center p-8">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-6">
            <HeartHandshake className="h-10 w-10" />
            <h1 className="text-3xl font-bold">Bond Keeper</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Strengthen Your Relationships</h2>
          <p className="mb-6">
            Track important dates, send reminders, and understand your relationships
            better with our intuitive relationship management tool.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium mb-2">Track Important Dates</h3>
              <p className="text-sm opacity-90">Never miss another birthday or anniversary</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium mb-2">Send Reminders</h3>
              <p className="text-sm opacity-90">Get notifications for upcoming events</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium mb-2">Conduct Surveys</h3>
              <p className="text-sm opacity-90">Learn more about your relationships</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-medium mb-2">Track Interactions</h3>
              <p className="text-sm opacity-90">Keep a log of your meaningful connections</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to continue to Bond Keeper</p>
          </div>
          
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log('Login Failed')}
              useOneTap
            />
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
