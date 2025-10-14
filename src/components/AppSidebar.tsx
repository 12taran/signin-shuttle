import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Clock,
  FileText,
  Calendar,
  CheckSquare,
  Package,
  Users,
  LogOut,
} from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const employeeItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Check In/Out', url: '/attendance', icon: Clock },
  { title: 'Request Leave', url: '/leave-request', icon: FileText },
  { title: 'My Attendance', url: '/my-attendance', icon: Calendar },
  { title: 'My Leave Requests', url: '/my-leave-requests', icon: CheckSquare },
  { title: 'Inventory', url: '/inventory', icon: Package },
];

const adminItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Employee Attendance', url: '/admin/attendance', icon: Users },
  { title: 'Leave Requests', url: '/admin/leave-requests', icon: FileText },
  { title: 'Manage Inventory', url: '/admin/inventory', icon: Package },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { open } = useSidebar();
  const navigate = useNavigate();

  const items = user?.role === 'admin' ? adminItems : employeeItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'hover:bg-accent hover:text-accent-foreground';

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold">
            {open && 'Employee Management'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
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
                <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
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
