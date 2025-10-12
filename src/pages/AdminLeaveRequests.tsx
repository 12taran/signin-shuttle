import { useState } from 'react';
import { useAttendance } from '@/contexts/AttendanceContext';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Check, X, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const AdminLeaveRequests = () => {
  const { leaveRequests, approveLeave, rejectLeave, isLoading } = useAttendance();
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDays = (from: string, to: string) => {
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleApprove = (id: string, email: string) => {
    approveLeave(id);
    toast.success(`Leave request from ${email} approved`);
  };

  const handleReject = (id: string, email: string) => {
    rejectLeave(id);
    toast.error(`Leave request from ${email} rejected`);
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

  const filteredRequests = leaveRequests.filter(request =>
    request.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const approvedRequests = filteredRequests.filter(r => r.status === 'approved');
  const rejectedRequests = filteredRequests.filter(r => r.status === 'rejected');

  const LeaveRequestCard = ({ request }: { request: typeof leaveRequests[0] }) => (
    <div className="p-4 border border-border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-foreground">{request.userEmail}</p>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {formatDate(request.fromDate)} - {formatDate(request.toDate)}
            </p>
            <Badge variant="outline" className="text-xs">
              {calculateDays(request.fromDate, request.toDate)} day(s)
            </Badge>
          </div>
        </div>
        {getStatusBadge(request.status)}
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <p className="text-sm font-medium text-foreground">Reason:</p>
          <p className="text-sm text-muted-foreground">{request.reason}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Submitted on {formatDate(request.submittedAt)}
        </p>
      </div>

      {request.status === 'pending' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleApprove(request.id, request.userEmail)}
            disabled={isLoading}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleReject(request.id, request.userEmail)}
            disabled={isLoading}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <LayoutWrapper>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Leave Requests Management</h1>
        <p className="text-muted-foreground mt-1">Review and manage employee leave requests</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingRequests.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedRequests.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedRequests.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            All Leave Requests
          </CardTitle>
          <CardDescription>Manage employee leave requests by status</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-4">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No pending requests</p>
                </div>
              ) : (
                pendingRequests.map(request => (
                  <LeaveRequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4 mt-4">
              {approvedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No approved requests</p>
                </div>
              ) : (
                approvedRequests.map(request => (
                  <LeaveRequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4 mt-4">
              {rejectedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No rejected requests</p>
                </div>
              ) : (
                rejectedRequests.map(request => (
                  <LeaveRequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeaveRequests;
