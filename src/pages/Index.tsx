
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { HeartHandshake, Users, Calendar, BarChart3, CheckCircle } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent">
      <div className="container px-4 py-12 mx-auto">
        <header className="flex justify-center mb-16">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="h-10 w-10 text-relationship-primary" />
            <h1 className="text-4xl font-bold relationship-text-gradient">Bond Keeper</h1>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold mb-4">
              Nurture Your Important Relationships
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Bond Keeper helps you maintain and strengthen connections with the people who matter most in your life.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-relationship-primary mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold">Never Miss Important Dates</h3>
                  <p className="text-muted-foreground">
                    Keep track of birthdays, anniversaries, and other special occasions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-relationship-primary mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold">Stay Connected</h3>
                  <p className="text-muted-foreground">
                    Get reminders for when it's time to reach out to someone.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-relationship-primary mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold">Understand Your Relationships</h3>
                  <p className="text-muted-foreground">
                    Create surveys to gain insights about your relationships.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button size="lg" onClick={() => navigate('/login')} className="mr-4">
                Get Started
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.open('https://github.com', '_blank')}>
                Learn More
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-card shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
                <Users className="h-10 w-10 text-relationship-primary mb-4" />
                <h3 className="font-semibold mb-2">Contact Management</h3>
                <p className="text-sm text-muted-foreground">
                  Keep all your important contacts in one place with notes and details.
                </p>
              </div>
              
              <div className="bg-card shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
                <Calendar className="h-10 w-10 text-relationship-secondary mb-4" />
                <h3 className="font-semibold mb-2">Important Dates</h3>
                <p className="text-sm text-muted-foreground">
                  Never forget a birthday, anniversary, or special occasion again.
                </p>
              </div>
              
              <div className="bg-card shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
                <BarChart3 className="h-10 w-10 text-relationship-secondary mb-4" />
                <h3 className="font-semibold mb-2">Relationship Surveys</h3>
                <p className="text-sm text-muted-foreground">
                  Create and share surveys to better understand your relationships.
                </p>
              </div>
              
              <div className="bg-card shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
                <HeartHandshake className="h-10 w-10 text-relationship-primary mb-4" />
                <h3 className="font-semibold mb-2">Meaningful Connections</h3>
                <p className="text-sm text-muted-foreground">
                  Build stronger, more meaningful connections with the people you care about.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Bond Keeper. All rights reserved.</p>
          <p className="mt-1">A beautiful relationship management application.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
