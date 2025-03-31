
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, Users, Calendar, BarChart3, Settings, LogOut, 
  HeartHandshake 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link to={to} className="w-full">
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 font-normal",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-sidebar border-r">
      <div className="p-4 flex items-center gap-3 h-16 border-b">
        <HeartHandshake className="h-6 w-6 text-relationship-primary" />
        <h1 className="text-lg font-semibold relationship-text-gradient">
          Bond Keeper
        </h1>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-1">
        <NavItem 
          to="/dashboard" 
          icon={<Home size={18} />} 
          label="Dashboard" 
          active={isActive('/dashboard')}
        />
        <NavItem 
          to="/contacts" 
          icon={<Users size={18} />} 
          label="Contacts" 
          active={isActive('/contacts')}
        />
        <NavItem 
          to="/important-dates" 
          icon={<Calendar size={18} />} 
          label="Important Dates" 
          active={isActive('/important-dates')}
        />
        <NavItem 
          to="/surveys" 
          icon={<BarChart3 size={18} />} 
          label="Surveys" 
          active={isActive('/surveys')}
        />
        <NavItem 
          to="/settings" 
          icon={<Settings size={18} />} 
          label="Settings" 
          active={isActive('/settings')}
        />
      </div>
      
      <div className="p-4 border-t">
        {user && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={logout}>
          <LogOut size={16} />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
