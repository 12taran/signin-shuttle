import { useState, FormEvent } from 'react';
import { useAttendance } from '@/contexts/AttendanceContext';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

const LeaveRequest = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const { submitLeaveRequest, isLoading } = useAttendance();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!fromDate || !toDate || !reason) {
      toast.error('Please fill in all fields');
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      toast.error('End date must be after start date');
      return;
    }

    submitLeaveRequest(fromDate, toDate, reason);
    toast.success('Leave request submitted successfully!');
    
    // Reset form
    setFromDate('');
    setToDate('');
    setReason('');
  };

  return (
    <LayoutWrapper>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Request Leave</h1>
        <p className="text-muted-foreground mt-1">Submit a new leave request</p>
      </div>

      <Card className="max-w-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Leave Request Form
          </CardTitle>
          <CardDescription>
            Fill in the details below to submit your leave request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate || new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for your leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Submitting...' : 'Submit Leave Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl shadow-md">
        <CardHeader>
          <CardTitle>Leave Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Requests must be submitted at least 3 days in advance</p>
          <p>• You are entitled to 20 days of paid leave per year</p>
          <p>• Sick leave requires medical documentation for absences over 3 days</p>
          <p>• Leave requests are subject to manager approval</p>
        </CardContent>
      </Card>
    </div>
    </LayoutWrapper>
  );
};

export default LeaveRequest;
