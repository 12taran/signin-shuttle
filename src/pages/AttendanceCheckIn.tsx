import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/contexts/AttendanceContext';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, Calendar, User, LogIn, LogOut, AlertCircle } from 'lucide-react';
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

  const getAvatarUrl = (email: string) => {
    const seed = email?.split('@')[0] || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  };

  const calculateHours = () => {
    if (todayRecord?.checkIn && todayRecord?.checkOut) {
      const diff = new Date(todayRecord.checkOut).getTime() - new Date(todayRecord.checkIn).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return null;
  };

  return (
    <LayoutWrapper>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .slide-in {
          animation: slideIn 0.4s ease-out;
        }
        
        .scale-in {
          animation: scaleIn 0.4s ease-out;
        }
        
        .pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      
      <div className="space-y-6">
        <div className="fade-in">
          <h1 className="text-3xl font-semibold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1">Mark your daily attendance</p>
        </div>

        {/* User Profile Card */}
        <Card className="shadow-sm border-gray-200 fade-in delay-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200">
                  <img 
                    src={getAvatarUrl(user?.email || '')} 
                    alt="Avatar"
                    className="w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Welcome back!</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm border-gray-200 hover-lift slide-in delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-700" />
                </div>
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
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 scale-in">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Check In</p>
                      <p className="text-3xl font-semibold text-foreground">
                        {formatTime(todayRecord.checkIn)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>

                  {todayRecord.checkOut ? (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 scale-in delay-100">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Check Out</p>
                        <p className="text-3xl font-semibold text-foreground">
                          {formatTime(todayRecord.checkOut)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Check Out</p>
                        <p className="text-3xl font-semibold text-muted-foreground">--:--</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-gray-400 pulse-slow" />
                      </div>
                    </div>
                  )}

                  {calculateHours() && (
                    <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 scale-in delay-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-sky-700 font-medium">Total Hours</span>
                        <span className="text-lg font-semibold text-sky-900">{calculateHours()}</span>
                      </div>
                    </div>
                  )}

                  <Badge className={`w-full justify-center py-2 ${
                    todayRecord.status === 'checked-in' 
                      ? 'bg-sky-100 text-sky-700 hover:bg-sky-200' 
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}>
                    {todayRecord.status === 'checked-in' ? 'Currently Checked In' : 'Attendance Completed'}
                  </Badge>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground font-medium">No attendance recorded today</p>
                  <p className="text-sm text-muted-foreground mt-1">Click check-in to start</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200 hover-lift slide-in delay-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-700" />
                </div>
                Actions
              </CardTitle>
              <CardDescription>Mark your attendance for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!todayRecord ? (
                <>
                  <Button 
                    onClick={handleCheckIn} 
                    disabled={isLoading}
                    className="w-full h-20 text-lg bg-gray-900 hover:bg-gray-800 group"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                        Check In
                      </>
                    )}
                  </Button>
                  <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700">Please check in when you start your workday</p>
                  </div>
                </>
              ) : !todayRecord.checkOut ? (
                <>
                  <Button 
                    onClick={handleCheckOut} 
                    disabled={isLoading}
                    variant="secondary"
                    className="w-full h-20 text-lg bg-gray-100 hover:bg-gray-200 group"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                        Check Out
                      </>
                    )}
                  </Button>
                  <div className="flex items-start gap-2 p-3 bg-sky-50 rounded-lg border border-sky-200">
                    <Clock className="h-4 w-4 text-sky-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-sky-700">Remember to check out when you finish work</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 scale-in">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-foreground font-semibold mb-1">All Done for Today!</p>
                  <p className="text-sm text-muted-foreground">See you tomorrow 👋</p>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Logged in as: <span className="font-medium text-foreground">{user?.email}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default AttendanceCheckIn;