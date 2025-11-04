import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Clock, Calendar, Users, Package, LogOut, FileText, UserCog, Bell } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

const employeeItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Check In/Out', url: '/attendance', icon: Clock },
  { title: 'Request Leave', url: '/leave-request', icon: FileText },
  { title: 'My Attendance', url: '/my-attendance', icon: Calendar },
  { title: 'My Leave Requests', url: '/my-leave-requests', icon: UserCog },
  { title: 'Inventory', url: '/inventory', icon: Package },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

const adminItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Employee Attendance', url: '/admin/attendance', icon: Users },
  { title: 'Leave Requests', url: '/admin/leave-requests', icon: FileText },
  { title: 'Manage Inventory', url: '/admin/inventory', icon: Package },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = user?.role === 'admin' ? adminItems : employeeItems;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
      : 'text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground';

  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground text-lg font-bold px-4 py-6">
            SignIn Shuttle
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
