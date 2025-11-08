import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Icons removed for cleaner look
import { toast } from 'sonner';
import { useState } from 'react';

const AttendanceCheckIn = () => {
  const { user } = useAuth();
  const { getTodayAttendance, checkIn, checkOut, isLoading } = useAttendance();
  
  const todayRecord = getTodayAttendance();
  
  // Mock data for timeline - replace with actual data from backend
  const [clockEntries, setClockEntries] = useState([
    {
      id: 1,
      type: 'clock-in',
      time: '2025-10-31T09:15:00',
      location: { latitude: 30.7333, longitude: 76.7794 },
      isLate: true,
      expectedTime: '09:00 AM'
    },
    {
      id: 2,
      type: 'clock-out',
      time: '2025-10-31T11:30:00',
      location: { latitude: 30.7335, longitude: 76.7796 }
    },
    {
      id: 3,
      type: 'clock-in',
      time: '2025-10-31T11:45:00',
      location: { latitude: 30.7334, longitude: 76.7795 }
    },
    {
      id: 4,
      type: 'clock-out',
      time: '2025-10-31T14:30:00',
      location: { latitude: 30.7336, longitude: 76.7797 }
    }
  ]);

  const handleWebClockIn = async () => {
    try {
      // Add location capture logic here
      toast.success('Web clocked in successfully with location');
      // Add new entry to timeline
    } catch (error) {
      toast.error('Failed to web clock in. Please try again.');
    }
  };

  const handleWebClockOut = async () => {
    try {
      // Add location capture logic here
      toast.success('Web clocked out successfully with location');
      // Add new entry to timeline
    } catch (error) {
      toast.error('Failed to web clock out. Please try again.');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAvatarUrl = (email: string) => {
    const seed = email?.split('@')[0] || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const calculateTotalHours = () => {
    // Calculate total hours from all clock-in/clock-out pairs
    let totalMinutes = 0;
    for (let i = 0; i < clockEntries.length; i += 2) {
      if (clockEntries[i].type === 'clock-in' && clockEntries[i + 1]?.type === 'clock-out') {
        const diff = new Date(clockEntries[i + 1].time).getTime() - new Date(clockEntries[i].time).getTime();
        totalMinutes += diff / (1000 * 60);
      }
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return { hours, minutes, total: totalMinutes / 60 };
  };

  const isCurrentlyClockedIn = () => {
    if (clockEntries.length === 0) return false;
    return clockEntries[clockEntries.length - 1].type === 'clock-in';
  };

  const totalHours = calculateTotalHours();
  const requiredHours = 8;
  const hoursRemaining = Math.max(0, requiredHours - totalHours.total);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Web Clock Attendance
            </h1>
            <p className="text-muted-foreground mt-2">Track your work hours with precision location tracking</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-card rounded-lg shadow-sm border border-border">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden border-2 border-border">
                  <img 
                    src={getAvatarUrl(user?.email || '')} 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card"></div>
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold text-foreground">Welcome back</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">{user?.email}</p>
              </div>
              <Badge className="bg-primary text-primary-foreground border-0 px-4 py-2 text-sm font-semibold">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Summary & Actions */}
          <div className="space-y-6">
            {/* Today's Summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="p-3 bg-primary rounded-lg">
                    <span className="text-primary-foreground font-bold text-sm">⏱</span>
                  </div>
                  <span>Today's Summary</span>
                </CardTitle>
                <CardDescription className="mt-2">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Total Hours Worked */}
                <div className="p-6 bg-primary rounded-lg">
                  <div className="mb-4">
                    <p className="text-primary-foreground/80 text-sm font-medium mb-2">Total Hours Worked</p>
                    <p className="text-5xl font-bold text-primary-foreground tracking-tight">
                      {totalHours.hours}
                      <span className="text-3xl">h</span>
                      <span className="text-3xl opacity-80 ml-2">{totalHours.minutes}m</span>
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-primary-foreground/20">
                    <div className="flex justify-between text-sm text-primary-foreground/90 mb-3">
                      <span className="font-medium">Required: {requiredHours}h</span>
                      <span className="font-bold">
                        {hoursRemaining > 0 
                          ? `${hoursRemaining.toFixed(1)}h remaining` 
                          : 'Target completed'}
                      </span>
                    </div>
                    <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, (totalHours.total / requiredHours) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Clock Entries Count */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-green-600 rounded-lg">
                          <span className="text-white font-bold text-sm">IN</span>
                        </div>
                        <span className="text-4xl font-bold text-green-900 dark:text-green-100">
                          {clockEntries.filter(e => e.type === 'clock-in').length}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">Clock Ins</p>
                    </div>
                  </div>
                  <div className="p-5 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-red-600 rounded-lg">
                          <span className="text-white font-bold text-sm">OUT</span>
                        </div>
                        <span className="text-4xl font-bold text-red-900 dark:text-red-100">
                          {clockEntries.filter(e => e.type === 'clock-out').length}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300">Clock Outs</p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`p-4 rounded-lg border-2 text-center font-semibold ${
                  isCurrentlyClockedIn()
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800 text-green-800 dark:text-green-200' 
                    : 'bg-muted border-border text-muted-foreground'
                }`}>
                  <span>{isCurrentlyClockedIn() ? 'Currently Clocked In' : 'Currently Clocked Out'}</span>
                </div>

                {/* Hours Warning */}
                {hoursRemaining > 0 && clockEntries.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
                      <span className="text-white font-bold text-sm">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-orange-900 dark:text-orange-200 font-semibold">
                        {hoursRemaining.toFixed(1)} hours remaining to complete shift
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                        Notification will be sent if incomplete
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Web Clock Actions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="p-3 bg-primary rounded-lg">
                    <span className="text-primary-foreground font-bold text-sm">👤</span>
                  </div>
                  <span>Web Clock Actions</span>
                </CardTitle>
                <CardDescription className="mt-2">
                  Clock in and out with automatic location tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Clock In Button */}
                <Button 
                  onClick={handleWebClockIn} 
                  disabled={isLoading || isCurrentlyClockedIn()}
                  className="w-full h-20 text-lg font-bold"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin mr-3"></div>
                      Processing
                    </>
                  ) : (
                    'Web Clock In'
                  )}
                </Button>

                {/* Clock Out Button */}
                <Button 
                  onClick={handleWebClockOut} 
                  disabled={isLoading || !isCurrentlyClockedIn()}
                  variant="secondary"
                  className="w-full h-20 text-lg font-bold"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-secondary-foreground border-t-transparent rounded-full animate-spin mr-3"></div>
                      Processing
                    </>
                  ) : (
                    'Web Clock Out'
                  )}
                </Button>

                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                    <span className="text-white font-bold text-sm">📍</span>
                  </div>
                  <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                    Your location is captured automatically for verification
                  </p>
                </div>

                {/* Late Entry Warning */}
                {clockEntries.some(e => e.isLate) && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
                      <span className="text-white font-bold text-sm">🐢</span>
                    </div>
                    <div>
                      <p className="text-sm text-orange-900 dark:text-orange-200 font-semibold">
                        Late entry detected today
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                        Admin notification sent automatically
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Logged in as: <span className="font-semibold text-foreground">{user?.email}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Timeline */}
          <div>
            <Card className="shadow-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="p-3 bg-primary rounded-lg">
                    <span className="text-primary-foreground font-bold text-sm">🕐</span>
                  </div>
                  <span>Today's Timeline</span>
                </CardTitle>
                <CardDescription className="mt-2">
                  Complete history of your clock activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clockEntries.length > 0 ? (
                  <div className="relative space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {clockEntries.map((entry, index) => (
                      <div key={entry.id} className="relative pl-16">
                        {index < clockEntries.length - 1 && (
                          <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-gray-200" />
                        )}
                        <div className={`absolute left-0 top-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                          entry.type === 'clock-in' 
                            ? 'bg-green-600' 
                            : 'bg-red-600'
                        }`}>
                          <span className="text-white font-bold text-sm">
                            {entry.type === 'clock-in' ? 'IN' : 'OUT'}
                          </span>
                        </div>
                        <div className="pb-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <p className="font-bold text-lg text-foreground">
                                {entry.type === 'clock-in' ? 'Clock In' : 'Clock Out'}
                              </p>
                              {entry.isLate && (
                                <Badge className="bg-orange-500 text-white">Late Entry</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-base font-semibold text-foreground/90 mb-2">
                            {formatTime(entry.time)}
                            {entry.isLate && entry.expectedTime && (
                              <span className="text-orange-600 dark:text-orange-400 ml-3 font-normal text-sm">
                                Expected: {entry.expectedTime}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg px-3 py-2 w-fit border border-border">
                            <span className="font-mono">
                              {entry.location.latitude.toFixed(4)}, {entry.location.longitude.toFixed(4)}
                            </span>
                          </div>
                          {index < clockEntries.length - 1 && entry.type === 'clock-in' && clockEntries[index + 1].type === 'clock-out' && (
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold">
                              Duration: {(() => {
                                const diff = new Date(clockEntries[index + 1].time).getTime() - new Date(entry.time).getTime();
                                const hours = Math.floor(diff / (1000 * 60 * 60));
                                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                return `${hours}h ${minutes}m`;
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-5xl text-muted-foreground">✕</span>
                    </div>
                    <p className="text-foreground font-bold text-lg mb-2">No entries today</p>
                    <p className="text-muted-foreground">Start by clocking in to begin tracking</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notification Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-orange-500 rounded-lg flex-shrink-0">
                  <span className="text-white font-bold text-lg">⚠</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">Late Arrival Alert</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Clock-ins after scheduled time automatically notify administrators with detailed timestamp and location information
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-orange-500 rounded-lg flex-shrink-0">
                  <span className="text-white font-bold text-lg">!</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">Incomplete Hours Alert</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Automated email reminders are sent if daily required hours are not completed by end of day
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.7);
        }
      `}</style>
    </div>
  );
};

export default AttendanceCheckIn;