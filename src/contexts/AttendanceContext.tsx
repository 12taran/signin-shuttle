import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userEmail: string;
  checkIn: string;
  checkOut?: string;
  date: string;
  status: 'present' | 'absent' | 'checked-in';
  checkInLocation?: { latitude: number; longitude: number; address?: string };
  checkOutLocation?: { latitude: number; longitude: number; address?: string };
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userEmail: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  leaveBalance: number;
  checkIn: () => Promise<void>;
  checkOut: () => Promise<void>;
  submitLeaveRequest: (fromDate: string, toDate: string, reason: string) => void;
  approveLeave: (id: string) => void;
  rejectLeave: (id: string) => void;
  getTodayAttendance: () => AttendanceRecord | undefined;
  getUserAttendance: (userId: string) => AttendanceRecord[];
  getUserLeaveRequests: (userId: string) => LeaveRequest[];
  isLoading: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

// Dummy data
const generateDummyAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const users = ['admin@company.com', 'employee1@company.com', 'employee2@company.com', 'employee3@company.com'];
  
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    users.forEach((email, idx) => {
      records.push({
        id: `att_${i}_${idx}`,
        userId: `user_${idx}`,
        userEmail: email,
        checkIn: `${date.toISOString().split('T')[0]}T09:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
        checkOut: i > 0 ? `${date.toISOString().split('T')[0]}T18:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00` : undefined,
        date: date.toISOString().split('T')[0],
        status: i === 0 ? 'checked-in' : 'present',
      });
    });
  }
  
  return records;
};

const generateDummyLeaveRequests = (): LeaveRequest[] => {
  return [
    {
      id: 'leave_1',
      userId: 'user_1',
      userEmail: 'employee1@company.com',
      fromDate: '2025-10-20',
      toDate: '2025-10-22',
      reason: 'Family vacation',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    },
    {
      id: 'leave_2',
      userId: 'user_2',
      userEmail: 'employee2@company.com',
      fromDate: '2025-10-15',
      toDate: '2025-10-16',
      reason: 'Medical appointment',
      status: 'approved',
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'leave_3',
      userId: 'user_3',
      userEmail: 'employee3@company.com',
      fromDate: '2025-10-18',
      toDate: '2025-10-19',
      reason: 'Personal reasons',
      status: 'rejected',
      submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ];
};

// Helper to get location
const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(generateDummyAttendance());
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(generateDummyLeaveRequests());
  const [isLoading, setIsLoading] = useState(false);
  const leaveBalance = 20; // Total annual leaves

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.find(
      record => record.userId === user?.id && record.date === today
    );
  };

  const getUserAttendance = (userId: string) => {
    return attendanceRecords.filter(record => record.userId === userId);
  };

  const getUserLeaveRequests = (userId: string) => {
    return leaveRequests.filter(request => request.userId === userId);
  };

  const checkIn = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const location = await getLocation();
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      const newRecord: AttendanceRecord = {
        id: `att_${Date.now()}`,
        userId: user.id,
        userEmail: user.email,
        checkIn: now,
        date: today,
        status: 'checked-in',
        checkInLocation: location,
      };
      
      setAttendanceRecords(prev => [newRecord, ...prev]);
    } catch (error) {
      console.error('Failed to get location:', error);
      // Still allow check-in without location
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      const newRecord: AttendanceRecord = {
        id: `att_${Date.now()}`,
        userId: user.id,
        userEmail: user.email,
        checkIn: now,
        date: today,
        status: 'checked-in',
      };
      
      setAttendanceRecords(prev => [newRecord, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkOut = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const location = await getLocation();
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      setAttendanceRecords(prev =>
        prev.map(record =>
          record.userId === user.id && record.date === today
            ? { ...record, checkOut: now, status: 'present' as const, checkOutLocation: location }
            : record
        )
      );
    } catch (error) {
      console.error('Failed to get location:', error);
      // Still allow check-out without location
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      setAttendanceRecords(prev =>
        prev.map(record =>
          record.userId === user.id && record.date === today
            ? { ...record, checkOut: now, status: 'present' as const }
            : record
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitLeaveRequest = (fromDate: string, toDate: string, reason: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const newRequest: LeaveRequest = {
        id: `leave_${Date.now()}`,
        userId: user.id,
        userEmail: user.email,
        fromDate,
        toDate,
        reason,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      
      setLeaveRequests(prev => [newRequest, ...prev]);
      setIsLoading(false);
    }, 500);
  };

  const approveLeave = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setLeaveRequests(prev =>
        prev.map(request =>
          request.id === id ? { ...request, status: 'approved' as const } : request
        )
      );
      setIsLoading(false);
    }, 500);
  };

  const rejectLeave = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setLeaveRequests(prev =>
        prev.map(request =>
          request.id === id ? { ...request, status: 'rejected' as const } : request
        )
      );
      setIsLoading(false);
    }, 500);
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        leaveRequests,
        leaveBalance,
        checkIn,
        checkOut,
        submitLeaveRequest,
        approveLeave,
        rejectLeave,
        getTodayAttendance,
        getUserAttendance,
        getUserLeaveRequests,
        isLoading,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
