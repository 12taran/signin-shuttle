import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Employee Management</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isAdmin ? "default" : "secondary"} className="capitalize">
              {user?.role}
            </Badge>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user?.email}</span>
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
            </CardContent>
          </Card>

          {isAdmin && (
            <>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage employee accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    View and manage all employee accounts in the system
                  </p>
                  <Button className="w-full">Manage Users</Button>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure system preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access administrative settings and configurations
                  </p>
                  <Button className="w-full" variant="outline">Open Settings</Button>
                </CardContent>
              </Card>
            </>
          )}

          {!isAdmin && (
            <>
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>My Tasks</CardTitle>
                  <CardDescription>View your assigned tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check your current assignments and deadlines
                  </p>
                  <Button className="w-full">View Tasks</Button>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Time Off</CardTitle>
                  <CardDescription>Request time off</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Submit and track your time off requests
                  </p>
                  <Button className="w-full" variant="outline">Request Time Off</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of system activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {isAdmin ? '24' : '5'}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isAdmin ? 'Total Employees' : 'Active Tasks'}
                </div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {isAdmin ? '8' : '3'}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isAdmin ? 'Pending Requests' : 'Completed'}
                </div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {isAdmin ? '95%' : '12'}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isAdmin ? 'System Health' : 'Hours This Week'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
