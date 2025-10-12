import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const AttendanceCheckIn = () => {
  const { user } = useAuth();
  const { getTodayAttendance, checkIn, checkOut, isLoading } = useAttendance();
  
  const todayRecord = getTodayAttendance();

  const handleCheckIn = () => {
    checkIn();
    toast.success('Checked in successfully!');
  };

  const handleCheckOut = () => {
    checkOut();
    toast.success('Checked out successfully!');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <LayoutWrapper>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground mt-1">Mark your daily attendance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Status
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayRecord ? (
              <>
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Check In</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatTime(todayRecord.checkIn)}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                {todayRecord.checkOut ? (
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Check Out</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatTime(todayRecord.checkOut)}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Check Out</p>
                      <p className="text-2xl font-bold text-muted-foreground">--:--</p>
                    </div>
                    <XCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                <Badge className="w-full justify-center py-2">
                  {todayRecord.status === 'checked-in' ? 'Currently Checked In' : 'Completed'}
                </Badge>
              </>
            ) : (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No attendance recorded today</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Mark your attendance for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!todayRecord ? (
              <Button 
                onClick={handleCheckIn} 
                disabled={isLoading}
                className="w-full h-20 text-lg"
              >
                {isLoading ? 'Processing...' : 'Check In'}
              </Button>
            ) : !todayRecord.checkOut ? (
              <Button 
                onClick={handleCheckOut} 
                disabled={isLoading}
                variant="secondary"
                className="w-full h-20 text-lg"
              >
                {isLoading ? 'Processing...' : 'Check Out'}
              </Button>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <p className="text-foreground font-medium">Attendance completed for today</p>
                <p className="text-sm text-muted-foreground mt-1">See you tomorrow!</p>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Logged in as: <span className="font-medium text-foreground">{user?.email}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </LayoutWrapper>
  );
};

export default AttendanceCheckIn;
