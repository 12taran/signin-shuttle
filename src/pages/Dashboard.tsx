import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Calendar, Users, CheckSquare } from 'lucide-react';

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
          {!isAdmin && (
            <>
              <Link to="/attendance">
                <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Attendance
                    </CardTitle>
                    <CardDescription>Mark your check-in/check-out</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Record your daily attendance and view history
                    </p>
                    <Button className="w-full">Go to Attendance</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/leave-request">
                <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Request Leave
                    </CardTitle>
                    <CardDescription>Submit leave requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Apply for time off and track your requests
                    </p>
                    <Button className="w-full">Request Leave</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/my-attendance">
                <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      My History
                    </CardTitle>
                    <CardDescription>View attendance records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Check your attendance history and stats
                    </p>
                    <Button className="w-full" variant="outline">View History</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/my-leave-requests">
                <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      My Leaves
                    </CardTitle>
                    <CardDescription>Track leave status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      View all your leave requests and their status
                    </p>
                    <Button className="w-full" variant="outline">View Leaves</Button>
                  </CardContent>
                </Card>
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/attendance">
                <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Employee Attendance
                    </CardTitle>
                    <CardDescription>Monitor all attendance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      View and manage employee attendance records
                    </p>
                    <Button className="w-full">View Attendance</Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/leave-requests">
                <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Leave Requests
                    </CardTitle>
                    <CardDescription>Approve or reject leaves</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review and manage employee leave requests
                    </p>
                    <Button className="w-full">Manage Requests</Button>
                  </CardContent>
                </Card>
              </Link>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>System Overview</CardTitle>
                  <CardDescription>Quick statistics</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </>
          )}

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Account information</CardDescription>
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
