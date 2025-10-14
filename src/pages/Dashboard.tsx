import { useAuth } from '@/contexts/AuthContext';
import { DashboardCard } from '@/components/DashboardCard';
import { Badge } from '@/components/ui/badge';
import { Users, CalendarCheck, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isAdmin ? (
          <>
            <DashboardCard
              title="System Overview"
              description="Quick statistics"
              icon={Users}
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Employees:</span>
                  <span className="font-bold text-foreground">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Present Today:</span>
                  <span className="font-bold text-green-600">20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending Leaves:</span>
                  <span className="font-bold text-primary">3</span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Attendance Summary"
              description="Today's attendance"
              icon={CalendarCheck}
            >
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">On Time:</span>
                  <span className="font-bold text-green-600">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Late:</span>
                  <span className="font-bold text-amber-600">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Absent:</span>
                  <span className="font-bold text-destructive">4</span>
                </div>
              </div>
            </DashboardCard>
          </>
        ) : (
          <>
            <DashboardCard
              title="Quick Actions"
              description="Get started with your tasks"
              icon={Clock}
            >
              <p className="text-sm text-muted-foreground">
                Use the sidebar to navigate to check-in, leave requests, and more.
              </p>
            </DashboardCard>
          </>
        )}

        <DashboardCard
          title="Your Profile"
          description="Account information"
          icon={Users}
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium text-sm">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
