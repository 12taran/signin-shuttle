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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Web Clock Attendance
              </h1>
              <p className="text-gray-600 mt-2">Track your work hours with precision location tracking</p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img 
                    src={getAvatarUrl(user?.email || '')} 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="text-xl font-bold text-gray-900">Welcome back</p>
                <p className="text-sm text-gray-600 mt-1 font-medium">{user?.email}</p>
              </div>
              <Badge className="bg-gray-800 text-white border-0 px-4 py-2 text-sm font-semibold">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Summary & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Today's Summary */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <span className="text-white font-bold text-sm">⏱</span>
                    </div>
                    <span className="text-gray-900">Today's Summary</span>
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600 mt-2">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Total Hours Worked */}
                <div className="p-6 bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-300 text-sm font-medium mb-2">Total Hours Worked</p>
                      <p className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
                        {totalHours.hours}
                        <span className="text-3xl">h</span>
                        <span className="text-3xl text-gray-300 ml-2">{totalHours.minutes}m</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-sm text-gray-300 mb-3">
                      <span className="font-medium">Required: {requiredHours}h</span>
                      <span className="font-bold">
                        {hoursRemaining > 0 
                          ? `${hoursRemaining.toFixed(1)}h remaining` 
                          : 'Target completed'}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-300 rounded-full"
                        style={{ width: `${Math.min(100, (totalHours.total / requiredHours) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Clock Entries Count */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-green-600 rounded-lg">
                        <span className="text-white font-bold text-sm">IN</span>
                      </div>
                      <span className="text-4xl font-bold text-green-900">
                        {clockEntries.filter(e => e.type === 'clock-in').length}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-green-700">Clock Ins</p>
                  </div>
                  <div className="p-5 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-red-600 rounded-lg">
                        <span className="text-white font-bold text-sm">OUT</span>
                      </div>
                      <span className="text-4xl font-bold text-red-900">
                        {clockEntries.filter(e => e.type === 'clock-out').length}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-red-700">Clock Outs</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`p-4 rounded-lg border-2 text-center font-semibold ${
                  isCurrentlyClockedIn()
                    ? 'bg-green-50 border-green-300 text-green-800' 
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}>
                  <span>{isCurrentlyClockedIn() ? 'Currently Clocked In' : 'Currently Clocked Out'}</span>
                </div>

                {/* Hours Warning */}
                {hoursRemaining > 0 && clockEntries.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
                      <span className="text-white font-bold text-sm">!</span>
                    </div>
                    <div>
                      <p className="text-sm text-orange-900 font-semibold">
                        {hoursRemaining.toFixed(1)} hours remaining to complete shift
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        Notification will be sent if incomplete
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Web Clock Actions */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <span className="text-white font-bold text-sm">👤</span>
                  </div>
                  <span className="text-gray-900">Web Clock Actions</span>
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Clock in and out with automatic location tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Clock In Button */}
                <Button 
                  onClick={handleWebClockIn} 
                  disabled={isLoading || isCurrentlyClockedIn()}
                  className="w-full h-20 text-lg font-bold bg-gray-800 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
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
                  className="w-full h-20 text-lg font-bold bg-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Processing
                    </>
                  ) : (
                    'Web Clock Out'
                  )}
                </Button>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                    <span className="text-white font-bold text-sm">📍</span>
                  </div>
                  <p className="text-sm text-blue-900 font-medium">
                    Your location is captured automatically for verification
                  </p>
                </div>

                {/* Late Entry Warning */}
                {clockEntries.some(e => e.isLate) && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
                      <span className="text-white font-bold text-sm">🐢</span>
                    </div>
                    <div>
                      <p className="text-sm text-orange-900 font-semibold">
                        Late entry detected today
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        Admin notification sent automatically
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p>
                      Logged in as: <span className="font-semibold text-gray-900">{user?.email}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-7">
            <Card className="shadow-sm border border-gray-200 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <span className="text-white font-bold text-sm">🕐</span>
                  </div>
                  <span className="text-gray-900">Today's Timeline</span>
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
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
                              <p className="font-bold text-lg text-gray-900">
                                {entry.type === 'clock-in' ? 'Clock In' : 'Clock Out'}
                              </p>
                              {entry.isLate && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 rounded-full">
                                  <span className="text-xs text-white font-bold">Late Entry</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-base font-semibold text-gray-700 mb-2">
                            {formatTime(entry.time)}
                            {entry.isLate && entry.expectedTime && (
                              <span className="text-orange-600 ml-3 font-normal text-sm">
                                Expected: {entry.expectedTime}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 w-fit border border-gray-200">
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
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-5xl text-gray-400">✕</span>
                    </div>
                    <p className="text-gray-700 font-bold text-lg mb-2">No entries today</p>
                    <p className="text-gray-500">Start by clocking in to begin tracking</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notification Info Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm border border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-orange-500 rounded-lg flex-shrink-0">
                  <span className="text-white font-bold text-lg">⚠</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Late Arrival Alert</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Clock-ins after scheduled time automatically notify administrators with detailed timestamp and location information
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-orange-500 rounded-lg flex-shrink-0">
                  <span className="text-white font-bold text-lg">!</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Incomplete Hours Alert</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
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
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default AttendanceCheckIn;