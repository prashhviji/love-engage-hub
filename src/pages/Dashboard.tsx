
import { useState, useEffect } from 'react';
import { useRelationship } from '@/contexts/RelationshipContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Users, Heart, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const { contacts, importantDates, getUpcomingDates, getContactById } = useRelationship();
  const [upcomingDates, setUpcomingDates] = useState(getUpcomingDates(30));

  useEffect(() => {
    // Update upcoming dates whenever the importantDates change
    setUpcomingDates(getUpcomingDates(30));
  }, [importantDates, getUpcomingDates]);

  // If the user has no data, show a welcome screen with quick actions
  const showEmptyState = contacts.length === 0 && importantDates.length === 0;

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your relationship overview.
        </p>
      </header>

      {showEmptyState ? (
        <div className="text-center py-12">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <Heart className="h-10 w-10 text-relationship-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Welcome to Bond Keeper</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Get started by adding your first contact or important date to keep track of your meaningful relationships.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contacts">
              <Button className="w-full sm:w-auto" size="lg">
                <Users className="mr-2 h-4 w-4" />
                Add Contacts
              </Button>
            </Link>
            <Link to="/important-dates">
              <Button className="w-full sm:w-auto" variant="outline" size="lg">
                <Calendar className="mr-2 h-4 w-4" />
                Add Important Dates
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upcoming Important Dates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Dates</CardTitle>
                <CardDescription>Events in the next 30 days</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-relationship-primary" />
            </CardHeader>
            <CardContent>
              {upcomingDates.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDates.slice(0, 3).map((date) => {
                    const contact = getContactById(date.contactId);
                    const eventDate = new Date(date.date);
                    const today = new Date();
                    
                    // Make sure to only compare month and day
                    const thisYearEventDate = new Date(
                      today.getFullYear(),
                      eventDate.getMonth(),
                      eventDate.getDate()
                    );
                    
                    const daysUntil = differenceInDays(thisYearEventDate, today);
                    
                    return (
                      <div key={date.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{date.title}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>
                              {contact?.name} • {format(thisYearEventDate, 'MMM d')}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {daysUntil === 0 
                            ? 'Today!' 
                            : daysUntil === 1 
                              ? 'Tomorrow' 
                              : `${daysUntil} days`}
                        </span>
                      </div>
                    );
                  })}
                  {upcomingDates.length > 3 && (
                    <Link to="/important-dates">
                      <Button variant="ghost" className="w-full justify-between" size="sm">
                        View all
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No upcoming events</p>
                  <Link to="/important-dates">
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Date
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contacts Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contacts</CardTitle>
                <CardDescription>Your relationship network</CardDescription>
              </div>
              <Users className="h-5 w-5 text-relationship-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Total Contacts</span>
                <span className="text-2xl font-bold">{contacts.length}</span>
              </div>
              <div className="space-y-2">
                {contacts.slice(0, 3).map((contact) => (
                  <div 
                    key={contact.id} 
                    className="flex items-center justify-between p-2 rounded-md bg-accent"
                  >
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-sm text-muted-foreground">{contact.relationship}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Link to="/contacts">
                  <Button size="sm">
                    Manage Contacts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Reminders & Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Reminders</CardTitle>
                <CardDescription>Stay on top of your relationships</CardDescription>
              </div>
              <Bell className="h-5 w-5 text-relationship-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Set up desktop notifications for important dates and events
                </p>
                <Button variant="outline" onClick={() => {
                  // Show a test notification
                  if (window.electron) {
                    window.electron.showNotification({
                      title: 'Bond Keeper',
                      body: 'Test notification - Notifications are working!'
                    });
                  }
                }}>
                  Test Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
