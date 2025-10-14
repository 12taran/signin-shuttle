import { useState, FormEvent } from 'react';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Calendar, FileText, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const LeaveRequest = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const { submitLeaveRequest, isLoading } = useAttendance();

  const calculateDays = () => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  };

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
    <div>
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
          50% { opacity: 0.7; }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .slide-in {
          animation: slideIn 0.4s ease-out;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .input-focus {
          transition: all 0.3s ease;
        }
        
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
      `}</style>
      
      <div className="space-y-6">
        <div className="fade-in">
          <h1 className="text-3xl font-semibold text-foreground">Request Leave</h1>
          <p className="text-muted-foreground mt-1">Submit a new leave request</p>
        </div>

        {/* Days Calculator Card */}
        {(fromDate || toDate) && (
          <Card className="max-w-2xl border-gray-200 bg-gradient-to-r from-gray-50 to-white slide-in">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Days Requested</p>
                    <p className="text-xs text-gray-600">Including weekends</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {calculateDays()}
                  <span className="text-sm font-normal text-gray-600 ml-1">
                    {calculateDays() === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="max-w-2xl shadow-sm border-gray-200 hover-lift fade-in delay-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CalendarDays className="h-5 w-5 text-gray-700" />
              </div>
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
                  <Label htmlFor="fromDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    From Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="fromDate"
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      onFocus={() => setFocusedField('fromDate')}
                      onBlur={() => setFocusedField('')}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={isLoading}
                      className={`input-focus bg-gray-50 border-gray-300 ${
                        focusedField === 'fromDate' ? 'ring-2 ring-gray-900' : ''
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    To Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="toDate"
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      onFocus={() => setFocusedField('toDate')}
                      onBlur={() => setFocusedField('')}
                      min={fromDate || new Date().toISOString().split('T')[0]}
                      disabled={isLoading}
                      className={`input-focus bg-gray-50 border-gray-300 ${
                        focusedField === 'toDate' ? 'ring-2 ring-gray-900' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  Reason
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for your leave request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onFocus={() => setFocusedField('reason')}
                  onBlur={() => setFocusedField('')}
                  rows={5}
                  disabled={isLoading}
                  className={`input-focus bg-gray-50 border-gray-300 resize-none ${
                    focusedField === 'reason' ? 'ring-2 ring-gray-900' : ''
                  }`}
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Be specific about your reason for better approval chances
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gray-900 hover:bg-gray-800 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    Submit Leave Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="max-w-2xl shadow-sm border-gray-200 hover-lift fade-in delay-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              Leave Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Clock className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">Requests must be submitted at least 3 days in advance</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <CalendarDays className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">You are entitled to 20 days of paid leave per year</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FileText className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">Sick leave requires medical documentation for absences over 3 days</p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <CheckCircle className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">Leave requests are subject to manager approval</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaveRequest;