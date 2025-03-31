
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Bell, Shield, Download, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    desktop: true,
    email: false,
    reminderDays: 7,
  });

  const handleNotificationChange = (key: string, value: boolean | number) => {
    setNotifications({
      ...notifications,
      [key]: value,
    });
    
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleExportData = () => {
    const userId = user?.id;
    if (!userId) return;
    
    // Gather all user data
    const userData = {
      contacts: JSON.parse(localStorage.getItem(`contacts_${userId}`) || '[]'),
      importantDates: JSON.parse(localStorage.getItem(`importantDates_${userId}`) || '[]'),
      surveys: JSON.parse(localStorage.getItem(`surveys_${userId}`) || '[]'),
    };
    
    // Create a download link
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bond_keeper_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const testNotification = () => {
    if (window.electron) {
      window.electron.showNotification({
        title: 'Bond Keeper',
        body: 'This is a test notification!',
      });
      
      toast({
        title: "Notification Sent",
        description: "A test notification has been sent.",
      });
    } else {
      toast({
        title: "Desktop Notifications",
        description: "Desktop notifications are only available in the desktop app.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and account settings
        </p>
      </header>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications on your desktop for upcoming events
                </p>
              </div>
              <Switch
                id="desktop-notifications"
                checked={notifications.desktop}
                onCheckedChange={(checked) => handleNotificationChange('desktop', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email reminders for important dates
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminder-days">Default Reminder Days</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="reminder-days"
                  type="number"
                  min="1"
                  max="30"
                  value={notifications.reminderDays}
                  onChange={(e) => handleNotificationChange('reminderDays', parseInt(e.target.value))}
                  className="max-w-[100px]"
                />
                <span className="text-sm text-muted-foreground">days before event</span>
              </div>
            </div>
            
            <Button variant="outline" onClick={testNotification} className="mt-2">
              Test Notification
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data & Privacy
            </CardTitle>
            <CardDescription>
              Manage your personal data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Your Data</h3>
              <p className="text-sm text-muted-foreground">
                All your data is stored locally on your device. This app does not send your 
                personal data to any server.
              </p>
            </div>
            
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="h-4 w-4" />
              Export Your Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-y-0.5">
              <div>
                <h3 className="font-medium">Log Out</h3>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
              <Button variant="outline" className="gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Log Out
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between space-y-0.5">
              <div>
                <h3 className="font-medium">Clear All Data</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all your contacts, important dates, and surveys
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (window.confirm('Are you sure? This will permanently delete ALL your data and cannot be undone.')) {
                    const userId = user?.id;
                    if (userId) {
                      localStorage.removeItem(`contacts_${userId}`);
                      localStorage.removeItem(`importantDates_${userId}`);
                      localStorage.removeItem(`surveys_${userId}`);
                      
                      toast({
                        title: "Data Cleared",
                        description: "All your data has been deleted.",
                      });
                      
                      // Reload the page to refresh all context providers
                      window.location.reload();
                    }
                  }
                }}
              >
                Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
