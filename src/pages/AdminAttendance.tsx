import { useState } from 'react';
import { useAttendance } from '@/contexts/AttendanceContext';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Search } from 'lucide-react';

const AdminAttendance = () => {
  const { attendanceRecords } = useAttendance();
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateHours = (checkIn: string, checkOut?: string) => {
    if (!checkOut) return '--';
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default">Present</Badge>;
      case 'checked-in':
        return <Badge variant="secondary">Checked In</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredRecords = attendanceRecords.filter(record =>
    record.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayRecords = filteredRecords.filter(
    record => record.date === new Date().toISOString().split('T')[0]
  );

  const totalEmployees = new Set(attendanceRecords.map(r => r.userId)).size;
  const presentToday = todayRecords.filter(r => r.status !== 'absent').length;

  return (
    <LayoutWrapper>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Employee Attendance</h1>
        <p className="text-muted-foreground mt-1">Monitor all employee attendance records</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalEmployees}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{presentToday}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(0) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Attendance Records
              </CardTitle>
              <CardDescription>Complete attendance history for all employees</CardDescription>
            </div>
          </div>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.slice(0, 50).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.userEmail}</TableCell>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>{formatTime(record.checkIn)}</TableCell>
                      <TableCell>{formatTime(record.checkOut)}</TableCell>
                      <TableCell>{calculateHours(record.checkIn, record.checkOut)}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAttendance;
