import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar } from 'lucide-react';

const MyLeaveRequests = () => {
  const { user } = useAuth();
  const { getUserLeaveRequests } = useAttendance();
  
  const myRequests = getUserLeaveRequests(user?.id || '');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateDays = (from: string, to: string) => {
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const pendingCount = myRequests.filter(r => r.status === 'pending').length;
  const approvedCount = myRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = myRequests.filter(r => r.status === 'rejected').length;

  return (
    <LayoutWrapper>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Leave Requests</h1>
        <p className="text-muted-foreground mt-1">Track your leave request status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Leave Requests
          </CardTitle>
          <CardDescription>All your leave requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {myRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No leave requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          {formatDate(request.fromDate)} - {formatDate(request.toDate)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {calculateDays(request.fromDate, request.toDate)} day(s)
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Reason:</p>
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Submitted on {formatDate(request.submittedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </LayoutWrapper>

  );
};

export default MyLeaveRequests;
